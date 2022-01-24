import { StatusCodes } from 'http-status-codes'
import Proveedor from '../models/proveedor.model.js'
import Features from '../utils/Features.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/proveedores.message.js'
import proveedorService from '../services/proveedores.service.js'

const obtenerProveedores = async (req, res) => {
  const features = new Features(Proveedor.find(), req.query)
    .filter()
    .sort()  
    .paginate()

  const proveedores = await features.query

  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS, 
    results: proveedores.length,
    data   : proveedores
  })
}

const obtenerProveedor = async (req, res) => {
  const {id} = req.params

  const proveedor = await proveedorService.obtenerProveedor(id)  

  if (!proveedor) {
    throw new NotFoundError(Message.PROVEEDOR_NO_ENCONTRADO)
  }

  proveedor.__v = undefined

  res.status(StatusCodes.OK).send({
    status : Constant.SUCCESS,    
    proveedor
  })  
}

const registrarProveedor = async (req, res) => {
  const {nombre} = req.body

  const proveedor = await proveedorService.registrarProveedor(nombre)
  
  res.status(StatusCodes.CREATED).send({
    status : Constant.SUCCESS,
    message: Message.PROVEEDOR_REGISTRADO_CORRECTAMENTE,
    proveedor
  })
}

const actualizarProveedor = async (req, res) => {
  const {id} = req.params
  const {nombre} = req.body

  const proveedor = await proveedorService.actualizarProvedor(id, nombre)
            
  res.status(StatusCodes.OK).json({
    status : Constant.SUCCESS,
    message: Message.PROVEEDOR_ACTUALIZADO_CORRECTAMENTE,
    proveedor 
  })         
}

const contarProveedores = async (req, res) => {
  const count = await proveedorService.contarProveedores()

  res.status(StatusCodes.OK).json({
    status: Constant.SUCCESS,
    count 
  })           
}

export default {
  obtenerProveedores,
  obtenerProveedor,
  registrarProveedor,
  actualizarProveedor,
  contarProveedores
}
