import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    image: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true,
    },
    postedBy: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);