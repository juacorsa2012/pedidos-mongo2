import Proveedor from '../models/proveedor.model.js'
import Message from '../messages/proveedores.message.js'
import NotFoundError from '../errors/not-found.js'
import BadRequestError from '../errors/bad-request.js'

const obtenerProveedor = async (id) => {
  const proveedor = await Proveedor.findById(id)

  if (!proveedor) {
    throw new NotFoundError(Message.PROVEEDOR_NO_ENCONTRADO)
  }

  return proveedor
}

const registrarProveedor = async (nombre) => {
  if (!nombre) {
    throw new BadRequestError(Message.NOMBRE_REQUERIDO)
  }

  const existeProveedor = await Proveedor.findOne({ 'nombre': new RegExp(`^${nombre}$`, 'i') })

  if (existeProveedor) {
    throw new BadRequestError(Message.PROVEEDOR_DUPLICADO)
  }

  const proveedor  = await Proveedor.create({nombre})  

  return proveedor
}

const actualizarProvedor = async (id, nombre) => {
  if (!nombre) {
    throw new BadRequestError(Message.NOMBRE_REQUERIDO)
  }

  let proveedor = await Proveedor.findById(id)

  if (!proveedor) {
    throw new NotFoundError(Message.PROVEEDOR_NO_ENCONTRADO)
  }

  const existeProveedor = await Proveedor.findOne({ 'nombre': new RegExp(`^${nombre}$`, 'i') })

  if (existeProveedor) {
    throw new BadRequestError(Message.PROVEEDOR_DUPLICADO)
  }

  proveedor = await Proveedor.findByIdAndUpdate(id, {nombre}, {
    new: true,
    runValidators: true
  })  

  proveedor.__v = undefined
  return proveedor
}

const contarProveedores = async () => {
  const count = Proveedor.countDocuments()
  return count
}

export default {
  obtenerProveedor,
  registrarProveedor,
  actualizarProvedor,
  contarProveedores
}
