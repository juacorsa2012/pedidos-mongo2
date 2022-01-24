import express from 'express'
import {isAuth} from '../middlewares/index.js'
import controller from '../controllers/proveedores.controller.js'

const router = express.Router()

router.route('/').get(controller.obtenerProveedores)
router.route('/count').get(controller.contarProveedores)
router.route('/:id').get(controller.obtenerProveedor)
router.route('/').post(controller.registrarProveedor)
router.route('/:id').put(controller.actualizarProveedor)

export default router