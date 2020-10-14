const controller = {}

const user = require('../models/user')

controller.create = async (req, response) => {
    try {
        const newUser = new user(req.body)
        await newUser.save();
        response.send({
            message: 'usuario creado con éxito',
            created: true
        })
    } catch (error) {
        response.send({
            message: 'Error al crear el usuario',
            created: false
        })
    }
}
controller.findAll = async (req, response) => {
    try {
        const users = await user.find()
        response.json({result:users, findAll: true}); 
    } catch (error) {
        response.send({
            message: 'Error al buscar usuarios',
            findAll: false
        })
    }
}
controller.find = async (req, response) => {
    try {
        const users = await user.findOne({userName : req.body.userName, password:req.body.password}, {_id:0, userName:1})
        response.json({result:users, find: true}); 
    } catch (error) {
        console.log(error);
        response.send({
            message: 'Error al buscar el usuarios',
            findAll: false
        })
    }


}

module.exports = controller;