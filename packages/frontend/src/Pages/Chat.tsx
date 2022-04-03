import React from 'react'
import { SocketContext } from '../context/socket'
import { EmessageType, socketEvents, Tmessage, Tuser } from '../types'
import { Sidebar } from './Sidebar'
import moment from 'moment'

export const Chat: React.FunctionComponent = () => {
    const socket = React.useContext(SocketContext)

    const messagesRef = React.useRef<HTMLDivElement>(null)
    const messageInputRef = React.useRef<HTMLInputElement>(null)
    const sendButtonRef = React.useRef<HTMLButtonElement>(null)
    const sendLocationButtonRef = React.useRef<HTMLButtonElement>(null)
    const [message, setMessage] = React.useState('')
    const [messagesData, setMessagesData] = React.useState<Tmessage[] | []>([])
    const [room, setRoom] = React.useState('')
    const [users, setUsers] = React.useState<[] | Tuser[]>([])

    const getRoomData = (socketData: {
        room: typeof room
        users: typeof users
    }) => {
        setRoom(socketData.room)
        setUsers(socketData.users)
    }

    const getMessage = (socketData: Tmessage) => {
        setMessagesData((prev) => [
            ...prev,
            {
                ...socketData,
                createdAt: moment(socketData.createdAt).format('h:mm a'),
                type: socketData?.text?.includes('http')
                    ? EmessageType.locationMessage
                    : EmessageType.message,
            },
        ])
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }

    const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        sendButtonRef.current?.setAttribute('disabled', 'disabled')

        if (socket?.connected) {
            socket.emit('sendMessage', message, (error: string) => {
                sendButtonRef.current?.removeAttribute('disabled')
                setMessage('')
                messageInputRef.current?.focus()

                if (error) {
                    return alert(error)
                }

                return true
            })
        }
    }

    const handleSendLocation = (event: React.MouseEvent<HTMLElement>) => {
        if (!navigator.geolocation) {
            const geoNotSupported =
                "Your stupid browser doesn't support geolocation"
            alert(geoNotSupported)
            return
        }
        sendLocationButtonRef.current?.setAttribute('disabled', 'disabled')
        navigator.geolocation.getCurrentPosition((position) => {
            if (socket?.connected) {
                socket.emit(
                    'sendLocation',
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    (error: string) => {
                        sendLocationButtonRef.current?.removeAttribute(
                            'disabled'
                        )
                        if (error) {
                            alert(error)
                        }
                    }
                )
            }
        })
    }

    React.useEffect(() => {
        if (socket?.connected) {
            messageInputRef.current?.focus()
            socket.on(socketEvents.MESSAGE, getMessage)
            socket.on(socketEvents.LOCATION_MESSAGE, getMessage)
            socket.on(socketEvents.ROOM_DATA, getRoomData)
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.MESSAGE, getMessage)
                socket.off(socketEvents.LOCATION_MESSAGE, getMessage)
                socket.off(socketEvents.ROOM_DATA, getRoomData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="chat">
            <Sidebar room={room} users={users} />
            <div className="chat__main">
                <div id="messages" className="chat__messages" ref={messagesRef}>
                    {messagesData?.length > 0 &&
                        messagesData.map((data, i) => {
                            if (data?.type === EmessageType.message) {
                                return (
                                    <div className="message" key={i}>
                                        <p>
                                            <span className="message__name">
                                                {data?.username || ''}
                                            </span>
                                            <span className="message__meta">
                                                {data?.createdAt || ''}
                                            </span>
                                        </p>
                                        <p>{data?.text || ''}</p>
                                    </div>
                                )
                            }
                            return (
                                <div key={i}>
                                    <p>
                                        <span className="message__name">
                                            {data?.username || ''}
                                        </span>
                                        <span className="message__meta">
                                            {data?.createdAt || ''}
                                        </span>
                                    </p>
                                    <p>
                                        <a
                                            href={data?.text}
                                            target="_blank"
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
                    <form onSubmit={handleMessageSend} id="sendMessageForm">
                        <input
                            type="text"
                            name="message"
                            placeholder="Enter message"
                            required
                            autoComplete="off"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            ref={messageInputRef}
                        />
                        <button type="submit" ref={sendButtonRef}>
                            Send
                        </button>
                        <br />
                    </form>
                    <button
                        id="sendLocationID"
                        ref={sendLocationButtonRef}
                        onClick={handleSendLocation}
                    >
                        Send location
                    </button>
                    <br />
                    <br />
                </div>
            </div>
        </div>
    )
}