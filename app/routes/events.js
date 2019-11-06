const jwt = require('koa-jwt')
const {
  secret
} = require('../config/jwt')
const Router = require('koa-router')
const router = new Router({
  prefix: '/api/events'
})
const {
  findAll,
  find,
  findById,
  findByDate,
  create,
  update,
  delete: del,
  checkPerformer,
  saveByDate
} = require('../controllers/events')

const auth = jwt({
  secret
})

router.get('/', find)

router.get('/all', findAll)

router.get('/:date', findByDate)

router.post('/', auth, create)

router.get('/:id', findById)

router.patch('/:id', auth, checkPerformer, update)

router.delete('/:id', auth, checkPerformer, del)

router.post('/logs', saveByDate)

module.exports = router