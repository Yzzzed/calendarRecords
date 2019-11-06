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
      createTime: {
        $gte: start,
        $lt: end
      }
    }).select('+performer').populate('performer', '-events')
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
      }
    })
    const event = await Event.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true
    }).select('+performer').populate('performer', '-events')
    ctx.body = event
  }
  async delete(ctx) {
    await Event.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
  async saveByDate(ctx) {}
}

module.exports = new EventsCtl()