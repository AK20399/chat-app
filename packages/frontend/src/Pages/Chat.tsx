import React from 'react'
import { SocketContext } from '../utils/context/socket'
import { EmessageType, socketEvents, Tmessage, Tuser } from '../types'
import { Sidebar } from './Sidebar'
import moment from 'moment'
import {
    isCurrentUser,
    showNotification,
} from '../utils/helper/helperFunctions'
import { useLocation } from 'react-router-dom'

export const Chat: React.FunctionComponent = () => {
    const socket = React.useContext(SocketContext)
    const { state } = useLocation()
    const messagesRef = React.useRef<HTMLDivElement>(null)
    const messageInputRef = React.useRef<HTMLInputElement>(null)
    const sendButtonRef = React.useRef<HTMLButtonElement>(null)
    const sendLocationButtonRef = React.useRef<HTMLButtonElement>(null)
    const [message, setMessage] = React.useState('')
    const [messagesData, setMessagesData] = React.useState<Tmessage[] | []>([])
    const [room, setRoom] = React.useState('')
    const [users, setUsers] = React.useState<[] | Tuser[]>([])
    const [isTyping, setIsTyping] = React.useState(false)
    const [usersAreTyping, setUsersAreTyping] = React.useState<Tuser[] | []>([])

    React.useEffect(() => {
        if (socket) {
            if (message && !isTyping) {
                socket?.emit(socketEvents.TYPING, !isTyping)
                setIsTyping(true)
            } else if (isTyping && message === '') {
                socket?.emit(socketEvents.TYPING, !isTyping)
                setIsTyping(false)
            }
        }
    }, [message, isTyping, socket])

    const getRoomData = (socketData: {
        room: typeof room
        users: typeof users
        currentUser: Tuser
    }) => {
        setRoom(socketData.room)
        setUsers(socketData.users)
    }

    const getMessage = (socketData: Tmessage) => {
        // show notification
        if (
            socketData?.text &&
            socketData.username?.toLowerCase() !== 'admin' &&
            !isCurrentUser(socketData.username, (state as any)?.currentUser)
        ) {
            showNotification(socketData.username, socketData.text)
        }
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
    const handleUsersWhoAreTyping = (usersTyping: Tuser[]) => {
        setUsersAreTyping(usersTyping.filter((user) => user.id !== socket?.id))
    }

    React.useEffect(() => {
        if (socket?.connected) {
            messageInputRef.current?.focus()
            socket.on(socketEvents.MESSAGE, getMessage)
            socket.on(socketEvents.LOCATION_MESSAGE, getMessage)
            socket.on(socketEvents.ROOM_DATA, getRoomData)
            socket.on(socketEvents.USERS_TYPING, handleUsersWhoAreTyping)
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
                                                {isCurrentUser(
                                                    data?.username,
                                                    (state as any)?.currentUser
                                                )
                                                    ? 'You'
                                                    : data?.username || ''}
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
                                            {isCurrentUser(
                                                data?.username,
                                                (state as any)?.currentUser
                                            )
                                                ? 'You'
                                                : data?.username || ''}
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        {usersAreTyping?.length > 0 && (
                            <span
                                style={{
                                    marginLeft: 10,
                                    marginBottom: 5,
                                    fontSize: 14,
                                }}
                            >
                                <b>
                                    {usersAreTyping
                                        .map((user) => user.username)
                                        .join(' ,')}
                                </b>{' '}
                                {usersAreTyping?.length === 1 ? 'is' : 'are'}{' '}
                                typing...
                            </span>
                        )}
                        <div>
                            <form
                                onSubmit={handleMessageSend}
                                id="sendMessageForm"
                            >
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
                                <button
                                    style={{ marginLeft: 10 }}
                                    id="sendLocationID"
                                    ref={sendLocationButtonRef}
                                    onClick={handleSendLocation}
                                >
                                    Send location
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
