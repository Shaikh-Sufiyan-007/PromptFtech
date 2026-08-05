const Prompt = require('../models/Prompt');
const Category = require('../models/Category');

// @desc    Get all published prompts with filtering, search, and pagination
// @route   GET /api/prompts
// @access  Public
const getPrompts = async (req, res) => {
  try {
    const { search, category, aiModel, tag, sort, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    // Text search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter (by slug or ObjectId)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catObj = await Category.findOne({ slug: category });
        if (catObj) {
          query.category = catObj._id;
        }
      }
    }

    // AI Model filter
    if (aiModel) {
      query.aiModel = aiModel;
    }

    // Tag filter
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { copiesCount: -1, viewsCount: -1 };
    } else if (sort === 'liked') {
      sortOptions = { likesCount: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const prompts = await Prompt.find(query)
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      prompts,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending prompts for homepage
// @route   GET /api/prompts/trending
// @access  Public
const getTrendingPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ isPublished: true })
      .populate('category', 'name slug icon')
      .sort({ copiesCount: -1, viewsCount: -1 })
      .limit(6);

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single prompt by ID or slug & increment view count
// @route   GET /api/prompts/:id
// @access  Public
const getPromptById = async (req, res) => {
  try {
    let prompt;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      prompt = await Prompt.findById(req.params.id).populate('category', 'name slug icon tags');
    } else {
      prompt = await Prompt.findOne({ slug: req.params.id }).populate('category', 'name slug icon tags');
    }

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    prompt.viewsCount += 1;
    await prompt.save();

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment copy count when user clicks "One-Click Copy"
// @route   POST /api/prompts/:id/copy
// @access  Public
const incrementCopyCount = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    prompt.copiesCount += 1;
    await prompt.save();

    res.json({ copiesCount: prompt.copiesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment like count when user clicks "Like"
// @route   POST /api/prompts/:id/like
// @access  Public
const incrementLikeCount = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    prompt.likesCount += 1;
    await prompt.save();
    res.json({ likesCount: prompt.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPrompts,
  getTrendingPrompts,
  getPromptById,
  incrementCopyCount,
  incrementLikeCount,
};
