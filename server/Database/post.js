const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional: image URL
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});



const Post = mongoose.model('Post', PostSchema);
module.exports = Post