import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Server } from 'socket.io'


import axios from 'axios'

const app = new Hono()
app.use('/*', serveStatic({ root: './dist', }))
const port = process.env.PORT || 3000
const server = serve({ fetch: app.fetch, port })
console.log(`Server is running on port ${port}`)

const io = new Server(server)

import { verifyUser, createJWT } from './auth.js'
import { createUser, updateUser, getUser } from './db.js'

io.on('connection', async (socket) => {
  let id = null
  const initSocket = () => {
    socket.on('test', () => {
      socket.emit('test')
    })
  }

  socket.on('login', async ({creds, loginType}) => {
    if (!(id = verifyUser(creds, loginType))) {
      socket.emit('bad login')
      return
    }
    let userData = await getUser(id)
    if (userData == null) {
      userData = await createUser(id)
    }
    socket.emit('jwt', createJWT(id))
    socket.emit('logged in')
    initSocket()
  })

  socket.on('disconnect', () => {
    if (id) {
      // updateUser(id, { })
    }
  })
})

