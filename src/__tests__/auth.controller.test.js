import {StatusCodes} from 'http-status-codes'
import request from 'supertest'
import mongoose from 'mongoose'
import Usuario from '../models/usuario.model.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/usuarios.message.js'
import server from '../server.js'

const url = '/api/v1/auth/'

describe(`${url}`, () => {  
  beforeEach(async () => {       
    await Usuario.deleteMany({})   
    await Usuario.create({ nombre: 'usuario', email: 'usuario@test.com', password: 'password' })      
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("POST - debe registrar un usuario correctamente", async () => {
    const usuario = {nombre: 'usuario1', email: 'usuario1@test.es', password: '12345678'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.USUARIO_REGISTRADO_CORRECTAMENTE)
    expect(res.body.usuario.nombre).toBe(usuario.nombre)   
    expect(res.body.usuario.email).toBe(usuario.email)   
    expect(res.body.token).toBeDefined()     
    expect(res.body.password).not.toBeDefined()     
  })

  it("POST - debe devolver un error 400 si registramos un usuario sin nombre", async () => {
    const usuario = {nombre: '', email: 'usuario1@test.es', password: '12345678'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)    
    expect(res.body.message).toBe(Message.TODOS_CAMPOS_REQUERIDOS)    
  })

  it("POST - debe devolver un error 400 si registramos un usuario sin email", async () => {
    const usuario = {nombre: 'usuario1', email: '', password: '12345678'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)    
    expect(res.body.message).toBe(Message.TODOS_CAMPOS_REQUERIDOS)    
  })

  it("POST - debe devolver un error 400 si registramos un usuario sin password", async () => {
    const usuario = {nombre: 'usuario1', email: 'usuario1@test.com', password: ''}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)    
    expect(res.body.message).toBe(Message.TODOS_CAMPOS_REQUERIDOS)    
  })

  it("POST - debe devolver un error 400 si registramos un usuario existente", async () => {
    const usuario = {nombre: 'usuario1', email: 'usuario@test.com', password: '45454545454545'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)    
    expect(res.body.message).toBe(Message.USUARIO_DUPLICADO)
  })

  it("POST - debe devolver un error 400 si registramos un usuario con un password inferior a 6 caracteres", async () => {
    const usuario = {nombre: 'usuario1', email: 'usuario1@test.es', password: '12345'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PASSWORD_DEMASIADO_CORTO)
  })

  it("POST - debe devolver un error 400 si registramos un usuario con un email no válido", async () => {
    const usuario = {nombre: 'usuario1', email: 'usuario1@test', password: '12345789'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.EMAIL_NO_VALIDO)
  })

  it("POST - debe devolver un error 400 si registramos un usuario con un nombre inferior a 3 caracteres", async () => {
    const usuario = {nombre: 'aa', email: 'usuario1@test.es', password: '12345789'}
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_CORTO)
  })

  it("POST - debe devolver un error 400 si registramos un usuario con un nombre superior a 80 caracteres", async () => {
    const usuario = {}
    usuario.nombre   = new Array(82).join('a') 
    usuario.password = '1234567'
    usuario.email = 'usuario1@test.com'
    const res = await request(server).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.NOMBRE_DEMASIADO_LARGO)
  })

  it("POST - debe realizar un login correcto", async () => {
    const usuario = {email: 'usuario@test.com', password: 'password'}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)        
    expect(res.body.usuario.email).toBe(usuario.email)   
    expect(res.body.token).toBeDefined()     
    expect(res.body.password).not.toBeDefined()     
  })

  it("POST - debe un error 400 si las credenciales no son válidas (password incorrecto)", async () => {
    const usuario = {email: 'usuario@test.com', password: '1234567'}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body.message).toBe(Message.CREDENCIALES_INCORRECTAS)
  })
  
  it("POST - debe un error 400 si las credenciales no son válidas (email incorrecto)", async () => {
    const usuario = {email: 'usuario@test.es', password: 'password'}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body.message).toBe(Message.CREDENCIALES_INCORRECTAS)
  })

  it("POST - debe un error 400 si las credenciales no son válidas (sin password))", async () => {
    const usuario = {email: 'usuario@test.es', password: ''}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body.message).toBe(Message.CREDENCIALES_INCORRECTAS)
  })

  it("POST - debe un error 400 si las credenciales no son válidas (sin email))", async () => {
    const usuario = {email: '', password: 'password'}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body.message).toBe(Message.CREDENCIALES_INCORRECTAS)
  })

  it("POST - debe un error 400 si el email no existe", async () => {
    const usuario = {email: 'email@test.com', password: 'password'}
    const res = await request(server).post(url + 'login').send(usuario)
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body.message).toBe(Message.CREDENCIALES_INCORRECTAS)
  })
})