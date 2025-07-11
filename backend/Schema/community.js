import mongoose from 'mongoose';

const { Schema } = mongoose;

// Reply Schema
const ReplySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId], // Array of user IDs
    default: [],
  },
  dislikes: {
    type: [Schema.Types.ObjectId], // Array of user IDs
    default: [],
  },
  replies: [
    {
      type: new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        comment: { type: String, required: true },
        likes: { type: [Schema.Types.ObjectId], default: [] },
        dislikes: { type: [Schema.Types.ObjectId], default: [] },
        replies: [], // Empty array to allow further nesting
      }, { timestamps: true }),
    },
  ],
}, { timestamps: true });

// Comment Schema
const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  isAnonymous: Boolean,
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  dislikes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  replies: [ReplySchema], // Embed ReplySchema for nested replies
}, { timestamps: true });

// Post Schema
const PostSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  isAnonymous: Boolean,
  likes: {
    type: [Schema.Types.ObjectId], // Store user IDs of those who liked the post
    default: [],
  },
  dislikes: {
    type: [Schema.Types.ObjectId], // Store user IDs of those who disliked the post
    default: [],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  comments: [CommentSchema], // Embed CommentSchema
}, { timestamps: true });

// Topic Schema
const TopicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  posts: [PostSchema], // Embed PostSchema
}, { timestamps: true });

// Community Schema
const CommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  topics: {
    type: [TopicSchema], // Embed TopicSchema
    default: [], // Ensure topics is always an empty array if not provided
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, { timestamps: true });


// Community Model
const Community = mongoose.model('Community', CommunitySchema);

export default Community;
