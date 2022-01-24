import {StatusCodes} from 'http-status-codes'

const notFound = (req, res) => res.status(StatusCodes.NOT_FOUND).send({
  success: false,
  message: 'No se ha encontrado la ruta solicitada'
})

export default notFound