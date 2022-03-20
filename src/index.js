import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {

    // welcome message
    socket.emit("message", "Welcome Tiktoker!")

    // send joined message except current user
    socket.broadcast.emit('message', 'Yay, A new tiktoker joined')

    // send message to every user
    socket.on("sendMessage", (message) => {
        io.emit('message', message)
    })

    // send location to all users
    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
    })

    // send disconnected message
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', 'Oops tiktoker left our precious group')
    })
})

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


app.get('/', (req, res) => {
    res.send('index.html')
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`)
})