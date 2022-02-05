import Pedido from '../models/pedido.model.js'
import Message from '../messages/pedidos.message.js'
import NotFoundError from '../errors/not-found.js'
import BadRequestError from '../errors/bad-request.js'

const registrarPedido = async (pedido) => {  
  const {producto, unidades, cliente, proveedor} = pedido

  if (!producto) {
    throw new BadRequestError(Message.PRODUCTO_REQUERIDO)
  }
  
  if (!unidades) {
    throw new BadRequestError(Message.UNIDADES_REQUERIDO)
  }

  if (!cliente) {
    throw new BadRequestError(Message.CLIENTE_REQUERIDO)
  }

  if (!proveedor) {
    throw new BadRequestError(Message.PROVEEDOR_REQUERIDO)
  }  

  if (unidades <= 0) {
    throw new BadRequestError(Message.UNIDADES_NO_VALIDAS)
  }

  return await Pedido.create(pedido)   
}

const obtenerPedido = async (id) => {
  const pedido = await Pedido.findById(id).populate('cliente proveedor')
  
  if (!pedido) {
    throw new NotFoundError(Message.PEDIDO_NO_ENCONTRADO)
  }

  return pedido
}

const eliminarPedido = async (id) => {
  const pedido = await obtenerPedido(id)

  if (!pedido) {
    throw new NotFoundError(Message.PEDIDO_NO_ENCONTRADO)
  }

  return await Pedido.findByIdAndRemove(id)
}

const actualizarPedido = async (id, pedido) => {
  const existePedido = await obtenerPedido(id)

  if (!existePedido) {
    throw new NotFoundError(Message.PEDIDO_NO_ENCONTRADO)
  }

  const {producto, unidades, cliente, proveedor} = pedido

  if (!producto) {
    throw new BadRequestError(Message.PRODUCTO_REQUERIDO)
  }
  
  if (!unidades) {
    throw new BadRequestError(Message.UNIDADES_REQUERIDO)
  }

  if (!cliente) {
    throw new BadRequestError(Message.CLIENTE_REQUERIDO)
  }

  if (!proveedor) {
    throw new BadRequestError(Message.PROVEEDOR_REQUERIDO)
  }

  return await Pedido.findByIdAndUpdate(id, pedido, {
    new: true,
    runValidators: true
  })  
}

export default {
  registrarPedido,
  obtenerPedido,
  eliminarPedido,
  actualizarPedido  
}