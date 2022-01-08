import express from 'express'
import {registro, login} from '../controllers/authController.js'

const router = express.Router()

router.route('/registro').post(registro)
router.route('/login').post(login)

export default router