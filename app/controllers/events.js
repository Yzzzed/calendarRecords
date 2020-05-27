const Event = require('../models/events')
const moment = require('moment')
class EventsCtl {
  async findAll(ctx) {
    ctx.body = await Event.find().select('+performer').populate('performer', '-events')
  }
  async findByDate(ctx) {
    const date = ctx.params.date
    const start = moment(date).utc().format()
    const end = moment(date).add(1, 'd').utc().format()

    ctx.body = await Event.find({
      // createTime: {
      //   $gte: start,
      //   $lt: end
      // }
      date: date
    }).sort({
      '_id': -1
    }).select('+performer').populate('performer', '-events')
  }
  async findByUserid(ctx) {
    const date = ctx.params.date
    const userid = ctx.params.userid
    const start = moment(date).utc().format()
    const end = moment(date).add(1, 'd').utc().format()
    ctx.body = await Event.find({
      // createTime: {
      //   $gte: start,
      //   $lt: end
      // },
      date: date,
      performer: userid
    }).sort({
      '_id': -1
    })
  }
  async find(ctx) {
    const q = new RegExp(ctx.query.q)
    ctx.body = await Event.find({
      $or: [{
        date: q
      }, {
        action: q
      }, {
        perform: q
      }]
    }).select('+performer').populate('performer', '-events')
  }
  async findById(ctx) {
    const {
      fields = ''
    } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ` +${f}`).join('')
    const event = await Event.findById(ctx.params.id).select(selectFields).populate('performer', '-events')
    if (!event) {
      ctx.throw(404, 'event not found')
    }
    ctx.body = event
  }
  async create(ctx) {
    ctx.verifyParams({
      date: {
        type: 'string',
        required: true
      },
      action: {
        type: 'string',
        required: true
      }
    })
    const event = await new Event({
      ...ctx.request.body,
      performer: ctx.state.user._id
    }).save()
    ctx.body = event
  }
  async checkPerformer(ctx, next) {
    const event = await Event.findById(ctx.params.id).select('+performer')
    if (event.performer.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'no permission')
    }
    await next()
  }
  async update(ctx) {
    ctx.verifyParams({
      date: {
        type: 'string',
        required: false
      },
      action: {
        type: 'string',
        required: false
      },
      detail: {
        type: 'string',
        required: false
      },
      category: {
        type: 'string',
        required: false
      }
    })
    const event = await Event.findOneAndUpdate({
      '_id': ctx.params.id
    }, ctx.request.body, {
      new: true
    }).select('+performer').populate('performer', '-events')
    ctx.body = event
  }
  async del(ctx) {
    const event = await Event.findByIdAndRemove(ctx.params.id)
    if (!event) {
      ctx.throw(404, 'user not found')
    }
    ctx.status = 204
  }

  async saveByDate() {}
}

module.exports = new EventsCtl()