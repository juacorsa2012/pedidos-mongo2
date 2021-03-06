import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js'
import clientesRouter from './routes/clientes.routes.js'
import proveedoresRouter from './routes/proveedores.routes.js'
import pedidosRouter from './routes/pedidos.routes.js'
import { notFound, errorHandler } from './middlewares/index.js'
import connect from './db/connect.js'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()

app.use(express.json())
app.use(morgan('dev'))

connect(process.env.MONGO_URL)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/clientes', clientesRouter)
app.use('/api/v1/proveedores', proveedoresRouter)
app.use('/api/v1/pedidos', pedidosRouter)

app.use(notFound)
app.use(errorHandler)

export default app
