import React from 'react'
import './App.css'
import { Home } from './Pages/Home'
import { Chat } from './Pages/Chat'
import { SocketContext, socket } from './utils/context/socket'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
    return (
        <BrowserRouter>
            <SocketContext.Provider value={socket}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </SocketContext.Provider>
        </BrowserRouter>
    )
}

export default App
