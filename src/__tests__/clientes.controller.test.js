import {StatusCodes} from 'http-status-codes'
import request from 'supertest'
import mongoose from  'mongoose'
import Cliente from '../models/cliente.model.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/clientes.message.js'
import server from '../server.js'

const url = '/api/v1/clientes/'

describe(`${url}`, () => {
  let cliente1
  
  beforeEach(async () => {       
    await Cliente.deleteMany({})
    cliente1 = await Cliente.create({ nombre: 'Cliente 1'})  
    await Cliente.create({ nombre: 'Cliente 2'})  
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("GET - debe devolver todos los clientes", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.results).toBeDefined()  
    expect(res.body.data).toBeDefined()  
    expect(res.body.results).toBe(2)                        
  })

  it("GET - debe devolver un cliente", async () => {
    const res = await request(server).get(url + cliente1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.cliente.nombre).toBe(cliente1.nombre)        
    expect(res.body.cliente._id).toBeDefined()         
  })

  it("GET - debe devolver un error 404 si el cliente no existe", async () => {         
    const id = mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.message).toBe(Message.CLIENTE_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un cliente correctamente", async () => {
    const cliente = {nombre: 'Cliente 3'}
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.CLIENTE_REGISTRADO_CORRECTAMENTE)
    expect(res.body.cliente.nombre).toBe(cliente.nombre)   
    expect(res.body.cliente._id).toBeDefined()        
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del cliente", async () => {
    const cliente = {nombre: ''}
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando el nombre del cliente es inferior a 3 caractares", async () => {
    const cliente = {nombre: 'aa'}
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_CORTO)
  })

  it("POST - debe devolver un error 400 cuando el nombre del cliente es superior a 80 caractares", async () => {
    let cliente = { nombre: "" }
    cliente.nombre = new Array(82).join('a') 
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_LARGO)
  })

  it("POST - debe devolver un error 400 si el cliente ya existe", async () => {        
    const cliente = {nombre: 'Cliente 1'}
    await request(server).post(url).send(cliente)
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)      
    expect(res.body.message).toBe(Message.CLIENTE_DUPLICADO)
  })

  it("GET - debe contar los clientes registrados en la base de datos", async() => {
    const res = await request(server).get(url + '/count')
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.count).toBe(2)
    expect(res.body.status).toBe(Constant.SUCCESS)
  })

  it("PUT - debe actualizar un cliente con éxito", async() => {
    const cliente = { nombre: "Cliente 999" }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.CLIENTE_ACTUALIZADO_CORRECTAMENTE)
    expect(res.body.cliente._id).toBeDefined()
    expect(res.body.cliente.nombre).toBe(cliente.nombre)    
  })  

  it("PUT - debe dar un error 400 si actualizamos un cliente sin nombre", async() => {
    const cliente = { nombre: "" }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_REQUERIDO)        
  })    

  it("PUT - debe dar un error 400 si actualizamos un cliente con un nombre inferior a 3 caracteres", async() => {
    const cliente = { nombre: "aa" }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_CORTO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un cliente con un nombre superior a 80 caracteres", async() => {
    let cliente = { nombre: "" }
    cliente.nombre = new Array(82).join('a') 
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_LARGO)
  })    
})