import { StatusCodes } from 'http-status-codes'
import Cliente from '../models/cliente.model.js'
import Features from '../utils/Features.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/clientes.message.js'
import clienteService from '../services/clientes.service.js'

const obtenerClientes = async (req, res) => {
  const features = new Features(Cliente.find(), req.query).filter().sort().paginate()
  const clientes = await features.query 
 
  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS, 
    results: clientes.length,
    data: clientes
  })
}

const obtenerCliente = async (req, res) => {
  const {id} = req.params  

  const cliente = await clienteService.obtenerCliente(id)
  
  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS,    
    cliente
  })  
}

const registrarCliente = async (req, res) => {
  const {nombre} = req.body
  
  const cliente = await clienteService.registrarCliente(nombre)
    
  res.status(StatusCodes.CREATED).send({
    status : Constant.SUCCESS,
    message: Message.CLIENTE_REGISTRADO_CORRECTAMENTE,
    cliente
  })
}

const actualizarCliente = async (req, res) => {
  const {id} = req.params
  const {nombre} = req.body
          
  const cliente = await clienteService.actualizarCliente(id, nombre)

  res.status(StatusCodes.OK).json({
    status : Constant.SUCCESS,
    message: Message.CLIENTE_ACTUALIZADO_CORRECTAMENTE,
    cliente
  })         
}

const contarClientes = async (req, res) => {
  const count = await clienteService.contarClientes()
  
  res.status(StatusCodes.OK).json({
    status: Constant.SUCCESS,
    count 
  })           
}

export default { 
  obtenerCliente, 
  obtenerClientes, 
  registrarCliente, 
  actualizarCliente,
  contarClientes
}
