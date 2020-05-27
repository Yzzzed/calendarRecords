const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const userSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  nickname: {
    type: String,
    default: '',
    select: true
  },
  events: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    required: false,
    select: true
  }
}, {
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
})

module.exports = model('User', userSchema)