const Koa = require('koa')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const app = new Koa()
const routing = require('./app/routes/handleRoutes')
const cors = require('koa-cors')
const {
  connectDB
} = require('./app/config/db')

app.use(cors({
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'HEAD', 'OPTIONS']
}))

app.use(async function (ctx, next) {
  if (ctx.request.method == "OPTIONS") {
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 86400000);
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE, PATCH");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  }
  await next()
})

mongoose.connect(connectDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log('mongooseDB connecting successed'))
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (e, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : {
    stack,
    ...rest
  }
}))

app.use(bodyParser())
app.use(parameter(app))
routing(app)



app.listen(7777, () => console.log('app is listening on port 7777'))