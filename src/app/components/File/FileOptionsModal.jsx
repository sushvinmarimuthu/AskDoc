import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import {ListItemIcon, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteFile, renameFile} from "@/app/lib/FileActions";


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

export default function FileOptionsModal(props) {
    const {fileId, userId, fileTitle} = props;
    // Options Button
    const [anchorOptionsEl, setAnchorOptionsEl] = useState(null);
    const openOptionsMenu = Boolean(anchorOptionsEl);
    const handleOptionsClick = (event) => {
        setAnchorOptionsEl(event.currentTarget);
    };
    const handleOptionsClose = () => {
        setAnchorOptionsEl(null);
    };


    // Rename Modal
    const [openRenameModal, setOpenRenameModal] = useState(false);
    const handleRenameModalOpen = () => {
        handleOptionsClose();
        setOpenRenameModal(true)
    };
    const handleRenameModalClose = () => setOpenRenameModal(false);


    // Delete Modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const handleDeleteModalOpen = () => {
        handleOptionsClose();
        setOpenDeleteModal(true)
    };
    const handleDeleteModalClose = () => setOpenDeleteModal(false);


    async function handleFileRename(formData) {
        formData.append('fileId', fileId);
        formData.append('userId', userId);

        await renameFile(formData).then(() => {
            handleRenameModalClose()
        })
    }

    async function handleFileDelete(fileId) {
        await deleteFile(fileId, userId).then(() => {
            handleDeleteModalClose()
        })
    }

    return (
        <>
            <IconButton
                aria-label="options"
                id="options-button"
                aria-controls={openOptionsMenu ? 'options-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openOptionsMenu ? 'true' : undefined}
                onClick={handleOptionsClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="options-menu"
                anchorEl={anchorOptionsEl}
                open={openOptionsMenu}
                onClose={handleOptionsClose}
                MenuListProps={{
                    'aria-labelledby': 'options-button',
                }}
            >
                <MenuItem onClick={handleRenameModalOpen}>
                    <ListItemIcon>
                        <DriveFileRenameOutlineIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="inherit">Rename</Typography>
                </MenuItem>
                <MenuItem onClick={handleDeleteModalOpen}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                </MenuItem>
            </Menu>

            <Modal
                open={openRenameModal}
                onClose={handleRenameModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{mb: 2}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Rename {fileTitle}?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            Please enter a new name for the document.
                        </Typography>
                    </Box>
                    <FormControl sx={{width: '90%'}} component={'form'}
                                 action={async (formData) => handleFileRename(formData)}>
                        <TextField
                            id="rename-field" variant="outlined" defaultValue={fileTitle} size={'small'}
                            name={'name'} type={'text'}
                        />

                        <Stack direction={'row'} spacing={2} sx={{mt: 2}}>
                            <Button type={"submit"} variant={'contained'}>Ok</Button>
                            <Button onClick={handleRenameModalClose} variant={'outlined'}>Cancel</Button>
                        </Stack>
                    </FormControl>
                </Box>
            </Modal>


            <Modal
                open={openDeleteModal}
                onClose={handleDeleteModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Delete {fileTitle}?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        {fileTitle} will be deleted permanently.
                    </Typography>

                    <Stack direction={'row'} spacing={2} sx={{mt: 2}}>
                        <Button onClick={() => handleFileDelete(fileId)} variant={'contained'}
                                color={'error'}>Ok</Button>
                        <Button onClick={handleDeleteModalClose} variant={'outlined'}>Cancel</Button>
                    </Stack>
                </Box>
            </Modal>
        </>

    );
}