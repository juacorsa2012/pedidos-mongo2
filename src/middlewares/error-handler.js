import { StatusCodes } from 'http-status-codes'
import * as Constant from '../constants/app-constants.js'

const errorHandler = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || Constant.OOPS
  }

  if (err.name === 'ValidationError') {
    error.statusCode = StatusCodes.BAD_REQUEST,
    error.message = Object.values(err.errors).map((item) => item.message).join(',')
  }

  if (err.name === 'CastError') {
    error.message = `${err.value} no es un objectId de Mongoose válido`
    error.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) {
    error.statusCode = StatusCodes.BAD_REQUEST,
    error.message = `El ${Object.keys(err.keyValue)} debe ser único en la base de datos`
  }

  res.status(error.statusCode).json({    
    message: error.message,
    status : Constant.ERROR    
  })
}

export default errorHandler