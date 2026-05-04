const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");
const {
  bloodGroupDetailsContoller,
  globalStatsController,
} = require("../controllers/analyticsController");

const router = express.Router();

//routes

//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddelware, bloodGroupDetailsContoller);

//GET GLOBAL STATS
router.get("/stats", authMiddelware, globalStatsController);

module.exports = router;