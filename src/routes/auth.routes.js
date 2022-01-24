import express from 'express'
import * as controller from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/registro').post(controller.registro)
router.route('/login').post(controller.login)

export default router