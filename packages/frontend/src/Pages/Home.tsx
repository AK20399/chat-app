import React from 'react'
import { SocketContext } from '../utils/context/socket'
import { useNavigate } from 'react-router-dom'
import { apiCall, getAPIUrl, showError } from '../utils/helper/helperFunctions'
import {
    Typography,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Autocomplete,
    TextField,
    Card,
    CardContent,
    CardActions,
    Box,
    CardHeader,
} from '@mui/material'
import formBackground from '../assets/formBackground.jpg'

export const Home: React.FunctionComponent = () => {
    const socket = React.useContext(SocketContext)

    const navigate = useNavigate()

    const [username, setUsername] = React.useState('')
    const [room, setRoom] = React.useState('')
    const [rooms, setRooms] = React.useState<string[]>(['abc', 'xyz'])
    const [roomsLoading, setRoomsLoading] = React.useState(true)

    React.useEffect(() => {
        getRoomsList()
    }, [])

    const getRoomsList = async () => {
        try {
            const tempRooms = await apiCall<string[]>(`${getAPIUrl()}/room`, {
                method: 'GET',
            })
            // setRooms(tempRooms)
        } catch (error) {
            showError(error as string)
        } finally {
            setRoomsLoading(false)
        }
    }

    const handleOnSubmit = () => {
        navigate('/chat', { state: { currentUser: username } })
        socket &&
            socket.emit('join', { username, room }, (error: string) => {
                if (error) {
                    return alert(error)
                }
                return true
            })
    }

    return (
        <Box
            style={{
                backgroundImage: `url(${formBackground})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            height="100vh"
            width="100vw"
        >
            <Card
                sx={{
                    minWidth: '30%',
                    maxheight: '50%',
                    border: '2px solid black',
                    borderRadius: '20px',
                }}
                variant="outlined"
            >
                <CardHeader
                    title="My chat app"
                    style={{
                        textAlign: 'center',
                        borderBottom: '1px solid #ddd',
                    }}
                />
                <CardContent style={{ paddingBottom: '0px' }}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="name-input">
                            Display name
                        </InputLabel>
                        <OutlinedInput
                            id="name-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            label="Display name"
                        />
                    </FormControl>
                    <br />
                    <br />
                    <Autocomplete
                        freeSolo
                        id="room-id"
                        disableClearable
                        options={rooms}
                        value={room}
                        onChange={(e, value) => setRoom(value)}
                        onInputChange={(e, value) => setRoom(value)}
                        renderInput={(params) => (
                            <TextField {...params} label="Room" />
                        )}
                    />
                    <br />
                </CardContent>
                <CardActions
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '10px',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleOnSubmit}
                    >
                        Join
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setRoom('')
                            setUsername('')
                        }}
                    >
                        Clear
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
