import Pedido from '../models/pedido.model.js'
import Message from '../messages/pedidos.message.js'
import NotFoundError from '../errors/not-found.js'
import BadRequestError from '../errors/bad-request.js'
import Cliente from '../models/cliente.model.js'
import Proveedor from '../models/proveedor.model.js'
import Constant from '../constants/app-constants.js'

const estados = [
    Constant.ESTADO_ALMACEN, 
    Constant.ESTADO_PEDIDO,
    Constant.ESTADO_DEVUELTO,
    Constant.ESTADO_ENTREGADO,
    Constant.ESTADO_FACTURADO,
    Constant.ESTADO_PREPARADO,
    Constant.ESTADO_SIN_CARGO,
    Constant.ESTADO_VERIFICADO
  ]

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

  const existeCliente = await Cliente.findById(cliente)
  
  if (!existeCliente) {
    throw new BadRequestError(Message.CLIENTE_NO_ENCONTRADO)
  }

  const existeProveedor = await Proveedor.findById(proveedor)

  if (!existeProveedor) {
    throw new BadRequestError(Message.PROVEEDOR_NO_ENCONTRADO)
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

  const {producto, unidades, cliente, proveedor, estado} = pedido

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

  const existeCliente = await Cliente.findById(cliente)
  
  if (!existeCliente) {
    throw new BadRequestError(Message.CLIENTE_NO_ENCONTRADO)
  }

  const existeProveedor = await Proveedor.findById(proveedor)

  if (!existeProveedor) {
    throw new BadRequestError(Message.PROVEEDOR_NO_ENCONTRADO)
  }  

  if (estados.indexOf(estado) == -1) {
    throw new BadRequestError(Message.ESTADO_NO_VALIDO)
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