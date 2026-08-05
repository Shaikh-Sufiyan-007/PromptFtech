const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { isAdmin } = require('../middleware/adminAuthMiddleware');

router.route('/').get(getCategories).post(isAdmin, createCategory);
router.route('/:id').put(isAdmin, updateCategory).delete(isAdmin, deleteCategory);

module.exports = router;
