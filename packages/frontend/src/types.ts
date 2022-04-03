export interface homeChatProps {
    setShowHome: (value: boolean) => void
}

export enum EmessageType {
    message,
    locationMessage,
}

export type Tmessage = {
    username: string
    createdAt: string
    type: number
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
