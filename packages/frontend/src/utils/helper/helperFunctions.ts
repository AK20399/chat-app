const port = process.env?.PORT || 5000

export const getAPIUrl = () => `http://${window.location.hostname}:${port}`

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
