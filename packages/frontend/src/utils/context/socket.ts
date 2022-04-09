import { io, Socket } from 'socket.io-client'
import React from 'react'
import { getAPIUrl } from '../helper/helperFunctions'

const url = getAPIUrl()

export const socket = io(url)
export const SocketContext = React.createContext<null | Socket>(null)
