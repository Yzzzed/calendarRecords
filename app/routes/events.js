const jwt = require('koa-jwt')
const {
  secret
} = require('../config/jwt')
const Router = require('koa-router')
const router = new Router({
  prefix: '/events'
})
const {
  findAll,
  find,
  findById,
  findByDate,
  findByUserid,
  create,
  update,
  del,
  checkPerformer,
  saveByDate
} = require('../controllers/events')

const auth = jwt({
  secret
})

router.get('/', find)

router.get('/all', findAll)

router.get('/:date', findByDate)

router.get('/:date/:userid', auth, findByUserid)

router.post('/', auth, create)

router.get('/:id', findById)

router.patch('/:id', auth, checkPerformer, update)

router.delete('/:id', auth, checkPerformer, del)

router.post('/logs', saveByDate)

module.exports = router