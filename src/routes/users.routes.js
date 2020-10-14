const { Router} = require ('express');
const router = Router()

const usersCtrl = require ('../controllers/users.controller.js')

router.post('/create', usersCtrl.create)
router.get('/findAll', usersCtrl.findAll)
router.get('/find', usersCtrl.find)

module.exports = router;