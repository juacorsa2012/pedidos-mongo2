import {StatusCodes} from 'http-status-codes'
import Usuario from '../models/usuario.model.js'
import Constant from '../constants/app-constants.js'
import Message from '../messages/usuarios.message.js'
import UnAuthenticatedError from '../errors/unAuthenticated.js'
import authService from '../services/auth.service.js'
import BadRequestError from '../errors/bad-request.js'

const registro = async (req, res) => {  
  const {nombre, email, password, rol} = req.body
   
  const usuario = await authService.registrarUsuario(nombre, email, password, rol)
  
  const token = usuario.createJWT()

  res.status(StatusCodes.CREATED).send({
    status : Constant.SUCCESS,
    message: Message.USUARIO_REGISTRADO_CORRECTAMENTE,    
    token,
    usuario: {
      nombre: usuario.nombre,
      email: usuario.email
    }
  })
}

const login = async (req, res) => {
  const {email, password} = req.body

  if (!email || !password ) {
    throw new UnAuthenticatedError(Message.CREDENCIALES_INCORRECTAS)
  }

  const usuario = await Usuario.findOne({email}).select('+password')

  if (!usuario) {
    throw new UnAuthenticatedError(Message.CREDENCIALES_INCORRECTAS)
  }

  const passwordValido = await usuario.comparePassword(password)

  if (!passwordValido) {
    throw new UnAuthenticatedError(Message.CREDENCIALES_INCORRECTAS)
  }

  const token = usuario.createJWT()

  return res.status(StatusCodes.OK).send({
    status: Constant.SUCCESS,
    token,
    usuario: {
      nombre: usuario.nombre,
      email: usuario.email
    }
  })  
}

export { registro, login }
