import {useReducer, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import {Chip} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import Loading from "@/app/[id]/loading";

function reducer(prevState, action) {
    return {
        ...prevState,
        [action.event]: action.value,
    };
}

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [userCredentials, dispatch] = useReducer(reducer, {
        email: "",
        password: "",
    });

    function handleChange(event) {
        dispatch({
            event: event.target.name,
            value: event.target.value,
        });
    }

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        await signIn('google')
    }

    const handleGithubLogin = async (e) => {
        e.preventDefault();
        await signIn('github')
    }

    const handleMicrosoftLogin = async (e) => {
        e.preventDefault();
        await signIn('azure-ad')
    }

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (userCredentials.email === '' || userCredentials.password === '') {
            return;
        }
        await signIn('credentials',
            {
                ...userCredentials,
            }).then((response) => {
            if (response?.error) {
                toast.error(response?.error);
                setLoading(false)
            } else {
                toast.success("Logged in successfully.")
                setLoading(false)
            }
        })
    }

    return (
        <>
            {loading && <Loading/>}
            <Container maxWidth="xs" sx={{backgroundColor: "white", boxShadow: 2, borderRadius: 3, mt: '120px'}}>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}}>
                    <Avatar src={'/LOGO.png'} sx={{m: 2, height: 60, width: 60}}/>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <FormControl component={'form'} onSubmit={loginUser}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type={'email'}
                            autoComplete="email"
                            onChange={handleChange}
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
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={handleChange}
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="text" onClick={() => {
                                    router.push(`/auth/register`)
                                }}>{"Don't have an account? Register"}</Button>
                            </Grid>

                            <Grid item>
                                <Button variant="text" onClick={() => {
                                    router.push(`/auth/forgot-password`)
                                }}>{"Forgot password?"}</Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Box>
                <Divider sx={{mt: 2, mb: 2}}>
                    <Chip label="or"/>
                </Divider>
                <Box sx={{p: 2}}>
                    <Stack justifyContent="center" alignItems="center" direction="row" spacing={1}>
                        <IconButton aria-label="google" color={"primary"} onClick={handleGoogleLogin}>
                            <GoogleIcon/>
                        </IconButton>
                        <IconButton color={"primary"} aria-label="github" onClick={handleGithubLogin}>
                            <GitHubIcon/>
                        </IconButton>
                        <IconButton color={"primary"} aria-label="microsoft" onClick={handleMicrosoftLogin}>
                            <MicrosoftIcon/>
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}
