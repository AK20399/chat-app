import React from 'react'
import { SocketContext } from '../context/socket'
import { homeChatProps } from '../types'

export const Home: React.FunctionComponent<homeChatProps> = ({
    setShowHome,
}) => {
    const socket = React.useContext(SocketContext)

    const [username, setUsername] = React.useState('')
    const [room, setRoom] = React.useState('')

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        socket &&
            socket.emit('join', { username, room }, (error: string) => {
                if (error) {
                    return alert(error)
                }
                setShowHome(false)
                return true
            })
    }

    return (
        <div className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form onSubmit={handleOnSubmit}>
                    <label>Display name</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Display name"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <label>Room</label>
                    <input
                        type="text"
                        name="room"
                        placeholder="Room"
                        required
                        onChange={(e) => setRoom(e.target.value)}
                        value={room}
                    />
                    <button>Join</button>
                </form>
            </div>
        </div>
    )
}
