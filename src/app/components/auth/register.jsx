'use client';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import toast from 'react-hot-toast';
import {useRouter} from "next/navigation";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import {registerUser} from "@/app/lib/UserActions";


export default function Register() {
    const router = useRouter();

    async function handleRegisterUser(formData) {
        const response = await registerUser(formData);
        if(response === undefined) {
            router.push('/auth/login')
            toast.success('User Registered')
        } else {
            toast.error(response);
        }
    }

    return (
        <>
            <Container maxWidth="xs" sx={{backgroundColor: "white", boxShadow: 2, borderRadius: 3, mt: '120px'}}>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}}>
                    <Avatar src={'/LOGO.png'} sx={{m: 2, height: 60, width: 60}}/>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <FormControl component={'form'} action={async (formData) => handleRegisterUser(formData)}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            type={'text'}
                            autoFocus
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type={'email'}
                            autoComplete="email"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Register
                        </Button>

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="text" onClick={() => {
                                    router.push(`/auth/login`)
                                }}>{"Already have an account? Login"}</Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Box>
            </Container>
        </>
    );
}
