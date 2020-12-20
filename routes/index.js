var express = require('express')
var router = express.Router()
const studentRouter = require('./student')
const addrRouter = require('./addr')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

router.use('/', addrRouter)

router.use('/student', studentRouter)

module.exports = router
