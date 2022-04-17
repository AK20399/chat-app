import React from 'react'
import { Tuser } from '../types'

export const Sidebar = ({ room, users }: { room: string; users: Tuser[] }) => {
    return (
        <div id="sidebar" className="chat__sidebar">
            <h2 className="room-title">{room}</h2>
            <h3 className="list-title">Users</h3>
            <ul className="users">
                {users?.length > 0 &&
                    users.map((user, i) => {
                        return <li key={i}>{user.username}</li>
                    })}
            </ul>
        </div>
    )
}
