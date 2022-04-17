import React from 'react'
import { SocketContext } from '../utils/context/socket'
import { socketEvents, Tuser } from '../types'
import { Sidebar } from '../components/Sidebar'
import { Chat } from '../components/Chat'
import { useLocation } from 'react-router-dom'

export const ChatWrapper: React.FunctionComponent = () => {
    const socket = React.useContext(SocketContext)
    const { state } = useLocation()

    const [room, setRoom] = React.useState('')
    const [users, setUsers] = React.useState<[] | Tuser[]>([])

    React.useEffect(() => {
        if (socket?.connected) {
            socket.on(socketEvents.ROOM_DATA, getRoomData)
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.ROOM_DATA, getRoomData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getRoomData = (socketData: {
        room: typeof room
        users: typeof users
        currentUser: Tuser
    }) => {
        setRoom(socketData.room)
        setUsers(socketData.users)
    }

    return (
        <div className="chat">
            {/* <Sidebar room={room} users={users}> */}
            <Chat currentUser={(state as any)?.currentUser} />
            {/* </Sidebar> */}
        </div>
    )
}
