const { Router} = require ('express');
const router = Router()

const usersCtrl = require ('../controllers/users.controller.js')

router.post('/create', usersCtrl.create)
router.get('/findAll', usersCtrl.findAll)
router.post('/find', usersCtrl.find)
router.delete('/delete', usersCtrl.delete)
router.put('/update', usersCtrl.update)

module.exports = router;