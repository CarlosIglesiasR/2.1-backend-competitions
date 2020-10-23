const {Schema, model} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//Schema de objeto de base de datos
const userSchema = new Schema({
    userName: {type: String, unique: true, required: true, trim:true, uniqueCaseInsensitive: true},
    password: {type: String, required: true},
    deleted: {type: Boolean, required: false, default:false},
    deletedDate: {type: Date, required: false},
    email: {type: String, unique: true, required: true},

}, {
    timestamps: true,
    versionKey: false
})

userSchema.plugin(uniqueValidator);
module.exports = model('user', userSchema)