import {StatusCodes} from 'http-status-codes'

const obtenerClientes = (req, res) => {
  res.send('Obtener clientes ...')
}

const obtenerCliente = (req, res) => {
  res.send('Obtener cliente ...')
}

const registrarCliente = (req, res) => {
  res.status(StatusCodes.OK).send({
    message: 'Registrar cliente ....'
  })
}

export { obtenerCliente, obtenerClientes, registrarCliente}
