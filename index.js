const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const app = new Koa();
const routing = require("./app/routes/handleRoutes");
const cors = require("koa2-cors");
const {
  connectDB
} = require("./app/config/db");

app.use(cors({
  origin: function (ctx) {
    if (ctx.url === '/test') {
      return '*';
    }
    return 'http://localhost:8080';
  },
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
}));

// app.use(cors())

mongoose.connect(
  connectDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => console.log("mongooseDB connecting successed")
);
mongoose.connection.on("error", console.error);

app.use(
  error({
    postFormat: (e, {
        stack,
        ...rest
      }) =>
      process.env.NODE_ENV === "production" ?
      rest : {
        stack,
        ...rest
      }
  })
);

app.use(bodyParser());
app.use(parameter(app));
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://localhost:8080")
  // ctx.set("Access-Control-Allow-Headers", "X-Requested-With")
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH")
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
routing(app);

app.listen(7777, () => console.log("app is listening on port 7777"));