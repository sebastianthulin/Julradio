'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./Comment')
const CommentSection = require('./CommentSection')

const schema = new Schema({
  title: {
    type: String,
    validate: {
      validator: str => str.length > 0,
      message: 'ARTICLE_TITLE_MISSING'
    }
  },
  content: {
    type: String,
    validate: {
      validator: str => str.length > 0,
      message: 'ARTICLE_CONTENT_MISSING'
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  pinned: {
    type: Boolean,
    default: false
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
  return CommentSection.findOne({article: articleId}).select('-id').exec().then(function(section) {
    return Comment.count({commentSection: section._id}).exec().then(function(numComments) {
      return Article.findByIdAndUpdate(articleId, { numComments }).exec()
    })
  })
}

const Article = module.exports = mongoose.model('articles', schema)