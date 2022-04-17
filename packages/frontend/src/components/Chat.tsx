import moment from 'moment'
import React, { LegacyRef } from 'react'
import { GiphyUI } from '../components/GiphyUI'
import { socketEvents, Tmessage, Tuser } from '../types'
import { SocketContext } from '../utils/context/socket'
import {
    isCurrentUser,
    isURL,
    showNotification,
} from '../utils/helper/helperFunctions'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import {
    Send as SendIcon,
    MyLocation as MyLocationIcon,
    GifBox as GifIcon,
} from '@mui/icons-material'
import { Messages } from './Messages'

export const Chat: React.FunctionComponent<{ currentUser: string }> = ({
    currentUser,
}) => {
    const socket = React.useContext(SocketContext)
    {
        /* START  -------------------------------------------------------------- React states */
    }

    const [isShowGIF, setIsShowGif] = React.useState(false)
    const [isTyping, setIsTyping] = React.useState(false)
    const [usersAreTyping, setUsersAreTyping] = React.useState<Tuser[] | []>([])
    const [message, setMessage] = React.useState('')

    const messageInputRef = React.useRef<any>(null)
    const messagesRef = React.useRef<HTMLDivElement>(null)
    const sendButtonRef = React.useRef<HTMLButtonElement>(null)
    const sendLocationButtonRef = React.useRef<HTMLButtonElement>(null)
    {
        /* END    -------------------------------------------------------------- React states */
    }

    {
        /* START  -------------------------------------------------------------- Effects */
    }
    React.useEffect(() => {
        if (socket?.connected) {
            messageInputRef && messageInputRef.current.focus()
            socket.on(socketEvents.USERS_TYPING, handleUsersWhoAreTyping)
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.USERS_TYPING, handleUsersWhoAreTyping)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
    {
        /* END    -------------------------------------------------------------- Effects */
    }

    {
        /* START  -------------------------------------------------------------- Functions */
    }

    const handleMessageSend = (
        msg?: string,
        isLocationSend: boolean = false
    ) => {
        setMessage('')
        if (messageInputRef) messageInputRef.current.textContent = ''
        if (isShowGIF) setIsShowGif((prev) => !prev)
        if (isLocationSend) {
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
                    messagesRef.current?.scrollTo(0, document.body.scrollHeight)
                }
            })
        } else {
            sendButtonRef.current?.setAttribute('disabled', 'disabled')

            if (socket?.connected) {
                socket.emit('sendMessage', msg, (error: string) => {
                    sendButtonRef.current?.removeAttribute('disabled')

                    if (error) {
                        return alert(error)
                    }

                    return true
                })
            }
        }
    }
    const handleUsersWhoAreTyping = (usersTyping: Tuser[]) => {
        setUsersAreTyping(usersTyping.filter((user) => user.id !== socket?.id))
    }
    {
        /* END    -------------------------------------------------------------- Functions */
    }

    return (
        <Box style={{ height: '100%', position: 'relative' }}>
            <Box
                ref={messagesRef}
                style={{
                    height: isShowGIF ? '55%' : '90%',
                    overflowY: 'scroll',
                }}
            >
                <Messages messagesRef={messagesRef} currentUser={currentUser} />
            </Box>

            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    padding: '10px',
                    width: '100%',
                }}
            >
                {usersAreTyping?.length > 0 && (
                    <Typography>
                        <b>
                            {usersAreTyping
                                .map((user) => user.username)
                                .join(' ,')}
                        </b>{' '}
                        {usersAreTyping?.length === 1 ? 'is' : 'are'} typing...
                    </Typography>
                )}
                <Box flexDirection="row" display="flex">
                    {/* INPUT AND SEND */}
                    <div
                        ref={messageInputRef}
                        contentEditable
                        onInput={(e) => {
                            setMessage(e.currentTarget.textContent as string)
                        }}
                        onKeyDown={(e) => {
                            if (e.key?.toLowerCase() === 'enter') {
                                e.preventDefault()
                                handleMessageSend(message)
                            }
                        }}
                        onBlur={() => {
                            socket?.emit(socketEvents.TYPING, !isTyping)
                            setIsTyping(false)
                        }}
                        style={{
                            border: '1px solid black',
                            borderRadius: '6px',
                            padding: '10px',
                            flex: 5,
                        }}
                    ></div>
                    <div style={{ position: 'relative' }}>
                        <IconButton
                            color="primary"
                            style={{ position: 'absolute', right: 5, top: 2 }}
                            onClick={() => {
                                setIsShowGif((prev) => !prev)
                            }}
                        >
                            <GifIcon />
                        </IconButton>
                    </div>
                    <IconButton
                        color="success"
                        style={{ flex: 0.1 }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                            handleMessageSend(message)
                        }
                    >
                        <SendIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        style={{ flex: 0.1 }}
                        onClick={() => {
                            handleMessageSend('', true)
                        }}
                    >
                        <MyLocationIcon />
                    </IconButton>
                </Box>
                {/* GIF */}
                {isShowGIF && (
                    <GiphyUI
                        gifText={message}
                        onGifClick={(gif) => {
                            handleMessageSend(gif.images.fixed_height.url)
                        }}
                    />
                )}
            </Box>
        </Box>
    )
}
