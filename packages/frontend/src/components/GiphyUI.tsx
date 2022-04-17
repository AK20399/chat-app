import React, { useEffect } from 'react'
import queryString from 'query-string'
import { gifPayloadType, Giftype } from '../types'
import _ from 'lodash'
import { useDebounce } from '../customHooks/useDebounce'

interface props {
    gifText: string
    onGifClick: (gif: Giftype) => void
}

export const GiphyUI: React.FunctionComponent<props> = ({
    gifText,
    onGifClick,
}) => {
    const [debounceGif, setDebounceGif] = useDebounce(gifText, 1000)
    const [gifs, setGifs] = React.useState<Giftype[] | []>([])
    const [loading, setLoading] = React.useState(false)

    const fetchGifs = () => {
        if (process.env.REACT_APP_GIPHY_KEY) {
            const payload: gifPayloadType = {
                api_key: process.env.REACT_APP_GIPHY_KEY,
                limit: 20,
            }
            if (gifText) {
                payload['q'] = gifText
            }
            const query = queryString.stringify(payload)
            const url = gifText
                ? `https://api.giphy.com/v1/gifs/search?${query}`
                : `https://api.giphy.com/v1/gifs/trending?${query}`
            setLoading(true)
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    if (res?.data) {
                        setGifs(
                            res?.data?.filter((x: Giftype) => x.type === 'gif')
                        )
                    }
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            console.error('Error: gif api key not found')
        }
    }

    useEffect(() => {
        fetchGifs()
    }, [debounceGif])

    useEffect(() => {
        setDebounceGif(gifText)
    }, [gifText])

    return (
        <div className="gif">
            {loading ? (
                <b style={{ color: 'white' }}>Loading...</b>
            ) : (
                gifs &&
                gifs.map((gif) => {
                    return (
                        <div key={gif.id} onClick={() => onGifClick(gif)}>
                            <img
                                style={{ cursor: 'pointer' }}
                                src={gif.images.fixed_height.url}
                            />
                        </div>
                    )
                })
            )}
        </div>
    )
}
