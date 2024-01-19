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
import {usePathname, useRouter, useSearchParams} from "next/navigation";


export default function MyProfile({user}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);

    function handleActiveField() {
        if (params.has('activeField') && params.get('activeField') === 'active') {
            params.delete('activeField')
        } else {
            params.set('activeField', 'active')
        }
        replace(`${pathname}?${params}`);
    }

    async function handleUpdate(formData) {
        formData.append("userId", user._id);
        await updateUserData(formData).then(() => {
            if (params.has('activeField') && params.get('activeField') === 'active') {
                params.delete('activeField')
                replace(`${pathname}?${params}`);
            }
        })
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
                    disabled={!params.has('activeField')}
                />
                <label htmlFor="profile-input">
                    {params.has('activeField') ?
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
                    disabled={!params.has('activeField')}
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
                        disabled={!params.has('activeField')}>Update</Button>
                <Button variant={'contained'} onClick={handleActiveField}>
                    {params.has('activeField') ? 'Cancel' : 'Edit'}
                </Button>
            </Stack>
        </Stack>
    );
}
