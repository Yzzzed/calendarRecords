const mongoose = require('mongoose')
const moment = require('moment')
const {
  Schema,
  model
} = mongoose

const eventsSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  date: {
    type: String,
    default: moment(Date.now(), 'YYYY-MM-DD-HH:mm'),
    required: true
  },
  action: {
    type: String,
    default: '',
    required: true
  },
  performer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: true
  }
}, {
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
})

module.exports = model('Event', eventsSchema)