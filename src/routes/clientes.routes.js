import express from 'express'
import {isAuth} from '../middlewares/index.js'
import controller from '../controllers/clientes.controller.js'

const router = express.Router()

router.route('/').get(controller.obtenerClientes)
router.route('/count').get(controller.contarClientes)
router.route('/:id').get(controller.obtenerCliente)
router.route('/').post(controller.registrarCliente)
router.route('/:id').put(controller.actualizarCliente)

export default router