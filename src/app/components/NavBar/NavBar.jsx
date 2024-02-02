import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import NavBarUser from "@/app/components/NavBar/NavBarUser";
import {getUser} from "@/app/lib/UserActions";

export default async function NavBar({userId}) {
    const user = await getUser(userId);

    return (
        <AppBar position="static" color="inherit"
                sx={{mt: 2, borderRadius: 5, width: '100%', boxShadow: 2, height: '65px'}}>
            <Toolbar disableGutters>
                <Avatar sx={{m: 1, width: 50, height: 50}} src={'/LOGO.jpg'}/>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href={null}
                    sx={{
                        mr: 2,
                        display: {xs: 'none', md: 'flex'},
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    LTRC
                </Typography>

                <Box sx={{flexGrow: 1}}/>

                <Box sx={{flexGrow: 0, m: 1}}>
                    <NavBarUser user={user}/>
                </Box>
            </Toolbar>
        </AppBar>

    );
}