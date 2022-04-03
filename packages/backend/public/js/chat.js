/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const socket = io()

// ELEMENTS
const $messageForm = document.querySelector('#sendMessageForm')
const $messageFormInput = $messageForm.elements.message
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocationID')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// TEMPLATES
const messageTempalate = document.querySelector('#message-template').innerHTML
const messageURLTemplate = document.querySelector('#message-url-template').innerHTML
const sidebarTemplate = document.querySelecres.send("I am a backend server") tor('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

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

const autoScroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom, 10)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// get new messages
socket.on('message', ({ text, createdAt, username: mUsername }) => {
    const html = Mustache.render(messageTempalate, { message: text, createdAt: moment(createdAt).format('h:mm a'), username: mUsername })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('locationMessage', ({ text, createdAt, username: mUsername }) => {
    const html = Mustache.render(messageURLTemplate, { url: text, createdAt: moment(createdAt).format('h:mm a'), username: mUsername })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        location.href = '/'
        return alert(error)
    }
    return true
})

socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users })
    $sidebar.innerHTML = html
})