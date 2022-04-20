// eslint-disable-next-line import/prefer-default-export
export const generateMessage = (message, username) => {
    return {
        text: message,
        createdAt: new Date().getTime(),
        username,
    }
}
