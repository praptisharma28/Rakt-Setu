const inventoryModel = require('../../models/inventoryModel');

// Blood Demand Prediction Controller
const predictBloodDemand = async (req, res) => {
  try {
    const { bloodType, days = 7 } = req.query;

    // Get historical data for the past 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const historicalData = await inventoryModel.find({
      createdAt: { $gte: ninetyDaysAgo }
    });

    if (!historicalData || historicalData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Insufficient historical data for prediction',
        prediction: {
          bloodType: bloodType || 'All',
          forecastDays: parseInt(days),
          prediction: 'Not enough data',
          confidence: 'Low'
        }
      });
    }

    // Analyze historical patterns
    const analysis = analyzeHistoricalData(historicalData, bloodType);

    // Generate prediction using simple moving average and trend analysis
    const prediction = generatePrediction(analysis, parseInt(days), bloodType);

    res.status(200).json({
      success: true,
      message: `Blood demand prediction for next ${days} days`,
      prediction,
      historicalAnalysis: analysis,
      aiInsights: generateInsights(prediction, analysis)
    });

  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating prediction',
      error: error.message
    });
  }
};

// Analyze historical data
const analyzeHistoricalData = (data, bloodType) => {
  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const analysis = {};

  // Filter by blood type if specified
  const filteredData = bloodType
    ? data.filter(d => d.bloodGroup === bloodType)
    : data;

  // Group by blood type
  for (const group of bloodGroups) {
    const groupData = bloodType
      ? filteredData
      : data.filter(d => d.bloodGroup === group);

    const donations = groupData.filter(d => d.inventoryType === 'in');
    const requests = groupData.filter(d => d.inventoryType === 'out');

    const totalDonated = donations.reduce((sum, d) => sum + d.quantity, 0);
    const totalRequested = requests.reduce((sum, d) => sum + d.quantity, 0);

    analysis[group] = {
      totalDonations: donations.length,
      totalRequests: requests.length,
      totalQuantityDonated: totalDonated,
      totalQuantityRequested: totalRequested,
      netBalance: totalDonated - totalRequested,
      averageDonationPerDay: totalDonated / 90,
      averageRequestPerDay: totalRequested / 90,
      trend: totalRequested > totalDonated ? 'increasing_demand' : 'stable'
    };
  }

  return bloodType ? analysis[bloodType] : analysis;
};

// Generate prediction
const generatePrediction = (analysis, days, bloodType) => {
  if (bloodType && analysis && analysis.averageRequestPerDay !== undefined) {
    // Single blood type prediction
    return generateSingleTypePrediction(analysis, days, bloodType);
  }

  // All blood types prediction
  const predictions = {};
  for (const [type, data] of Object.entries(analysis)) {
    predictions[type] = generateSingleTypePrediction(data, days, type);
  }

  return predictions;
};

// Generate prediction for single blood type
const generateSingleTypePrediction = (data, days, bloodType) => {
  const avgRequest = data.averageRequestPerDay;
  const avgDonation = data.averageDonationPerDay;

  // Apply trend multiplier
  let trendMultiplier = 1.0;
  if (data.trend === 'increasing_demand') {
    trendMultiplier = 1.2; // 20% increase
  }

  // Calculate predicted demand
  const predictedDailyDemand = avgRequest * trendMultiplier;
  const predictedTotalDemand = Math.round(predictedDailyDemand * days);

  // Calculate predicted supply
  const predictedTotalSupply = Math.round(avgDonation * days);

  // Calculate expected shortage/surplus
  const expectedBalance = predictedTotalSupply - predictedTotalDemand;

  // Determine status
  let status = 'Normal';
  let alertLevel = 'low';

  if (expectedBalance < -10) {
    status = 'Critical Shortage Expected';
    alertLevel = 'critical';
  } else if (expectedBalance < 0) {
    status = 'Shortage Expected';
    alertLevel = 'high';
  } else if (expectedBalance > 20) {
    status = 'Surplus Expected';
    alertLevel = 'low';
  }

  // Calculate confidence based on data quantity
  let confidence = 'Medium';
  if (data.totalRequests > 50) confidence = 'High';
  else if (data.totalRequests < 20) confidence = 'Low';

  return {
    bloodType,
    forecastPeriod: `${days} days`,
    predictedDemand: predictedTotalDemand,
    predictedSupply: predictedTotalSupply,
    expectedBalance,
    status,
    alertLevel,
    confidence,
    dailyAverage: Math.round(predictedDailyDemand * 10) / 10,
    trend: data.trend,
    recommendation: getRecommendation(expectedBalance, bloodType, days)
  };
};

// Get recommendation based on prediction
const getRecommendation = (balance, bloodType, days) => {
  if (balance < -10) {
    return `URGENT: Organize immediate donation drive for ${bloodType}. Expected shortage of ${Math.abs(balance)} units in ${days} days.`;
  } else if (balance < 0) {
    return `Plan donation drive for ${bloodType} within next week. Expected shortage of ${Math.abs(balance)} units.`;
  } else if (balance > 30) {
    return `${bloodType} supply is adequate. Focus on other blood types or plan redistribution.`;
  }
  return `${bloodType} supply-demand balance is normal. Maintain current donation schedule.`;
};

// Generate AI insights
const generateInsights = (prediction, analysis) => {
  const insights = [];

  if (typeof prediction === 'object' && !prediction.bloodType) {
    // Multiple blood types
    for (const [type, pred] of Object.entries(prediction)) {
      if (pred.alertLevel === 'critical') {
        insights.push(`⚠️ CRITICAL: ${type} shortage predicted`);
      } else if (pred.alertLevel === 'high') {
        insights.push(`⚡ ${type} may face shortage soon`);
      }
    }

    // Find most critical blood type
    const critical = Object.entries(prediction)
      .filter(([_, p]) => p.expectedBalance < 0)
      .sort((a, b) => a[1].expectedBalance - b[1].expectedBalance);

    if (critical.length > 0) {
      insights.push(`🎯 Priority: Focus on ${critical[0][0]} blood type`);
    }
  } else {
    // Single blood type
    if (prediction.alertLevel === 'critical') {
      insights.push('⚠️ IMMEDIATE ACTION REQUIRED');
      insights.push('📢 Launch emergency donation appeal');
    } else if (prediction.alertLevel === 'high') {
      insights.push('⚡ Plan proactive measures');
    } else {
      insights.push('✅ Supply levels are healthy');
    }
  }

  return insights;
};

// Inventory Optimization Controller
const optimizeInventory = async (req, res) => {
  try {
    // Get all inventory with organisation details
    const inventory = await inventoryModel
      .find({ inventoryType: 'in' })
      .populate('organisation', 'organisationName address')
      .sort({ createdAt: 1 });

    const recommendations = [];
    const expiryWarnings = [];

    // Group by blood type and organisation
    const inventoryMap = {};

    for (const item of inventory) {
      const key = `${item.bloodGroup}_${item.organisation._id}`;

      if (!inventoryMap[key]) {
        inventoryMap[key] = {
          bloodGroup: item.bloodGroup,
          organisation: item.organisation,
          units: [],
          totalQuantity: 0
        };
      }

      inventoryMap[key].units.push(item);
      inventoryMap[key].totalQuantity += item.quantity;

      // Check for expiry (blood typically lasts 42 days)
      const daysSinceDonation = Math.floor(
        (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceDonation >= 35 && daysSinceDonation < 42) {
        expiryWarnings.push({
          bloodGroup: item.bloodGroup,
          quantity: item.quantity,
          organisation: item.organisation.organisationName,
          daysUntilExpiry: 42 - daysSinceDonation,
          severity: daysSinceDonation >= 40 ? 'critical' : 'warning'
        });
      }
    }

    // Generate optimization recommendations
    for (const [key, data] of Object.entries(inventoryMap)) {
      if (data.totalQuantity > 50) {
        recommendations.push({
          type: 'redistribution',
          bloodGroup: data.bloodGroup,
          currentStock: data.totalQuantity,
          organisation: data.organisation.organisationName,
          recommendation: `Consider redistributing excess ${data.bloodGroup} blood to hospitals with higher demand`,
          priority: 'medium'
        });
      } else if (data.totalQuantity < 10) {
        recommendations.push({
          type: 'shortage_warning',
          bloodGroup: data.bloodGroup,
          currentStock: data.totalQuantity,
          organisation: data.organisation.organisationName,
          recommendation: `Low stock alert for ${data.bloodGroup}. Organize donation drive`,
          priority: 'high'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Inventory optimization analysis complete',
      data: {
        totalRecommendations: recommendations.length,
        expiryWarnings: expiryWarnings.length,
        recommendations: recommendations.sort((a, b) =>
          a.priority === 'high' ? -1 : 1
        ),
        expiryAlerts: expiryWarnings.sort((a, b) =>
          a.daysUntilExpiry - b.daysUntilExpiry
        )
      },
      aiInsights: {
        summary: `Found ${recommendations.length} optimization opportunities and ${expiryWarnings.length} expiry warnings`,
        criticalActions: expiryWarnings.filter(w => w.severity === 'critical').length,
        estimatedSavings: `${expiryWarnings.length * 500} units from expiry prevention`
      }
    });

  } catch (error) {
    console.error('Inventory Optimization Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error optimizing inventory',
      error: error.message
    });
  }
};

module.exports = {
  predictBloodDemand,
  optimizeInventory
};
