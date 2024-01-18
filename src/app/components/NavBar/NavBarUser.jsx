'use client';

import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {ListItemIcon, ListItemText, Skeleton} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';


export default function NavBarUser({user}) {
    const router = useRouter();

    function handleProfileRedirect() {
        handleCloseUserMenu()
        router.push(`/${user._id}/profile?page=profile`);
    }

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        user ?
            <>
                <Tooltip title="Open Menu">
                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                        <Avatar alt="Profile Photo"
                                src={user?.image ? user?.image?.replace('public', '') : ''}/>
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{mt: '45px'}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem key={'Profile'} onClick={handleProfileRedirect}>
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>

                    <MenuItem key={'Logout'} onClick={() => signOut({callbackUrl: "/auth/login"})}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </> :
            <Skeleton variant="circular"><Avatar/></Skeleton>
    );
}