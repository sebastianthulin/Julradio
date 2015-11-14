'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./Comment')

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  numComments: {
    type: Number,
    default: 0
  }
})

schema.statics.updateCommentCount = function(articleId) {
  return Comment.count({article: articleId}).exec().then(function(numComments) {
    return Article.findByIdAndUpdate(articleId, { numComments }).exec()
  })
}

const Article = module.exports = mongoose.model('articles', schema)