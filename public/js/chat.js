/* eslint-disable no-alert */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const socket = io()

const messages = []

// ELEMENTS
const $messageForm = document.querySelector('#sendMessageForm')
const $messageFormInput = $messageForm.elements.message
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocationID')
const $messagesDiv = document.querySelector('#messagesID')

// Send location in message
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        const geoNotSupported = "Your stupid browser doesn't support geolocation"
        // eslint-disable-next-line no-alert
        alert(geoNotSupported)
        return
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude }, (error) => {
            $sendLocationButton.removeAttribute('disabled')
            if (error) {
                alert(error)
            }
        })
    })
})

// Send message
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const messageToSend = $messageFormInput.value
    socket.emit('sendMessage', messageToSend, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return alert(error)
        }
        console.log("message delivered")

        return true
    })
})

// update message array
const updateMessagesDOM = () => {
    const messageString = messages.map((message) => {
        if (message.includes('https')) {
            return `<a href=${message} target="_blank">My location</a>`
        }
        return message

    }).join('<br />')
    $messagesDiv.innerHTML = messageString
}

// get new messages
socket.on('message', (message) => {
    messages.push(message)
    updateMessagesDOM()
})