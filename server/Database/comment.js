const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  text: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
 
});



const comment = mongoose.model('comment', CommentSchema);
module.exports = comment