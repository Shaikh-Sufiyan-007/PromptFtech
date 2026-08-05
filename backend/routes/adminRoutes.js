const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  getAnalytics,
  createPrompt,
  updatePrompt,
  deletePrompt,
} = require('../controllers/adminController');
const { isAdmin } = require('../middleware/adminAuthMiddleware');

// Public Admin Login
router.post('/login', adminLogin);

// Protected Admin Routes
router.get('/me', isAdmin, getAdminProfile);
router.get('/analytics', isAdmin, getAnalytics);
router.post('/prompts', isAdmin, createPrompt);
router.put('/prompts/:id', isAdmin, updatePrompt);
router.delete('/prompts/:id', isAdmin, deletePrompt);

module.exports = router;
