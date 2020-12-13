import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()
import { authRoutes, postsRoutes, subsRoutes } from './routes'
import { trim } from './middleware'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())

app.get('/', (_, res) => res.send("It's working"))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/subs', subsRoutes)

const PORT = process.env.PORT || 6000
async function start() {
  try {
    await createConnection()

    app.listen(PORT, (): void => {
      console.log(`Server running at port: ${PORT}`)
    })
  } catch (e) {
    console.log(`Starting error: ${e.message}`)
    process.exit(1)
  }
}

start()
