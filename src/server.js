import dotenv from 'dotenv'
import connect from './db/connect.js'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await connect(process.env.MONGO_URL)
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
      console.log('Database connected')
      console.log("Press CTRL-C to stop")      
    })
  } catch (error) {
    console.log(error)    
    process.exit(1)
  }
}

start()