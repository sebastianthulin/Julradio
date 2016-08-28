'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./Comment')

const schema = new Schema({
  totalComments: Number,
  totalThreads: Number,
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
  Comment.find({commentSection: this._id}).count().exec().then(totalComments => {
    Comment.find({commentSection: this._id, replyTo: null}).count().then(totalThreads => {
      this.totalThreads = totalThreads
      this.totalComments = totalComments
      this.save()
    })
  })
}

module.exports = mongoose.model('comment sections', schema)
