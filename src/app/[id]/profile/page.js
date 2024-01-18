import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import Box from "@mui/material/Box";

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LockIcon from '@mui/icons-material/Lock';
import MyProfile from "@/app/components/Profile/MyProfile";
import ChangePassword from "@/app/components/Profile/ChangePassword";
import User from "@/app/models/User";
import {ObjectId} from "mongodb";
import Link from 'next/link'

export default async function ProfilePage({params, searchParams}) {
    const userId = params.id;
    const user = await User.findOne({_id: new ObjectId(userId)})

    return (
        <Box sx={{m: 3}}>
            <Typography id="profile-title" variant="h4" component="h2" sx={{fontWeight: 'bold'}}>
                My Profile
            </Typography>

            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={3}>
                    <List>
                        <ListItem>
                            <ListItemButton selected={searchParams.page === 'profile'} component={Link}
                                            to={`/${userId}/profile?page=profile`}>
                                <ListItemIcon>
                                    <PeopleAltIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Profile"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton selected={searchParams.page === 'change-password'} component={Link}
                                            to={`/${userId}/profile?page=change-password`}>
                                <ListItemIcon>
                                    <LockIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Password"/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={9}>
                    {searchParams.page === 'profile' && <MyProfile user={user}/>}
                    {searchParams.page === 'change-password' && <ChangePassword user={user}/>}
                </Grid>
            </Grid>
        </Box>
    );
}
