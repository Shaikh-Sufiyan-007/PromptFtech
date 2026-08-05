const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Prompt = require('../models/Prompt');

dotenv.config();

const categoriesData = [
  {
    name: 'Art & Design',
    slug: 'art-design',
    description: 'Prompts for Midjourney, Stable Diffusion, DALL-E, and photorealistic AI art',
    icon: 'Palette',
    tags: [
      { name: 'Photorealism', slug: 'photorealism' },
      { name: 'Logo Design', slug: 'logo-design' },
      { name: '3D Render', slug: '3d-render' },
      { name: 'Anime', slug: 'anime' },
    ],
  },
  {
    name: 'Coding & Tech',
    slug: 'coding-tech',
    description: 'Prompts for full-stack engineering, debugging, code generation, and architecture',
    icon: 'Code',
    tags: [
      { name: 'React', slug: 'react' },
      { name: 'Python', slug: 'python' },
      { name: 'Refactoring', slug: 'refactoring' },
      { name: 'SQL', slug: 'sql' },
    ],
  },
  {
    name: 'Writing & Copywriting',
    slug: 'writing-copywriting',
    description: 'Blog posts, SEO copy, email newsletters, and creative storytelling',
    icon: 'PenTool',
    tags: [
      { name: 'SEO', slug: 'seo' },
      { name: 'Cold Email', slug: 'cold-email' },
      { name: 'Blog Post', slug: 'blog-post' },
      { name: 'Copywriting', slug: 'copywriting' },
    ],
  },
  {
    name: 'Marketing & Business',
    slug: 'marketing-business',
    description: 'SaaS pitch decks, ad copy, product launches, and social media growth',
    icon: 'TrendingUp',
    tags: [
      { name: 'Ad Copy', slug: 'ad-copy' },
      { name: 'Social Media', slug: 'social-media' },
      { name: 'Startup Pitch', slug: 'startup-pitch' },
    ],
  },
];

const seedAdminAndContent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/promptseen_db');
    console.log('Connected to MongoDB for Single-Admin seeding...');

    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Prompt.deleteMany({});

    // Create Single Admin Account
    const adminEmail = 'admin@promptseen.com';
    const adminPassword = 'adminpassword123';

    const admin = await Admin.create({
      name: 'Primary System Admin',
      email: adminEmail,
      password: adminPassword,
    });

    console.log(`Single Admin Account Created: ${admin.email}`);

    // Create Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log('Categories Seeded');

    const artCategory = createdCategories.find((c) => c.slug === 'art-design');
    const codeCategory = createdCategories.find((c) => c.slug === 'coding-tech');
    const writeCategory = createdCategories.find((c) => c.slug === 'writing-copywriting');
    const mktCategory = createdCategories.find((c) => c.slug === 'marketing-business');

    // Create Initial Prompts
    const samplePrompts = [
      {
        title: 'Hyper-Realistic Cyberpunk Cinematic Portrait',
        slug: 'hyper-realistic-cyberpunk-cinematic-portrait',
        aiModel: 'Midjourney',
        category: artCategory._id,
        tags: ['photorealism', 'cyberpunk', 'portrait', '3d-render'],
        content: '/imagine prompt: A stunning 8k resolution cinematic close-up photograph of a futuristic cyberpunk female hacker with neon blue glowing eye augments, rainy Tokyo street reflections in background, volumetric lighting, photorealistic skin texture, shot on 85mm lens f/1.4 --ar 16:9 --v 6.0 --style raw --stylize 250',
        parameters: {
          aspectRatio: '--ar 16:9',
          version: 'v6.0',
          negativePrompt: 'blur, noise, low quality, extra limbs, distorted face',
          temperature: null,
          seed: 489123,
        },
        description: 'Creates a movie-still quality cyberpunk portrait with glowing neon reflections and hyper-detailed skin texture.',
        sampleOutputUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
        isPublished: true,
        viewsCount: 1420,
        copiesCount: 680,
        likesCount: 142,
      },
      {
        title: 'Senior React & Node.js Code Reviewer & Architect',
        slug: 'senior-react-nodejs-code-reviewer-architect',
        aiModel: 'ChatGPT',
        category: codeCategory._id,
        tags: ['react', 'python', 'refactoring', 'sql'],
        content: 'Act as a Senior Principal Software Architect. Review the following code block for memory leaks, performance bottlenecks, security vulnerabilities (OWASP Top 10), and adherence to clean code SOLID principles. Provide refactored production-ready code along with a bulleted explanation of critical improvements made:\n\n```[INSERT YOUR CODE HERE]```',
        parameters: {
          version: 'GPT-4o',
          temperature: 0.2,
        },
        description: 'Converts ChatGPT into a strict staff software engineer that reviews code and produces bulletproof refactored snippets.',
        sampleOutputUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        isPublished: true,
        viewsCount: 2310,
        copiesCount: 1150,
        likesCount: 289,
      },
      {
        title: 'High-Converting SaaS Cold Email Outreach Generator',
        slug: 'high-converting-saas-cold-email-outreach-generator',
        aiModel: 'Claude',
        category: writeCategory._id,
        tags: ['cold-email', 'copywriting', 'seo'],
        content: 'You are an elite B2B Copywriter who has generated over $10M in pipeline through cold email. Write a 3-step cold outreach email cadence (Email 1: Hook & Pain Point, Email 2: Social Proof & Case Study, Email 3: The Breakup Email) targeted at CTOs for a developer tool that speeds up CI/CD builds by 40%. Keep tone conversational, direct, and under 120 words per email.',
        parameters: {
          version: 'Claude 3.5 Sonnet',
          temperature: 0.7,
        },
        description: 'Generates concise, highly effective 3-step cold emails designed to achieve >45% open rates and strong reply rates.',
        sampleOutputUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        isPublished: true,
        viewsCount: 890,
        copiesCount: 420,
        likesCount: 95,
      },
      {
        title: 'Viral LinkedIn Carousel Content Strategy Generator',
        slug: 'viral-linkedin-carousel-content-strategy-generator',
        aiModel: 'ChatGPT',
        category: mktCategory._id,
        tags: ['social-media', 'ad-copy', 'startup-pitch'],
        content: 'Create a 10-slide viral LinkedIn carousel outline on the topic: "[TOPIC]". For each slide, write the Headline, Visual Hook description, Body Copy (max 25 words), and Slide Call to Action. Make Slide 1 an irresistible scroll-stopping hook.',
        parameters: {
          version: 'GPT-4o',
          temperature: 0.7,
        },
        description: 'Produces slide-by-slide outlines optimized for high dwell time and engagement on LinkedIn carousels.',
        sampleOutputUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        isPublished: true,
        viewsCount: 750,
        copiesCount: 310,
        likesCount: 78,
      },
    ];

    await Prompt.insertMany(samplePrompts);
    console.log('Initial Prompts Seeded!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedAdminAndContent();
