import React, { useEffect } from 'react'
import queryString from 'query-string'
import { gifPayloadType, Giftype } from '../types'
import { uniqBy } from 'lodash'
import { useDebounce } from '../customHooks/useDebounce'
import { Box } from '@mui/material'

interface props {
    gifText: string
    onGifClick: (gif: Giftype) => void
}

export const GiphyUI: React.FunctionComponent<props> = ({
    gifText,
    onGifClick,
}) => {
    const gifsContainerRef = React.useRef<HTMLDivElement>(null)
    const [debounceGif, setDebounceGif] = useDebounce(gifText, 1000)
    const [gifs, setGifs] = React.useState<Giftype[] | []>([])
    const [totalGifs, setTotalGifs] = React.useState(0)
    const [loading, setLoading] = React.useState(false)

    const fetchGifs = (isReset: boolean = true) => {
        if (process.env.REACT_APP_GIPHY_KEY) {
            const payload: gifPayloadType = {
                api_key: process.env.REACT_APP_GIPHY_KEY,
                limit: 25,
            }
            if (gifText) {
                payload['q'] = gifText
            }
            if (!isReset) {
                payload['offset'] = gifs.length
            }
            const query = queryString.stringify(payload)
            const url = gifText
                ? `https://api.giphy.com/v1/gifs/search?${query}`
                : `https://api.giphy.com/v1/gifs/trending?${query}`
            setLoading(true)
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    if (res?.meta?.status === 200 && res?.data) {
                        if (totalGifs !== res?.pagination?.total_count)
                            setTotalGifs(res?.pagination?.total_count)
                        if (isReset) {
                            setGifs(res?.data)
                        } else {
                            setGifs((prev) =>
                                uniqBy([...prev, ...res?.data], 'id')
                            )
                        }
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error)
                    setLoading(false)
                })
        } else {
            console.error('Error: gif api key not found')
        }
    }

    useEffect(() => {
        fetchGifs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceGif])

    useEffect(() => {
        setDebounceGif(gifText)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifText])

    return (
        <Box
            ref={gifsContainerRef}
            display="flex"
            flexWrap="wrap"
            maxHeight="300px"
            overflow="scroll"
            marginTop="10px"
            onScroll={() => {
                if (
                    !loading &&
                    gifs.length < totalGifs &&
                    gifsContainerRef?.current
                ) {
                    if (
                        gifsContainerRef.current.scrollHeight -
                            gifsContainerRef.current.clientHeight -
                            gifsContainerRef.current.scrollTop <
                        80
                    ) {
                        fetchGifs(false)
                    }
                }
            }}
            style={{ backgroundColor: 'black' }}
        >
            {gifs &&
                gifs?.length > 0 &&
                gifs.map((gif) => {
                    return (
                        <div key={gif.id} onClick={() => onGifClick(gif)}>
                            <img
                                style={{ cursor: 'pointer' }}
                                src={gif.images.fixed_height.url}
                                alt={gif.title}
                            />
                        </div>
                    )
                })}
            {loading && (
                <Box style={{ minHeight: '300px', justifyContent: 'center' }}>
                    <b style={{ color: 'white' }}>Loading...</b>
                </Box>
            )}
        </Box>
    )
}
