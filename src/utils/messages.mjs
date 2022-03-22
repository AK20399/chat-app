// eslint-disable-next-line import/prefer-default-export
export const generateMessage = (message, username) => ({
    text: message,
    createdAt: new Date().getTime(),
    username
})