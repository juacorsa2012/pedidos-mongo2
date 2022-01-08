import express from 'express'
import errorHandler from './middlewares/error-handler.js'
import notfound from './middlewares/not-found.js'
import authRouter from './routes/authRoutes.js'
import clientesRouter from './routes/clientesRoutes.js'
import proveedoresRouter from './routes/proveedoresRoutes.js'


const app = express()

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/clientes', clientesRouter)
app.use('/api/v1/proveedores', proveedoresRouter)

app.use(notfound)
app.use(errorHandler)

export default app
