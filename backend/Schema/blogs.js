// models/Blog.ts

import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Tips for Parents',
        'Tips For Nannies',
        'Platform Tips',
        'Special Needs Care',
        'Do It Yourself',
        'Nanny Activities',
        'News',
      ],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
