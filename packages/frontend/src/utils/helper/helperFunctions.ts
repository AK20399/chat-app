export const getAPIUrl = () =>
    process.env?.REACT_APP_ENV === 'development' &&
    process.env?.REACT_APP_BACKEND
        ? process.env.REACT_APP_BACKEND
        : window.location.origin

export const showError = (error: string) => {
    console.error(error)
    alert(error)
}

export const apiCall = <T>(url: string, init?: RequestInit): Promise<T> => {
    return fetch(url, init).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
}

export const showNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
        new Notification(title, { body })
    }
}

export const isCurrentUser = (first?: string, second?: string) => {
    return first?.trim()?.toLowerCase() === second?.trim()?.toLowerCase()
}
