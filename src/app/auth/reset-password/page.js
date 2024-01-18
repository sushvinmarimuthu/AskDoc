'use client'

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {useRouter} from "next/navigation";
import {resetUserPassword} from "@/app/lib/UserActions";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const router = useRouter();

    async function handleResetPassword(formData) {
        const passwordResetToken = new URL(window.location.href).searchParams.get('passwordResetToken');
        formData.append('passwordResetToken', passwordResetToken)
        const response = await resetUserPassword(formData);
        if(response) {
            toast.error(response)
        } else {
            router.push('/auth/login');
        }
    }


    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                    <Typography component="h1" variant="h5">
                        Reset Your Password
                    </Typography>
                    <FormControl component={'form'} fullWidth action={async (formData) => handleResetPassword(formData)}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="newPassword"
                            label="New Password"
                            type={'password'}
                            name="newPassword"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            type={'password'}
                            name="confirmPassword"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Reset
                        </Button>
                    </FormControl>
                </Box>
            </Container>
        </>
    );
}