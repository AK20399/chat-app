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
