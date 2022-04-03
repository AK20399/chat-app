import { io, Socket } from 'socket.io-client'
import React from 'react'

const url = `http://${window.location.hostname}:5000`

export const socket = io(url)
export const SocketContext = React.createContext<null | Socket>(null)
