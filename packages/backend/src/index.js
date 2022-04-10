/* eslint-disable import/extensions */
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'

import { Server } from 'socket.io'
import BadWords from 'bad-words'
import { generateMessage } from './utils/messages.mjs'
import {
    addUser,
    getAllRoomsName,
    getUser,
    getUsersInRoom,
    removeUser,
    updateTypingValue,
} from './utils/users.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket) => {
    // welcome message to room and new user joined message
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        // welcome message
        socket.emit(
            'message',
            generateMessage(`Welcome ${user.username}!`, 'Admin')
        )

        // send joined message except current user
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                generateMessage(
                    `Yay, ${user.username} joined our ${user.room} group`,
                    'Admin'
                )
            )

        // send room users
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room),
        })
        callback()
        return true
    })

    // send message to every user
    socket.on('sendMessage', (message, callback) => {
        const filter = new BadWords()

        if (filter.isProfane(message)) {
            return callback('profanity not allowed')
        }
        const user = getUser(socket.id)
        io.to(user.room).emit(
            'message',
            generateMessage(message, user.username)
        )
        callback()
        return ''
    })

    // send location to all users
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit(
            'locationMessage',
            generateMessage(
                `https://google.com/maps?q=${location.latitude},${location.longitude}`,
                user.username
            )
        )
        // callback('something went wrong')
        callback()
    })

    socket.on('typing', (isTyping) => {
        const user = getUser(socket.id)
        if (user) {
            socket.broadcast
                .to(user.room)
                .emit('usersTyping', updateTypingValue(socket.id, isTyping))
        }
    })

    // send disconnected message
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit(
                'message',
                generateMessage(
                    `Oops ${user.username} left our precious ${user.room} group`,
                    'Admin'
                )
            )
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room),
            })
        }
    })
})

const publicDirectoryPath = path.join(__dirname, '../../frontend/build')

app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
})
app.get('/room', (req, res) => {
    res.json(getAllRoomsName())
})

server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
