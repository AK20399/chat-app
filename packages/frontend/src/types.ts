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
    username: string
}

export enum socketEvents {
    ROOM_DATA = 'roomdata',
    MESSAGE = 'message',
    LOCATION_MESSAGE = 'locationMessage',
}
