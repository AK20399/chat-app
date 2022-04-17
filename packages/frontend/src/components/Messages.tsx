import { Box, Fab, Typography } from '@mui/material'
import moment from 'moment'
import React, { useState } from 'react'
import { socketEvents, Tmessage } from '../types'
import { SocketContext } from '../utils/context/socket'
import {
    isCurrentUser,
    isURL,
    showNotification,
} from '../utils/helper/helperFunctions'
import { ArrowCircleDownOutlined } from '@mui/icons-material'

export const Messages: React.FunctionComponent<{
    messagesRef: any
    currentUser: string
}> = ({ currentUser, messagesRef }) => {
    const socket = React.useContext(SocketContext)
    const [messagesData, setMessagesData] = React.useState<Tmessage[] | []>([])
    const [newMessages, setNewMessages] = useState(0)

    React.useEffect(() => {
        if (socket?.connected) {
            socket.on(socketEvents.MESSAGE, getMessage)
            socket.on(socketEvents.LOCATION_MESSAGE, getMessage)
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.MESSAGE, getMessage)
                socket.off(socketEvents.LOCATION_MESSAGE, getMessage)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (messagesData && messagesData?.length > 0) {
            autoScroll()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messagesData])

    React.useEffect(() => {
        const messagesRefTemp = messagesRef.current
        messagesRef.current.addEventListener('scroll', onScroll)
        return () => {
            messagesRefTemp.removeEventListener('scroll', onScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onScroll = () => {
        if (
            Math.abs(
                messagesRef.current?.scrollHeight -
                    messagesRef.current?.clientHeight -
                    messagesRef.current?.scrollTop -
                    messagesRef.current?.lastChild?.lastChild?.offsetHeight || 0
            ) <= 50
        ) {
            setNewMessages(0)
        }
    }

    const autoScroll = () => {
        if (messagesRef) {
            if (
                Math.abs(
                    messagesRef.current?.scrollHeight -
                        messagesRef.current?.clientHeight -
                        messagesRef.current?.scrollTop -
                        messagesRef.current?.lastChild?.lastChild
                            ?.offsetHeight || 0
                ) <= 50
            ) {
                messagesRef.current?.scrollTo(
                    0,
                    messagesRef.current.scrollHeight
                )
                setNewMessages(0)
            } else {
                setNewMessages((prev) => prev + 1)
            }
        }
    }

    const getMessage = (socketData: Tmessage) => {
        // show notification
        if (
            socketData?.text &&
            socketData.username?.toLowerCase() !== 'admin' &&
            !isCurrentUser(socketData.username, currentUser)
        ) {
            showNotification(socketData.username, socketData.text)
        }
        setMessagesData((prev) => [
            ...prev,
            {
                ...socketData,
                createdAt: moment(socketData.createdAt).format('h:mm a'),
            },
        ])
    }

    const renderMessage = (text?: string) => {
        if (text && typeof text === 'string') {
            if (text?.includes('https://') && text.includes('giphy.com')) {
                return (
                    <p>
                        <img src={text} alt={text} />
                    </p>
                )
            } else if (text.includes('https://google.com/maps')) {
                return (
                    <p>
                        <a href={text} target="_blank" rel="noreferrer">
                            My current location
                        </a>
                    </p>
                )
            } else if (isURL(text)) {
                return (
                    <p>
                        <a href={text} target="_blank" rel="noreferrer">
                            {text}
                        </a>
                    </p>
                )
            } else {
                return <p>{text || ''}</p>
            }
        }
        return ''
    }

    return (
        <Box padding={1} paddingRight={2} paddingLeft={2}>
            {newMessages > 0 && (
                <Fab
                    variant="extended"
                    color="primary"
                    onClick={() => {
                        messagesRef.current?.scrollTo(
                            0,
                            messagesRef.current.scrollHeight
                        )
                        setNewMessages(0)
                    }}
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: messagesRef.current.clientWidth / 2,
                    }}
                >
                    <ArrowCircleDownOutlined />
                    <span style={{ marginLeft: '10px', textTransform: 'none' }}>
                        {newMessages} new{' '}
                        {newMessages > 1 ? 'messages' : 'message'}
                    </span>
                </Fab>
            )}
            {messagesData &&
                messagesData?.length > 0 &&
                messagesData.map((message, i) => {
                    return (
                        <Box
                            key={i}
                            marginTop={2}
                            marginBottom={2}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isCurrentUser(
                                    message?.username,
                                    currentUser
                                )
                                    ? 'flex-end'
                                    : message?.username?.toLowerCase() ===
                                      'admin'
                                    ? 'center'
                                    : 'flex-start',
                            }}
                        >
                            <Typography>
                                <b>
                                    {isCurrentUser(
                                        message?.username,
                                        currentUser
                                    )
                                        ? 'You'
                                        : message?.username || ''}
                                </b>{' '}
                                {message.createdAt}
                            </Typography>
                            {renderMessage(message?.text)}
                        </Box>
                    )
                })}
        </Box>
    )
}
