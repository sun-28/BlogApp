const mongoose = require('mongoose')
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blogUsers'
  },
  likes: {
    type: Map,
    of: Boolean,
  },
  comments: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);