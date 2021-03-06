import {StatusCodes} from 'http-status-codes'
import request from 'supertest'
import mongoose from  'mongoose'
import Cliente from '../models/cliente.model.js'
import Proveedor from '../models/proveedor.model.js'
import Pedido from '../models/pedido.model.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/pedidos.message.js'
import server from '../server.js'

const url = '/api/v1/pedidos/'

describe(`${url}`, () => {
  let pedido
  let cliente
  let proveedor

  beforeEach(async () => {       
    await Pedido.deleteMany({})
    await Cliente.deleteMany({})
    await Proveedor.deleteMany({})
    cliente = await Cliente.create({nombre: 'cliente 1'})
    proveedor = await Proveedor.create({nombre: 'pedido 1'})        
    pedido = await Pedido.create({ 
      producto: 'producto 1', 
      unidades: 100, 
      cliente: cliente._id, 
      proveedor: proveedor._id 
    })      
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("GET - debe devolver todos los pedidos", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)    
    expect(res.body.data).toBeDefined()  
    expect(res.body.results).toBe(res.body.data.length)                        
  })

  it("GET - debe devolver un pedido", async () => {
    const res = await request(server).get(url + pedido._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.pedido.producto).toBe(pedido.producto) 
    expect(res.body.pedido.unidades).toBe(pedido.unidades) 
    expect(res.body.pedido.producto).toBe(pedido.producto)     
  })

  it("GET - debe devolver un error 404 si no se encuentra el pedido", async () => {
    const id = mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)       
  })

  it("POST - debe registrar un pedido con ??xito", async () => {
    const pedido = {producto: 'producto', unidades: 7, cliente: cliente._id, proveedor: proveedor._id, estado: 'P'}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe(Message.PEDIDO_REGISTRADO)
    expect(res.body.pedido.producto).toBe(pedido.producto)
    expect(res.body.pedido.unidades).toBe(pedido.unidades)
    expect(res.body.pedido.estado).toBe(Constant.ESTADO_PEDIDO)
    expect(res.body.pedido._id).toBeDefined()        
  })

  it("POST - debe devolver un error 400 si no facilitamos el nombre del producto", async () => {
    const pedido = {producto: '', unidades: 6, cliente: cliente._id, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PRODUCTO_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si no facilitamos las unidades del producto", async () => {
    const pedido = {producto: 'producto', cliente: cliente._id, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.UNIDADES_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si no facilitamos el cliente", async () => {
    const pedido = {producto: 'producto', unidades: 6, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.CLIENTE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si no facilitamos el proveedor", async () => {
    const pedido = {producto: 'producto', unidades: 6, cliente: cliente._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PROVEEDOR_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si el n??mero de unidades es menor que cero", async () => {
    const pedido = {producto: 'producto', unidades: -8, cliente: cliente._id, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.UNIDADES_NO_VALIDAS)
  })

  it("POST - debe devolver un error 400 si el n??mero de unidades es cero", async () => {
    const pedido = {producto: 'producto', unidades: 0, cliente: cliente._id, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.UNIDADES_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si el cliente no existe", async () => {
    const id = mongoose.Types.ObjectId()
    const pedido = {producto: 'producto', unidades: 10, cliente: id, proveedor: proveedor._id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.CLIENTE_NO_ENCONTRADO)
  })

  it("POST - debe devolver un error 400 si el proveedor no existe", async () => {
    const id = mongoose.Types.ObjectId()
    const pedido = {producto: 'producto', unidades: 10, cliente: cliente._id, proveedor: id}
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PROVEEDOR_NO_ENCONTRADO)
  })

  it("PUT - debe actualizar un pedido con ??xito", async() => {
    const pedido_nuevo = { producto: "producto 2", unidades: 54, cliente: cliente._id, proveedor: proveedor._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PEDIDO_ACTUALIZADO)
    expect(res.body.pedido.producto).toBe(pedido_nuevo.producto)
    expect(res.body.pedido.unidades).toBe(pedido_nuevo.unidades)
    expect(res.body.pedido.estado).toBe(pedido_nuevo.estado)
    expect(res.body.pedido.cliente).toBeDefined()
    expect(res.body.pedido.proveedor).toBeDefined()
  })  

  it("PUT - debe devolver un error 400 si al actualizar un pedido no se indica el producto", async() => {
    const pedido_nuevo = { producto: "", unidades: 54, cliente: cliente._id, proveedor: proveedor._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PRODUCTO_REQUERIDO)
  })  

  it("PUT - debe devolver un error 400 si al actualizar un pedido no se indica el n??mero de unidades", async() => {
    const pedido_nuevo = { producto: "producto", unidades: 0, cliente: cliente._id, proveedor: proveedor._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.UNIDADES_REQUERIDO)
  })  

  it("PUT - debe devolver un error 400 si al actualziar un pedido el n??mero de unidades es inferior a cero", async() => {
    const pedido_nuevo = { producto: "producto", unidades: -1, cliente: cliente._id, proveedor: proveedor._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.UNIDADES_NO_VALIDAS)
  })  

  it("PUT - debe devolver un error 400 si al actualizar un pedido no se indica el cliente asociado", async() => {
    const pedido_nuevo = { producto: "producto", unidades: 54, proveedor: proveedor._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.CLIENTE_REQUERIDO)
  })  
  
  it("PUT - debe devolver un error 400 si al actualizar un pedido no se indica el proveedor asociado", async() => {
    const pedido_nuevo = { producto: "producto", unidades: 54, cliente: cliente._id, estado: 'A' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PROVEEDOR_REQUERIDO)
  })    
  
  it("PUT - debe devolver un error 400 si al actualizar un pedido el estado no es un valor correcto", async() => {
    const pedido_nuevo = { producto: "producto", unidades: 54, cliente: cliente._id, proveedor: proveedor._id, estado: 'XX' }
    const res = await request(server).put(url + pedido._id).send(pedido_nuevo)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.ESTADO_NO_VALIDO)
  })  
    
  it("DEL - debe eliminar un pedido existente", async () => {    
    const res = await request(server).del(url + pedido._id) 
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.message).toBe(Message.PEDIDO_ELIMINADO)
    expect(res.body.status).toBe(Constant.SUCCESS)     
    expect(res.body.pedido.producto).toBe(pedido.producto)
    expect(res.body.pedido.unidades).toBe(pedido.unidades)
    expect(res.body.pedido.cliente).toBeDefined()
    expect(res.body.pedido.proveedor).toBeDefined()
  })

  it("DEL - debe devolver un error 404 si queremos borrar un pedido que no existe", async () => {    
    const id = mongoose.Types.ObjectId()
    const res = await request(server).del(url + id) 
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)
  })
})