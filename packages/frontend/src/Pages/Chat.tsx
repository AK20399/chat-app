import React from 'react'
// import { SocketContext } from '../context/socket'
import { connect } from 'socket.io-client'
import {
    EmessageType,
    homeChatProps,
    socketEvents,
    Tmessage,
    Tuser,
} from '../types'
import { Sidebar } from './Sidebar'

export const Chat: React.FunctionComponent<homeChatProps> = () => {
    // const socket = React.useContext(SocketContext)
    const socket = connect('http://localhost:5000')

    const [messagesData, setMessagesData] = React.useState<Tmessage[] | []>([])
    const [room, setRoom] = React.useState('')
    const [users, setUsers] = React.useState<[] | Tuser[]>([])

    const getRoomData = (test: any) => {
        console.log('T:', test)
    }

    const getMessage = (data: any) => {
        console.log('DATA:', data)
    }

    React.useEffect(() => {
        socket?.connected && socket.on(socketEvents.ROOM_DATA, getRoomData)
        socket?.connected && socket.on(socketEvents.MESSAGE, getMessage)
        socket?.connected &&
            socket.on(socketEvents.LOCATION_MESSAGE, getMessage)
    }, [socket])

    return (
        <div className="chat">
            <Sidebar room={room} users={users} />
            <div className="chat__main">
                <div id="messages" className="chat__messages">
                    {messagesData?.length > 0 &&
                        messagesData.map((message) => {
                            if (message?.type === EmessageType.message) {
                                return (
                                    <div className="message">
                                        <p>
                                            <span className="message__name">
                                                {message?.username || ''}
                                            </span>
                                            <span className="message__meta">
                                                {message?.createdAt || ''}
                                            </span>
                                        </p>
                                        <p>{{ message }}</p>
                                    </div>
                                )
                            }
                            return (
                                <div>
                                    <p>
                                        <span className="message__name">
                                            {message?.username || ''}
                                        </span>
                                        <span className="message__meta">
                                            {message?.createdAt || ''}
                                        </span>
                                    </p>
                                    <p>
                                        <a
                                            href={message?.url}
                                            target="_blank"
                                            ref="noopener"
                                            rel="noreferrer"
                                        >
                                            My current location
                                        </a>
                                    </p>
                                </div>
                            )
                        })}
                </div>
                <div className="compose">
                    <form id="sendMessageForm">
                        <input
                            type="text"
                            name="message"
                            placeholder="Enter message"
                            required
                            autoComplete="off"
                        />
                        <button type="submit">Send</button> <br />
                    </form>
                    <button id="sendLocationID">Send location</button>
                    <br />
                    <br />
                </div>
            </div>
        </div>
    )
}
