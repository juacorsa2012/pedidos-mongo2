import 'express-async-errors'
import dotenv from 'dotenv'
import app from './app.js'

if (process.NODE_ENV == 'production') {  
  dotenv.config({ path: '.env' })
}
else if (process.NODE_ENV == 'development') {
  dotenv.config({ path: '.env.development' })
}
else {
  dotenv.config({ path: '.env.testing' })
}

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} (${process.env.NODE_ENV})`)
  console.log('Database connected')
  console.log("Press CTRL-C to stop")      
})    

export default server

// git push heroku master
// https://pedidos-jc.herokuapp.com/api/v1/clientes