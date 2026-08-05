const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    aiModel: {
      type: String,
      required: true,
      enum: ['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'DALL-E', 'Gemini', 'Other'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    content: {
      type: String,
      required: [true, 'Prompt content is required'],
    },
    parameters: {
      aspectRatio: String,
      version: String,
      negativePrompt: String,
      temperature: Number,
      seed: Number,
    },
    description: String,
    sampleOutputUrl: String,
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    copiesCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
promptSchema.index({ title: 'text', content: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Prompt', promptSchema);
