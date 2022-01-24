import jwt from 'jsonwebtoken'
import UnAuthenticatedError from '../errors/unAuthenticated.js'
import Message from '../messages/usuarios.message.js'

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError(Message.CREDENCIALES_INCORRECTAS)
  }

  const token = authHeader.split(' ')[1]

  try {
   const payload = jwt.verify(token, process.env.JWT_SECRET) 
   req.usuario = payload
   next()
  } catch (error) {
    throw new UnAuthenticatedError(Message.CREDENCIALES_INCORRECTAS)
  }
}

export default isAuth