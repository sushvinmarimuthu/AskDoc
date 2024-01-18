'use client';

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {updateUserData} from "@/app/lib/UserActions";
import {useState} from "react";


export default function MyProfile({user}) {
    const [activeField, setActiveField] = useState(false);

    function handleActiveField() {
        if (!activeField) {
            setActiveField(true);
        } else {
            setActiveField(false);
        }
    }

    async function handleUpdate(formData) {
        formData.append("userId", user._id);
        await updateUserData(formData);
        setActiveField(false);
    }

    return (
        user &&
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            component={"form"}
            action={handleUpdate}
        >
            <Grid item xs={6}>
                <input
                    accept="image/*"
                    id="profile-input"
                    type="file"
                    name={'file'}
                    hidden
                    disabled={!activeField}
                />
                <label htmlFor="profile-input">
                    {activeField ?
                        <IconButton component='span'>
                            <Avatar
                                alt="ProfilePic"
                                src={user.image?.replace('public', '')}
                                sx={{width: 300, height: 300}}
                            />
                        </IconButton>
                        :
                        <Avatar
                            alt="ProfilePic"
                            src={user.image?.replace('public', '')}
                            sx={{width: 300, height: 300}}
                        />
                    }

                </label>
            </Grid>
            <Box sx={{width: '50%'}}>
                <InputLabel htmlFor="name">
                    Name
                </InputLabel>
                <TextField
                    placeholder="Name" name={"name"} id={"name"}
                    variant="outlined" fullWidth sx={{my: 2}} required
                    defaultValue={user.name}
                    disabled={!activeField}
                />
            </Box>
            <Box sx={{width: '50%'}}>
                <InputLabel htmlFor="email">
                    Email
                </InputLabel>
                <TextField
                    placeholder="Email" name={"email"} id={"email"}
                    variant="outlined" fullWidth sx={{my: 2}} required disabled
                    defaultValue={user.email}
                />
            </Box>
            <Stack spacing={2} direction="row">
                <Button variant={'contained'} type={"submit"}
                        disabled={!activeField}>Update</Button>
                <Button variant={'contained'} onClick={handleActiveField}>
                    {activeField ? 'Cancel' : 'Edit'}
                </Button>
            </Stack>
        </Stack>
    );
}
