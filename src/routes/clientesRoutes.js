import express from 'express'
import {obtenerClientes, obtenerCliente, registrarCliente} from '../controllers/clientesController.js'

const router = express.Router()

router.route('/').get(obtenerClientes)
router.route('/:id').get(obtenerCliente)
router.route('/').post(registrarCliente)

export default router