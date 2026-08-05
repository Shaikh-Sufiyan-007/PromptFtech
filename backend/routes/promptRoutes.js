const express = require('express');
const router = express.Router();
const {
  getPrompts,
  getTrendingPrompts,
  getPromptById,
  incrementCopyCount,
  incrementLikeCount,
} = require('../controllers/promptController');

router.get('/', getPrompts);
router.get('/trending', getTrendingPrompts);
router.get('/:id', getPromptById);
router.post('/:id/copy', incrementCopyCount);
router.post('/:id/like', incrementLikeCount);

module.exports = router;
