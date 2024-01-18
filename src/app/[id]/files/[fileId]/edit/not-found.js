'use client';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Modal} from "@mui/material";
import React from "react";
import {useRouter} from "next/navigation";
import Stack from "@mui/material/Stack";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 3,
    boxShadow: 32,
    p: 4,
};

export default function FileNotFound() {
    const router = useRouter();

    return (
        <Modal
            open={true}
            aria-labelledby="file-not-found-modal"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={3}>
                    <Typography id="file-not-found-modal" variant="h6" component="h2" textAlign={'center'}>
                        File not found!
                    </Typography>
                    <Button variant={'contained'} onClick={() => router.push('/')}>
                        Back to home
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}