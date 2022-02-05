import express from 'express'
import {isAuth} from '../middlewares/index.js'
import controller from '../controllers/pedidos.controller.js'

const router = express.Router()

router.route('/').get(controller.obtenerPedidos)
router.route('/:id').get(controller.obtenerPedido)
router.route('/').post(controller.registrarPedido)
router.route('/:id').delete(controller.eliminarPedido)
router.route('/:id').put(controller.actualizarPedido)

export default router