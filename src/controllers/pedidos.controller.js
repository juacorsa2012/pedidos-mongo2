import { StatusCodes } from 'http-status-codes'
import Pedido from '../models/pedido.model.js'
import Features from '../utils/Features.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/pedidos.message.js'
import pedidosService from '../services/pedidos.service.js'

const obtenerPedidos = async (req, res) => {
  const features = new Features(Pedido.find().populate('cliente proveedor'), req.query)
    .filter()
    .sort() 
    .paginate()

  const pedidos = await features.query 
  
  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS, 
    results: pedidos.length,
    data: pedidos
  })
}

const obtenerPedido = async (req, res) => { 
  const pedido = await pedidosService.obtenerPedido(req.params.id)
  
  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS,    
    pedido
  })  
}

const registrarPedido = async (req, res) => {  
  const {producto, unidades, referencia, oferta, numero_serie, observaciones, 
    parte, estado, cliente, proveedor} = req.body    

  let pedido = {
    producto,
    unidades,
    cliente,
    proveedor,
    referencia,
    oferta,
    numero_serie,
    observaciones,
    parte,
    estado
  }

  pedido = await pedidosService.registrarPedido(pedido)
    
  res.status(StatusCodes.CREATED).send({
    status : Constant.SUCCESS,
    message: Message.PEDIDO_REGISTRADO,
    pedido
  })
}

const actualizarPedido = async (req, res) => {
  const {id} = req.params
  const {producto, unidades, referencia, oferta, numero_serie, observaciones, 
    parte, estado, cliente, proveedor} = req.body    

  let pedido = {
    producto,
    unidades,
    cliente,
    proveedor,
    referencia,
    oferta,
    numero_serie,
    observaciones,
    parte,
    estado
  }

  pedido = await pedidosService.actualizarPedido(id, pedido)

  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS,
    message: Message.PEDIDO_ACTUALIZADO,
    pedido
  })  
}

const eliminarPedido = async (req, res) => {  
  const pedido = await pedidosService.eliminarPedido(req.params.id)

  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS,
    message: Message.PEDIDO_ELIMINADO,
    pedido
  })
}

export default {
  obtenerPedidos,
  registrarPedido,
  obtenerPedido,
  eliminarPedido,
  actualizarPedido
}