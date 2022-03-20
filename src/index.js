import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

import { Server } from 'socket.io'
import BadWords from 'bad-words'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    // welcome message
    socket.emit('message', 'Welcome Tiktoker!')

    // send joined message except current user
    socket.broadcast.emit('message', 'Yay, A new tiktoker joined')

    // send message to every user
    socket.on('sendMessage', (message, callback) => {
        const filter = new BadWords()

        if (filter.isProfane(message)) {
            return callback('profanity not allowed')
        }
        io.emit('message', message)
        callback()
        return ''
    })

    // send location to all users
    socket.on('sendLocation', (location, callback) => {
        io.emit(
            'message',
            `https://google.com/maps?q=${location.latitude},${location.longitude}`
        )
        // callback('something went wrong')
        callback()
    })

    // send disconnected message
    socket.on('disconnect', () => {
        socket.broadcast.emit(
            'message',
            'Oops tiktoker left our precious group'
        )
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
