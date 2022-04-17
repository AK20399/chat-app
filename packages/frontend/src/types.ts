export enum EmessageType {
    message,
    locationMessage,
}

export type Tmessage = {
    username: string
    createdAt: string
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

export interface Giftype {
    type: string
    id: string
    url: string
    slug: string
    bitly_gif_url: string
    bitly_url: string
    embed_url: string
    username: string
    source: string
    title: string
    rating: string
    content_url: string
    source_tld: string
    source_post_url: string
    is_sticker: number
    import_datetime: Date
    trending_datetime: Date
    images: Images
    user: User
    analytics_response_payload: string
    analytics: Analytics
}

export interface Analytics {
    onload: Onclick
    onclick: Onclick
    onsent: Onclick
}

export interface Onclick {
    url: string
}

export interface Images {
    original: FixedHeight
    downsized: The480_WStill
    downsized_large: The480_WStill
    downsized_medium: The480_WStill
    downsized_small: DownsizedSmall
    downsized_still: The480_WStill
    fixed_height: FixedHeight
    fixed_height_downsampled: FixedHeight
    fixed_height_small: FixedHeight
    fixed_height_small_still: The480_WStill
    fixed_height_still: The480_WStill
    fixed_width: FixedHeight
    fixed_width_downsampled: FixedHeight
    fixed_width_small: FixedHeight
    fixed_width_small_still: The480_WStill
    fixed_width_still: The480_WStill
    looping: Looping
    original_still: The480_WStill
    original_mp4: DownsizedSmall
    preview: DownsizedSmall
    preview_gif: The480_WStill
    preview_webp: The480_WStill
    '480w_still': The480_WStill
}

export interface The480_WStill {
    height: string
    width: string
    size: string
    url: string
}

export interface DownsizedSmall {
    height: string
    width: string
    mp4_size: string
    mp4: string
}

export interface FixedHeight {
    height: string
    width: string
    size: string
    url: string
    mp4_size?: string
    mp4?: string
    webp_size: string
    webp: string
    frames?: string
    hash?: string
}

export interface Looping {
    mp4_size: string
    mp4: string
}

export interface User {
    avatar_url: string
    banner_image: string
    banner_url: string
    profile_url: string
    username: string
    display_name: string
    description: string
    instagram_url: string
    website_url: string
    is_verified: boolean
}

export interface gifPayloadType {
    api_key: string
    limit?: number
    offset?: number
    rating?: string
    q?: string
}
