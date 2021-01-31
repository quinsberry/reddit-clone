import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
import { authRoutes, postsRoutes, subsRoutes, miscRoutes } from './routes'
import { trim } from './middleware'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  }),
)

app.get('/', (_, res) => res.send("It's working"))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/subs', subsRoutes)
app.use('/api/misc', miscRoutes)

const PORT = process.env.PORT || 5000
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
