import {StatusCodes} from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }  
  error.message = err.message

  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || INTERNAL_SERVER_ERROR
  })
}

export default errorHandler