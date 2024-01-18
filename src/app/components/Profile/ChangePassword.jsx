'use client';

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {useRef, useState} from "react";
import {updateUserPassword} from "@/app/lib/UserActions";
import toast from 'react-hot-toast';


export default function ChangePassword({user}) {
    const formRef = useRef(null);
    const [formValid, setFormValid] = useState(true);
    const [currentPasswordHelperText, setCurrentPasswordHelperText] = useState(null);
    const [newPasswordHelperText, setNewPasswordHelperText] = useState(null);
    const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState(null);


    const checkErrorText = (currentPassword, newPassword, confirmPassword) => {
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            setCurrentPasswordHelperText("This field is required.");
            setNewPasswordHelperText("This field is required.");
            setConfirmPasswordHelperText("This field is required.");
            setFormValid(false)
            return false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordHelperText("Confirmation password must be same.");
            setFormValid(false)
            return false;
        } else if (newPassword.length < 8) {
            setNewPasswordHelperText("Password length must be 8 characters.");
            setFormValid(false)
            return false;
        } else if (confirmPassword.length < 8) {
            setConfirmPasswordHelperText("Password length must be 8 characters.");
            setFormValid(false)
            return false;
        } else {
            setFormValid(true)
            setCurrentPasswordHelperText(null);
            setNewPasswordHelperText(null);
            setConfirmPasswordHelperText(null);
            return true;
        }
    }

    async function handleUpdate(formData) {
        formData.append("id", user._id);
        if (checkErrorText(formData.get('currentPassword'), formData.get('newPassword'), formData.get('confirmPassword'))) {
            const passwordUpdate = await updateUserPassword(formData);
            if (passwordUpdate === 'success') {
                toast.success(passwordUpdate);
                formRef.current?.reset();
            } else {
                toast.warning(passwordUpdate)
            }
        }
    }

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            component={"form"}
            action={handleUpdate}
            ref={formRef}
        >
            <Box sx={{width: '50%'}}>
                <InputLabel htmlFor="currentPassword">
                    Current Password
                </InputLabel>
                <TextField
                    error={!formValid && currentPasswordHelperText}
                    placeholder="Current Password" name={"currentPassword"} id={"currentPassword"}
                    variant="outlined" fullWidth sx={{my: 2}} required
                    autocomplete={false} type={"password"}
                    helperText={!formValid && currentPasswordHelperText}
                />
            </Box>

            <Box sx={{width: '50%'}}>
                <InputLabel htmlFor="newPassword">
                    New Password
                </InputLabel>
                <TextField
                    error={!formValid && newPasswordHelperText}
                    placeholder="New Password" name={"newPassword"} id={"newPassword"}
                    variant="outlined" fullWidth sx={{my: 2}} required
                    autocomplete={false} type={"password"}
                    helperText={!formValid && newPasswordHelperText}
                />
            </Box>

            <Box sx={{width: '50%'}}>
                <InputLabel htmlFor="confirmationPassword">
                    Confirmation Password
                </InputLabel>
                <TextField
                    error={!formValid && confirmPasswordHelperText}
                    placeholder="Confirmation Password" name={"confirmPassword"} id={"confirmPassword"}
                    variant="outlined" fullWidth sx={{my: 2}} required
                    autocomplete={false} type={"password"}
                    helperText={!formValid && confirmPasswordHelperText}
                />
            </Box>

            <Stack spacing={2} direction="row">
                <Button variant={'contained'} type={"submit"}>Change Password</Button>
            </Stack>
        </Stack>
    );
}
