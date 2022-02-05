import Cliente from '../models/cliente.model.js'
import Message from '../messages/clientes.message.js'
import NotFoundError from '../errors/not-found.js'
import BadRequestError from '../errors/bad-request.js'

const obtenerCliente = async (id) => {
  const cliente = await Cliente.findById(id)

  if (!cliente) {
    throw new NotFoundError(Message.CLIENTE_NO_ENCONTRADO)
  }

  return cliente
}

const registrarCliente = async (nombre) => {
  if (!nombre) {
    throw new BadRequestError(Message.NOMBRE_REQUERIDO)
  }

  const existeCliente = await Cliente.findOne({ 'nombre': new RegExp(`^${nombre}$`, 'i') })

  if (existeCliente) {
    throw new BadRequestError(Message.CLIENTE_DUPLICADO)
  }

  const cliente = await Cliente.create({nombre})  

  return cliente
}

const actualizarCliente = async (id, nombre) => {
  if (!nombre) {
    throw new BadRequestError(Message.NOMBRE_REQUERIDO)
  }

  let cliente = await Cliente.findById(id)

  if (!cliente) {
    throw new NotFoundError(Message.CLIENTE_NO_ENCONTRADO)
  }

  const existeCliente = await Cliente.findOne({ 'nombre': new RegExp(`^${nombre}$`, 'i') })

  if (existeCliente) {
    throw new BadRequestError(Message.CLIENTE_DUPLICADO)
  }

  cliente = await Cliente.findByIdAndUpdate(id, {nombre}, {
    new: true,
    runValidators: true
  })  

  cliente.__v = undefined
  return cliente
}

const contarClientes = async () => {
  const count = Cliente.countDocuments()
  return count
}

export default {
  obtenerCliente,  
  registrarCliente,
  actualizarCliente,
  contarClientes 
}