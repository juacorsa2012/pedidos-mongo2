import {StatusCodes} from 'http-status-codes'
import request from 'supertest'
import mongoose from  'mongoose'
import Proveedor from '../models/proveedor.model.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/proveedores.message.js'
import server from '../server.js'

const url = '/api/v1/proveedores/'

describe(`${url}`, () => {
  let proveedor1
  
  beforeEach(async () => {               
    await Proveedor.deleteMany({})
    proveedor1 = await Proveedor.create({ nombre: 'Proveedor 1'})  
    await Proveedor.create({ nombre: 'Proveedor 2'})  
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })

  it("GET - debe devolver todos los proveedores", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.results).toBeDefined()  
    expect(res.body.data).toBeDefined()  
    expect(res.body.results).toBe(2)                        
  })

  it("GET - debe devolver un proveedor", async () => {
    const res = await request(server).get(url + proveedor1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.proveedor.nombre).toBe(proveedor1.nombre)        
    expect(res.body.proveedor._id).toBeDefined()         
  })

  it("GET - debe devolver un error 404 si el proveedor no existe", async () => {         
    const id = mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.message).toBe(Message.PROVEEDOR_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un proveedor correctamente", async () => {
    const proveedor = {nombre: 'Proveedor 3'}
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.PROVEEDOR_REGISTRADO_CORRECTAMENTE)
    expect(res.body.proveedor.nombre).toBe(proveedor.nombre)   
    expect(res.body.proveedor._id).toBeDefined()        
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del proveedor", async () => {
    const proveedor = {nombre: ''}
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando el nombre del proveedor es inferior a 3 caractares", async () => {
    const proveedor = {nombre: 'aa'}
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_CORTO)
  })

  it("POST - debe devolver un error 400 cuando el nombre del proveedor es superior a 80 caractares", async () => {
    let proveedor = { nombre: "" }
    proveedor.nombre = new Array(82).join('a') 
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_LARGO)
  })

  it("POST - debe devolver un error 400 si el proveedor ya existe", async () => {        
    const proveedor = {nombre: 'Proveedor 1'}
    await request(server).post(url).send(proveedor)
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)      
    expect(res.body.message).toBe(Message.PROVEEDOR_DUPLICADO)
  })

  it("GET - debe contar los proveedores registrados en la base de datos", async() => {
    const res = await request(server).get(url + '/count')
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.count).toBe(2)
    expect(res.body.status).toBe(Constant.SUCCESS)
  })

  it("PUT - debe actualizar un proveedor con éxito", async() => {
    const proveedor = { nombre: "Proveedor 999" }
    const res = await request(server).put(url + proveedor1._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PROVEEDOR_ACTUALIZADO_CORRECTAMENTE)
    expect(res.body.proveedor._id).toBeDefined()
    expect(res.body.proveedor.nombre).toBe(proveedor.nombre)    
  })  

  it("PUT - debe dar un error 400 si actualizamos un proveedor sin nombre", async() => {
    const proveedor = { nombre: "" }
    const res = await request(server).put(url + proveedor1._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_REQUERIDO)        
  })    

  it("PUT - debe dar un error 400 si actualizamos un proveedor con un nombre inferior a 3 caracteres", async() => {
    const proveedor = { nombre: "aa" }
    const res = await request(server).put(url + proveedor1._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_CORTO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un proveedor con un nombre superior a 80 caracteres", async() => {
    let proveedor = { nombre: "" }
    proveedor.nombre = new Array(82).join('a') 
    const res = await request(server).put(url + proveedor1._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_LARGO)
  })    












})
