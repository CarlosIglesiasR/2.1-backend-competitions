const { Router} = require ('express');
const router = Router()
const authModel = require('../functions/auth')
const usersCtrl = require ('../controllers/users.controller.js')

router.post('/createUser', authModel.ensureToken, usersCtrl.createUser)
router.get('/findAllUsers', authModel.ensureToken, usersCtrl.findAllUsers)
router.post('/login', usersCtrl.login)
router.delete('/deleteUser', authModel.ensureToken, usersCtrl.deleteUser)
router.put('/updateUser', authModel.ensureToken, usersCtrl.updateUser)

module.exports = router;