const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createRequest,
  getAvailableRequests,
  acceptRequest,
  completeRequest,
  cancelRequest,
  getMyRequests,
  getMapData
} = require('../controllers/requestController');

const router = express.Router();

router.get('/map', authMiddleware, getMapData);
router.get('/mine', authMiddleware, getMyRequests);
router.get('/available', authMiddleware, getAvailableRequests);
router.post('/create', authMiddleware, createRequest);
router.patch('/:id/accept', authMiddleware, acceptRequest);
router.patch('/:id/complete', authMiddleware, completeRequest);
router.patch('/:id/cancel', authMiddleware, cancelRequest);

module.exports = router;
