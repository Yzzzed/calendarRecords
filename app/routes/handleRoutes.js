const fs = require('fs')
module.exports = app => {
  fs.readdirSync(__dirname).map(file => {
    if (file === 'handleRoutes.js') {
      return
    }
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}