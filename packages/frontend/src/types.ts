export enum EmessageType {
    message,
    locationMessage,
}

export type Tmessage = {
    username: string
    createdAt: string
    type: number
    text?: string
    url?: string
}

export type Tuser = {
    id: string
    username: string
    room: string
    isTyping?: boolean
}

export enum socketEvents {
    ROOM_DATA = 'roomdata',
    MESSAGE = 'message',
    LOCATION_MESSAGE = 'locationMessage',
    USERS_TYPING = 'usersTyping',
    TYPING = 'typing',
}
