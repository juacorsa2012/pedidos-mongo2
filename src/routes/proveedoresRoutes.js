import express from 'express'
import { obtenerProveedores, obtenerProveedor } from '../controllers/ProveedoresController.js'

const router = express.Router()

router.route('/').get(obtenerProveedores)
router.route('/:id').get(obtenerProveedor)

export default router