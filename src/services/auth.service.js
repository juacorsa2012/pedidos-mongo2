import Usuario from '../models/usuario.model.js'
import Message from '../messages/usuarios.message.js'
import BadRequestError from '../errors/bad-request.js'

const registrarUsuario = async (nombre, email, password, rol) => {
  if (!nombre || !email || !password ) {
    throw new BadRequestError(Message.TODOS_CAMPOS_REQUERIDOS)    
  }

  const usuario = await Usuario.create({nombre, email, password, rol})  

  return usuario
}

export default {
  registrarUsuario
}
