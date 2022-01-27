import 'express-async-errors'
import app from './app.js'

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} (${process.env.NODE_ENV})`)
  console.log('Database connected')
  console.log("Press CTRL-C to stop")      
})    

export default server

// git push heroku master
// https://pedidos-jc.herokuapp.com/api/v1/clientes