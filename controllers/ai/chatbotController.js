// AI Chatbot Controller for Blood Donation Queries

// Knowledge base for common questions
const knowledgeBase = {
  eligibility: {
    keywords: ['can i donate', 'eligible', 'qualification', 'requirements', 'who can donate'],
    responses: [
      {
        condition: 'age',
        answer: 'You must be between 18-65 years old to donate blood. First-time donors over 60 may require medical approval.'
      },
      {
        condition: 'weight',
        answer: 'Minimum weight requirement is 50 kg (110 lbs) to safely donate blood.'
      },
      {
        condition: 'general',
        answer: 'To be eligible for blood donation, you must be:\n• 18-65 years old\n• Weigh at least 50 kg\n• Be in good health\n• Have adequate hemoglobin levels (12.5 g/dL or higher)\n• No recent tattoos, piercings, or surgeries (last 6 months)'
      }
    ]
  },

  frequency: {
    keywords: ['how often', 'frequency', 'when can i donate again', 'next donation', 'gap between'],
    responses: [
      {
        condition: 'general',
        answer: 'Donation frequency:\n• Whole blood: Every 56 days (8 weeks)\n• Platelets: Every 7 days (up to 24 times/year)\n• Plasma: Every 28 days\n• Double red cells: Every 112 days (16 weeks)'
      }
    ]
  },

  process: {
    keywords: ['donation process', 'how to donate', 'what happens', 'procedure', 'steps'],
    responses: [
      {
        condition: 'general',
        answer: 'Blood Donation Process:\n1. Registration & health questionnaire (10 min)\n2. Mini health screening (blood pressure, temperature, hemoglobin) (5 min)\n3. Donation (8-10 min for whole blood)\n4. Rest and refreshments (10-15 min)\n\nTotal time: About 45 minutes'
      }
    ]
  },

  bloodTypes: {
    keywords: ['blood type', 'blood group', 'compatible', 'universal donor', 'universal recipient'],
    responses: [
      {
        condition: 'o-',
        answer: 'O- is the universal donor! O- blood can be given to patients of any blood type. This makes O- donors especially valuable in emergencies.'
      },
      {
        condition: 'ab+',
        answer: 'AB+ is the universal recipient! AB+ individuals can receive blood from any blood type, but can only donate to other AB+ patients.'
      },
      {
        condition: 'general',
        answer: 'Blood Type Compatibility:\n• O- : Universal donor (can donate to all)\n• O+ : Can donate to O+, A+, B+, AB+\n• A- : Can donate to A-, A+, AB-, AB+\n• A+ : Can donate to A+, AB+\n• B- : Can donate to B-, B+, AB-, AB+\n• B+ : Can donate to B+, AB+\n• AB- : Can donate to AB-, AB+\n• AB+ : Universal recipient (can receive from all)'
      }
    ]
  },

  medical: {
    keywords: ['diabetes', 'blood pressure', 'medication', 'health condition', 'disease', 'covid', 'vaccination'],
    responses: [
      {
        condition: 'diabetes',
        answer: 'People with well-controlled diabetes can donate blood. However, you should NOT donate if you have taken insulin derived from cattle in the UK. Always consult with the medical team on-site.'
      },
      {
        condition: 'blood pressure',
        answer: 'You can donate if your blood pressure is controlled with medication and within acceptable range (usually 90-180 systolic, 50-100 diastolic). The medical team will check before donation.'
      },
      {
        condition: 'covid',
        answer: 'After COVID-19:\n• Wait 14 days after full recovery if no symptoms\n• Wait 7 days after COVID vaccination\n• You can donate plasma with antibodies for convalescent plasma therapy (special program)'
      },
      {
        condition: 'medication',
        answer: 'Most medications do NOT prevent donation. However, you cannot donate while taking:\n• Antibiotics (wait 7 days after last dose)\n• Blood thinners\n• Certain acne medications (isotretinoin)\nPlease inform the medical staff about all medications.'
      }
    ]
  },

  aftercare: {
    keywords: ['after donation', 'side effects', 'what to do', 'recovery', 'care', 'rest'],
    responses: [
      {
        condition: 'general',
        answer: 'After Donation Care:\n• Drink extra fluids for 24-48 hours\n• Avoid strenuous activity for 24 hours\n• Keep bandage on for 4-6 hours\n• Eat iron-rich foods\n• If you feel dizzy, sit or lie down immediately\n\nMost donors feel normal within a few hours. Your body replaces the fluid within 24 hours and red cells within 4-6 weeks.'
      }
    ]
  },

  benefits: {
    keywords: ['benefits', 'why donate', 'advantages', 'health benefits'],
    responses: [
      {
        condition: 'general',
        answer: 'Benefits of Blood Donation:\n• Save up to 3 lives with one donation\n• Free health screening\n• Reduces risk of heart disease\n• Burns calories (~650 per donation)\n• Stimulates production of new blood cells\n• Free blood group testing\n• Sense of fulfillment and community service\n• May reduce risk of certain cancers'
      }
    ]
  },

  appointment: {
    keywords: ['book appointment', 'schedule', 'register', 'sign up', 'when to come'],
    responses: [
      {
        condition: 'general',
        answer: 'To schedule a donation:\n1. Register on our platform\n2. Complete your health profile\n3. Check for upcoming donation drives near you\n4. Book a convenient time slot\n5. Receive confirmation via email/SMS\n\nWalk-ins are also welcome at most locations, but appointments are preferred to avoid wait times.'
      }
    ]
  }
};

// Intent classification
const classifyIntent = (message) => {
  const lowerMessage = message.toLowerCase();

  for (const [intent, data] of Object.entries(knowledgeBase)) {
    for (const keyword of data.keywords) {
      if (lowerMessage.includes(keyword)) {
        return intent;
      }
    }
  }

  return 'general';
};

// Extract specific condition from message
const extractCondition = (message, intent) => {
  const lowerMessage = message.toLowerCase();

  if (intent === 'bloodTypes') {
    if (lowerMessage.includes('o-') || lowerMessage.includes('o negative')) return 'o-';
    if (lowerMessage.includes('ab+') || lowerMessage.includes('ab positive')) return 'ab+';
  }

  if (intent === 'medical') {
    if (lowerMessage.includes('diabetes')) return 'diabetes';
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) return 'blood pressure';
    if (lowerMessage.includes('covid') || lowerMessage.includes('coronavirus')) return 'covid';
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) return 'medication';
  }

  return 'general';
};

// Get response from knowledge base
const getResponse = (intent, condition) => {
  const intentData = knowledgeBase[intent];

  if (!intentData) {
    return 'I can help you with questions about blood donation! Ask me about eligibility, the donation process, blood types, health conditions, or how to schedule an appointment.';
  }

  // Find matching response
  const response = intentData.responses.find(r => r.condition === condition);

  if (response) {
    return response.answer;
  }

  // Return general response for the intent
  const generalResponse = intentData.responses.find(r => r.condition === 'general');
  return generalResponse ? generalResponse.answer : intentData.responses[0].answer;
};

// Generate follow-up suggestions
const getSuggestions = (intent) => {
  const suggestions = {
    eligibility: ['Donation frequency', 'Donation process', 'Health requirements'],
    frequency: ['Donation process', 'After donation care'],
    process: ['Book appointment', 'What to bring'],
    bloodTypes: ['Who can I donate to?', 'Universal donor'],
    medical: ['Medication restrictions', 'After donation care'],
    aftercare: ['Benefits of donation', 'When can I donate again'],
    benefits: ['Book appointment', 'Donation process'],
    appointment: ['What to bring', 'Donation process']
  };

  return suggestions[intent] || ['Donation eligibility', 'Donation process', 'Book appointment'];
};

// Main Chatbot Controller
const chatbotQuery = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Classify intent
    const intent = classifyIntent(message);

    // Extract specific condition
    const condition = extractCondition(message, intent);

    // Get response
    const response = getResponse(intent, condition);

    // Get suggestions for follow-up
    const suggestions = getSuggestions(intent);

    // Build response
    const chatResponse = {
      success: true,
      data: {
        userMessage: message,
        botResponse: response,
        intent,
        suggestions,
        timestamp: new Date()
      },
      meta: {
        confidence: intent !== 'general' ? 'high' : 'medium',
        source: 'knowledge_base'
      }
    };

    // Log conversation (optional - can be saved to DB for learning)
    console.log(`[Chatbot] User: ${message} | Intent: ${intent} | Condition: ${condition}`);

    res.status(200).json(chatResponse);

  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chatbot query',
      error: error.message
    });
  }
};

// Get chatbot statistics
const getChatbotStats = async (req, res) => {
  try {
    // In production, this would query conversation logs from database
    res.status(200).json({
      success: true,
      data: {
        totalConversations: 0, // Would come from DB
        averageResponseTime: '50ms',
        topIntents: [
          { intent: 'eligibility', count: 145 },
          { intent: 'bloodTypes', count: 98 },
          { intent: 'process', count: 87 }
        ],
        satisfactionRate: '92%',
        availableIntents: Object.keys(knowledgeBase)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chatbot stats',
      error: error.message
    });
  }
};

module.exports = {
  chatbotQuery,
  getChatbotStats
};
