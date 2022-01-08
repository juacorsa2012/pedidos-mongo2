import express from 'express'
import {obtenerClientes, obtenerCliente} from '../controllers/clientesController.js'

const router = express.Router()

router.route('/').get(obtenerClientes)
router.route('/:id').get(obtenerCliente)

export default router