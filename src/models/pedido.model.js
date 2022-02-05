import mongoose from 'mongoose'
import Message from  '../messages/pedidos.message.js'
import Constant from '../constants/app-constants.js'

const pedidoSchema = new mongoose.Schema(
{
  producto: {
    type: String,
    required: [true, Message.PRODUCTO_REQUERIDO],    
    trim: true            
  },
  unidades: {
    type: Number,
    required: [true, Message.UNIDADES_REQUERIDO]    
  },
  referencia: {
    type: String,    
    trim: true        
  },
  oferta: {
    type: String,    
    trim: true        
  },
  numero_serie: {
    type: String,
    trim: true
  },
  observaciones: {
    type: String,    
    trim: true        
  },
  parte: {
    type: String,    
    trim: true        
  },
  estado: {
    type: String,
    enum : [Constant.ESTADO_PEDIDO, Constant.ESTADO_PREPARADO, Constant.ESTADO_ENTREGADO, Constant.ESTADO_ALMACEN,
      Constant.ESTADO_FACTURADO, Constant.ESTADO_DEVUELTO, Constant.ESTADO_SIN_CARGO, Constant.ESTADO_VERIFICADO],
    default: Constant.ESTADO_PEDIDO
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cliente',
    required: [true, Message.CLIENTE_REQUERIDO]
  },
  proveedor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Proveedor',
    required: [true, Message.PROVEEDOR_REQUERIDO]
  }
})

const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos')

export default Pedido