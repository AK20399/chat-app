import React from 'react'
import { Tuser } from '../types'
import {
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    ListItemText,
    Typography,
} from '@mui/material'

const drawerWidth = 240

export const Sidebar: React.FunctionComponent<{
    room: string
    users: Tuser[]
}> = ({ room, users, children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <div style={{ paddingLeft: '16px' }}>
            <Box marginTop={2} marginBottom={2}>
                <b>List of current active users</b>
            </Box>
            <Divider />
            <List>
                {users.map((user, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    ></IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {room}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    height: '100vh',
                }}
            >
                <Toolbar />
                <div style={{ height: '93.2vh' }}>{children}</div>
            </Box>
        </Box>
    )
}
