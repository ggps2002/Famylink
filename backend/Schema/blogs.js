import mongoose from "mongoose";

const { Schema } = mongoose;

const blogSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    category: {
        type: Schema.Types.String,
        required: true,
        enum: [
            'Tips for Parents',
            'Tips For Nannies',
            'Platform Tips',
            'Special Needs Care',
            'Do It Yourself',
            'Nanny Activities',
            'News',
        ], // Restrict to specific options
    },
    description: {
        type: Schema.Types.String, // Assuming locationSchema is not defined, updating to String
        required: true, // Add required if the description is mandatory
    },
    images: {
        type: [Schema.Types.String], // Array of strings for multiple images
        required: true, // Ensures at least one image is provided
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default value is the current date and time
    }
}, { timestamps: true });

const Blogs = mongoose.model('blogs', blogSchema);
export default Blogs;
