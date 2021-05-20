const mongoose = require("mongoose");
const moment = require("moment");
const {
  Schema,
  model
} = mongoose;

const eventsSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  category: {
    type: String,
    required: false,
    default: '',
    select: true
  },
  isCustom: {
    type: Boolean,
    required: true,
    default: false,
    select: true,
  },
  customCategory: {
    type: String,
    required: false,
    default: '',
    select: true,
  },
  date: {
    type: String,
    default: moment(Date.now(), 'YYYY-MM-DD'),
    required: true
  },
  time: {
    type: String,
    default: moment(Date.now(), 'HH:mm:ss'),
  },
  isDateExact: {
    type: Boolean,
    default: false,
    select: true,
  },
  income: {
    type: Number,
    default: 0,
    select: true,
  },
  haveIncome: {
    type: Boolean,
    default: false,
    select: true,
  },
  action: {
    type: String,
    default: '',
    required: true
  },
  detail: {
    type: String,
    default: '无',
    required: true
  },
  performer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: true
  },
  updateTime: {
    type: Date
  },
  createTime: {
    type: Date
  }
});

eventsSchema.pre('save', async function (next) {
  console.log('I have saved.')
  const currentDate = new Date()
  console.log(this)
  console.log('**************')
  this.updateTime = currentDate
  if (!this.createTime) {
    this.createTime = currentDate
  }
  next()
})
eventsSchema.pre('findOneAndUpdate', async function (next) {
  const currentDate = new Date()
  this.update({}, {
    updateTime: currentDate
  })
  await next()
})

module.exports = model("Event", eventsSchema);