const controller = {}
const user = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;


controller.create = async (req, response) => {

    try {
        //Encriptamos con hash la contraseña que nos llega desde el front
        bcrypt.genSalt(saltRounds, async function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                req.body.password = hash
                //Una vez encriptada y reasignada guardamos el usuario con esa contraseña
                const newUser = new user(req.body)
                try {
                    await newUser.save();
                    response.send({
                        message: 'Usuario creado con éxito',
                        created: true
                    })
                } catch (error) {
                   if(error.code == 11000) {
                    response.send({
                        message: 'Error al crear el usuario, clave única duplicada',
                        error:  {
                            descripción: "Clave duplicada",
                            clave: error.keyValue
                            
                        },
                        created: false
                    })
                   }else{
                    response.send({
                        message: 'Error al crear el usuario',
                        error: error,
                        created: false
                    })
                   }
                    
                }
                
                
            });
        });

    } catch (error) {
        response.send({
            message: 'Error al crear el usuario',
            error: error,
            created: false
        })
    }
}

controller.findAll = async (req, response) => {
    try {
        const users = await user.find()
        response.json({
            message: 'Usuarios encontrados',
            result: users,
            findAll: true
        });
    } catch (error) {
        response.send({
            message: 'Error al buscar usuarios',
            error: error,
            findAll: false
        })
    }
}
controller.find = async (req, response) => {

    try {
        const users = await user.findOne({
            userName: req.body.userName
        }, {
            _id: 0,
            userName: 1,
            password: 1
        })
        if (users) {

            bcrypt.compare(req.body.password, users.password, function (err, result) {

                if (result) {

                    response.json({
                        message: 'Usuario encontrado con éxito',
                        result: users.userName,
                        find: true
                    });

                } else {
                    response.json({
                        message: 'Contraseña incorrecta',
                        find: false
                    });

                }

            });

        } else {
            response.json({
                message: 'No hay usuarios que coincidan',
                find: false
            });
        }

    } catch (error) {
        response.send({
            message: 'Error al buscar el usuario',
            error: error,
            findAll: false
        })
    }


}

controller.delete = async (req, response) => {
    try {
        const deletedUser = await user.findOneAndDelete({
            _id: req.body.id
        })
        response.json({
            message: 'Empleado borrado con éxito',
            result: deletedUser,
            delete: true
        })
    } catch (error) {
        response.send({
            message: 'Error borrar el usuarios',
            error: error,
            delete: false
        })
    }

}

module.exports = controller;