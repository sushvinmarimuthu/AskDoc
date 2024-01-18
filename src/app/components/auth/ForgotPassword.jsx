'use client';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import {useRouter} from "next/navigation";
import Avatar from "@mui/material/Avatar";
import {forgotPassword} from "@/app/lib/UserActions";
import toast from "react-hot-toast";


export default function ForgotPassword() {
    const router = useRouter();

    async function handleForgotPassword(formData) {
        const response = await forgotPassword(formData);
        if(response === undefined) {
            toast.error("User not found.")
        } else {
            toast.success('Email sent.')
            router.push(response);
        }
    }

    return (
        <>
            <Container maxWidth="xs" sx={{backgroundColor: "white", boxShadow: 2, borderRadius: 3, mt: '120px'}}>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}}>
                    <Avatar src={'/LOGO.png'} sx={{m: 2, height: 60, width: 60}}/>
                    <Typography component="h1" variant="h5">
                        Forgot Password?
                    </Typography>
                    <FormControl component={'form'} fullWidth action={async (formData) => handleForgotPassword(formData)}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type={'email'}
                            autoComplete="email"
                            autoFocus
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
                            Send
                        </Button>

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="text" onClick={() => router.push(`/auth/login`)}>{"Back to login?"}</Button>
                            </Grid>

                        </Grid>
                    </FormControl>
                </Box>
            </Container>
        </>
    );
}
