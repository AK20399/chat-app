/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const socket = io()

const messages = []

// Send location in message
document.querySelector('#sendLocationID').addEventListener('click', () => {
    if (!navigator.geolocation) {
        const geoNotSupported = "Your stupid browser doesn't support geolocation"
        // eslint-disable-next-line no-alert
        alert(geoNotSupported)
        return
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude })
    })
})

// Send message
document.querySelector('#sendMessageForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const messageToSend = e.target.elements.message.value
    socket.emit('sendMessage', messageToSend)
    e.target.elements.message.value = ''
})

// update message array
const updateMessagesDOM = () => {
    const messageString = messages.map((message) => {
        if (message.includes('https')) {
            return `<a href=${message} target="_blank">My location</a>`
        }
        return message

    }).join('<br />')
    document.querySelector('#messagesID').innerHTML = messageString
}

// get new messages
socket.on('message', (message) => {
    messages.push(message)
    updateMessagesDOM()
})