const Admin = require('../models/Admin');
const Prompt = require('../models/Prompt');
const Category = require('../models/Category');
const generateToken = require('../utils/generateToken');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
  console.log('Fetched admin:', admin);
  const isPasswordMatch = admin ? await admin.matchPassword(password) : false;
  console.log('Password match result:', isPasswordMatch);

  if (!admin || !isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid admin email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private/Admin
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalPrompts = await Prompt.countDocuments({});
    const totalCategories = await Category.countDocuments({});

    const aggregateStats = await Prompt.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewsCount' },
          totalCopies: { $sum: '$copiesCount' },
          totalLikes: { $sum: '$likesCount' },
        },
      },
    ]);

    const stats = aggregateStats[0] || { totalViews: 0, totalCopies: 0, totalLikes: 0 };

    res.json({
      totalPrompts,
      totalCategories,
      totalViews: stats.totalViews,
      totalCopies: stats.totalCopies,
      totalLikes: stats.totalLikes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new prompt (Admin Only)
// @route   POST /api/admin/prompts (or POST /api/prompts)
// @access  Private/Admin
const createPrompt = async (req, res) => {
  try {
    const { title, aiModel, category, tags, content, parameters, description, sampleOutputUrl } = req.body;

    if (!title || !aiModel || !category || !content) {
      return res.status(400).json({ message: 'Please provide title, AI Model, category, and prompt content' });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const prompt = await Prompt.create({
      title,
      slug,
      aiModel,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      content,
      parameters: parameters || {},
      description,
      sampleOutputUrl,
      isPublished: true,
    });

    const populatedPrompt = await Prompt.findById(prompt._id).populate('category', 'name slug icon');
    res.status(201).json(populatedPrompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing prompt (Admin Only)
// @route   PUT /api/admin/prompts/:id
// @access  Private/Admin
const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    const { title, aiModel, category, tags, content, parameters, description, sampleOutputUrl, isPublished } = req.body;

    if (title) {
      prompt.title = title;
      prompt.slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;
    }
    if (aiModel) prompt.aiModel = aiModel;
    if (category) prompt.category = category;
    if (tags) prompt.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags);
    if (content) prompt.content = content;
    if (parameters) prompt.parameters = parameters;
    if (description !== undefined) prompt.description = description;
    if (sampleOutputUrl !== undefined) prompt.sampleOutputUrl = sampleOutputUrl;
    if (isPublished !== undefined) prompt.isPublished = isPublished;

    const updatedPrompt = await prompt.save();
    const populated = await Prompt.findById(updatedPrompt._id).populate('category', 'name slug icon');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a prompt (Admin Only)
// @route   DELETE /api/admin/prompts/:id
// @access  Private/Admin
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    await prompt.deleteOne();
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  getAnalytics,
  createPrompt,
  updatePrompt,
  deletePrompt,
};
