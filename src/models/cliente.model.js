import mongoose from 'mongoose'
import Message from '../messages/clientes.message.js'

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type     : String,
    required : [true, Message.NOMBRE_REQUERIDO],
    minlength: [3, Message.NOMBRE_DEMASIADO_CORTO],
    maxlength: [80, Message.NOMBRE_DEMASIADO_LARGO ],
    trim  : true,
    unique: true,
    index : true
  }
})

export default mongoose.model('Cliente', ClienteSchema, 'clientes')
