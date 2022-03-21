// eslint-disable-next-line import/prefer-default-export
export const generateMessage = (message) => ({
    text: message,
    createdAt: new Date().getTime()
})