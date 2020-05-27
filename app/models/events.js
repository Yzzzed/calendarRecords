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
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7"],
    default: "1",
    select: true
  },
  date: {
    type: String,
    default: moment(Date.now(), "YYYY-MM-DD"),
    required: true
  },
  action: {
    type: String,
    default: "",
    required: true
  },
  detail: {
    type: String,
    default: '无',
    required: true
  },
  performer: {
    type: Schema.Types.ObjectId,
    ref: "User",
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