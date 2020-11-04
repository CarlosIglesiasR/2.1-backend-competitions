const controller = {}
const user = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require ('jsonwebtoken');

//Controlador para crear un usuario
controller.createUser = async (req, response) => {
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
//Controlador para devolver todos los usuarios.
controller.findAllUsers = async (req, response) => {
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
//Controlador para devolver un usuario si el email o usuario y el password son los correctos
controller.login = async (req, response) => {

    try {
        const users = await user.findOne({
            $or: [{
                userName: req.body.userName
            }, {
                email: req.body.userName
            }]
        }, {
            _id: 0,
            userName: 1,
            password: 1
        })

        if (users) {
            
            bcrypt.compare(req.body.password, users.password, function (err, result) {

                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: {users}
                      }, 'my_secret_key_116659KEY');
                        
                        //**Con estas dos líneas podemos consultar el contenido del token**/
                        //var decoded = jwt.decode(token, {complete: true});
                        //console.log(decoded.payload)

                    response.json({
                        message: 'Usuario encontrado con éxito',
                        result: users.userName,
                        token: token,
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

//Controlador para borrar un usuario a traves de su ID
controller.deleteUser = async (req, response) => {
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

//Controlador para actualizar un usuario (logeado y para actualizar la contraseña)
controller.updateUser = async (req, response) => {

    if(req.body.newPasswordConfirm == req.body.newPassword){
        try {
            const users = await user.findOne({
                $or: [{
                    userName: req.body.userName
                }, {
                    email: req.body.userName
                }]
            }, {
                _id: 0,
                userName: 1,
                password: 1
            })
    
            if (users) {
    
                bcrypt.compare(req.body.password, users.password, function (err, result) {
    
                    if (result) {
    
                        bcrypt.genSalt(saltRounds, async function (err, salt) {
                            bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
                                req.body.newPassword = hash
                                users.password = req.body.newPassword
                                const updateEmployee = await user.findOneAndUpdate({userName : req.body.userName}, users);
                                response.json({
                                    message: 'Usuario actrualizado con éxito',
                                    result: updateEmployee.userName,
                                    update: true
                                });
                            });
                        });
    
                        
    
                    } else {
                        response.json({
                            message: 'Contraseña incorrecta',
                            update: false
                        });
    
                    }
    
                });
    
            } else {
                response.json({
                    message: 'No hay usuarios que coincidan',
                    update: false
                });
            }
    
        } catch (error) {
            response.send({
                message: 'Error al buscar el usuario',
                error: error,
                update: false
            })
        }
    } else{
        response.send({
            message: 'Error los passwords no coinciden',
            update: false
        })

    }

}



module.exports = controller;