// eslint-disable-next-line import/prefer-default-export
export const generateMessage = (message, username) => {
    console.log("me:", message, username)
    return {
        text: message,
        createdAt: new Date().getTime(),
        username
    }
}