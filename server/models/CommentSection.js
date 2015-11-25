'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./Comment')

const schema = new Schema({
  count: {
    type: Number,
    default: 1
  },
  cosyCorner: Boolean,
  article: {
    type: Schema.ObjectId,
    ref: 'articles'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
})

schema.methods.updateCommentCount = function() {
  Comment.find({commentSection: this._id}).count().exec().then(count => {
    this.count = count
    this.save()
  })
}

module.exports = mongoose.model('comment sections', schema)