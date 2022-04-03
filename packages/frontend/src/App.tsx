import React from 'react'
import './App.css'
import { Home } from './Pages/Home'
import { Chat } from './Pages/Chat'
import { SocketContext, socket } from './context/socket'

const App = () => {
    const [showHome, setShowHome] = React.useState(true)

    return (
        <SocketContext.Provider value={socket}>
            {showHome ? (
                <Home setShowHome={setShowHome} />
            ) : (
                <Chat setShowHome={setShowHome} />
            )}
        </SocketContext.Provider>
    )
}

export default App
