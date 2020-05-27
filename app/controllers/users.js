const jwt = require('jsonwebtoken')
const User = require('../models/users')
const {
  secret
} = require('../config/jwt')

class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find().populate('events', '+_id +date +action')
  }
  async findById(ctx) {
    const {
      fields = ''
    } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ` +${f}`).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    ctx.body = user
  }
  async checkUserExist(ctx) {
    const {
      username
    } = ctx.request.body
    const repeatedUser = await User.findOne({
      username
    })
    if (repeatedUser) {
      ctx.body = {
        code: 1,
        message: '用户名已存在~'
      }
      // ctx.throw(409, 'User has existed')
    } else {
      ctx.body = {
        code: 0,
        message: '用户名可以使用~'
      }
    }
  }
  async create(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })

    // const {
    //   username
    // } = ctx.request.body
    // const repeatedUser = await User.findOne({
    //   username
    // })
    // if (repeatedUser) {
    //   ctx.throw(409, 'User has existed')
    // }
    const user = await new User(ctx.request.body).save()
    ctx.body = {
      code: 0,
      message: '注册成功~',
      user: user
    }
  }
  async checkOwner(ctx, next) {
    // console.log(ctx.params.id)
    // console.log(ctx.state.user._id)
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, 'no permission')
    }
    await next()
  }
  async update(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      events: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      nickName: {
        type: 'string',
        required: false
      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true
    })
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    ctx.body = user
  }
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    ctx.status = 204
  }

  async login(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const user = await User.findOne(
      ctx.request.body
    )
    if (!user) {
      ctx.throw(401, 'username or password is incorrect')
    }
    const {
      _id,
      username,
      nickname
    } = user
    const token = jwt.sign({
      _id,
      username
    }, secret, {
      expiresIn: '7d'
    })
    ctx.body = {
      token,
      user: {
        id: _id,
        username: username,
        nickname: nickname
      }
    }
  }

}

module.exports = new UsersCtl()