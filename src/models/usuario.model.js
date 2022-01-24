import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Message from '../messages/usuarios.message.js'

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required : [true, Message.NOMBRE_USUARIO_REQUERIDO],
    minlength: [3, Message.NOMBRE_DEMASIADO_CORTO],
    maxlength: [80, Message.NOMBRE_DEMASIADO_LARGO],
    trim : true,
    index: true
  },
  email: {
    type: String,
    required: [true, Message.EMAIL_REQUERIDO],
    validate: {
      validator: validator.isEmail,
      message: Message.EMAIL_NO_VALIDO
    },
    unique: true,
    index : true
  },
  password: {
    type: String,
    required : [true, Message.PASSWORD_REQUERIDO],
    minlength: [6, Message.PASSWORD_DEMASIADO_CORTO]
  },
  rol: {
    type : String,    
    enum : ['user', 'admin'],
    default: 'user'
  }
})

UsuarioSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UsuarioSchema.methods.createJWT = function () {
  return jwt.sign({usuarioId: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

UsuarioSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

export default mongoose.model('Usuario', UsuarioSchema, 'usuarios')