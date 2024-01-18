import React, {useState} from "react";
import Button from "@mui/material/Button";
import {List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Modal, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from '@mui/material/FormControl';
import TextField from "@mui/material/TextField";
import {Autocomplete} from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import toast from 'react-hot-toast';
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import CheckIcon from '@mui/icons-material/Check';
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import {getUserEmail} from "@/app/lib/UserActions";
import {removeFileAccess, updateFilePermission} from "@/app/lib/FileActions";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};


export default function FileShareModal(props) {
    const {owner, fileId, fileTitle, buttonType, file, fileSharedUsers} = props;
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedIds, setSelectedIds] = useState();
    const [emails, setEmails] = useState([]);
    const [isReadWrite, setIsReadWrite] = useState('read');

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = usePathname();
    const {replace} = useRouter();

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        params.set('fileId', fileId)
        setOpen(true)
        replace(`${pathname}?${params}`);
    };
    const handleClose = () => {
        setOpen(false)
        setSelectedOptions([]);
        setIsReadWrite('');
        params.delete('fileId')
        replace(`${pathname}?${params}`);
    };

    function handleChange(e) {
        setIsReadWrite(e.target.value);
    }

    function handleSelectChange(event, value) {
        let ids = [];
        value.map(data => {
            ids.push(data.value);
        })
        setSelectedOptions(value)
        setSelectedIds(ids);
    }


    // Menu Action
    const [anchorMenuEl, setAnchorMenuEl] = useState(null);
    const openMenu = Boolean(anchorMenuEl);
    const handleMenuClick = (event) => {
        setAnchorMenuEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorMenuEl(null);
    };

    async function handleInputChange(e) {
        const input = e.target.value;
        if (input.endsWith("@")) {
            await getUserEmail(input, owner.id).then((data) => {
                setEmails(data);
            })
        }
    }

    async function updateUserFileAccess(isReadWrite, selectedIds) {
        if (isReadWrite === '') return;
        const formData = new FormData();
        formData.append('fileId', fileId);
        formData.append('isReadWrite', isReadWrite);
        formData.append('emailsResult', JSON.stringify(selectedIds));

        await updateFilePermission(formData).then(() => {
            setIsReadWrite('');
            toast.success("File Shared.");
        }).catch(() => {
            toast.error("Unable to share the file. Please try again later.");
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await updateUserFileAccess(isReadWrite, selectedIds);
        setSelectedOptions([]);
    }

    async function updateAccess(isReadWrite, selectedIds) {
        await updateUserFileAccess(isReadWrite, selectedIds);
        handleMenuClose();
    }

    function getFileAccess(file, userId) {
        if (file?.sharedUsers.length > 0) {
            return file?.sharedUsers.at(file?.sharedUsers.findIndex(data => data._id === userId)).access === 'write'
        }
    }

    async function removeAccess(fileId, userId) {
        await removeFileAccess(fileId, userId);
        handleMenuClose();
    }

    return (
        <>
            {buttonType === 'button' ?
                <Button onClick={handleOpen} size={"small"}>Share</Button>
                :
                <IconButton onClick={handleOpen} color={'primary'} size={'small'}><ShareIcon/></IconButton>
            }
            <Modal
                id={fileId}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography gutterBottom variant="h5" component="div" sx={{mb: 2}}>
                        Share {fileTitle}
                    </Typography>
                    <FormControl component="form" fullWidth onSubmit={handleSubmit} id={"SharingForm"}>
                        <Stack spacing={2} direction={"row"}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    multiple
                                    id="emails"
                                    options={emails}
                                    value={selectedOptions}
                                    getOptionLabel={(option) => option.label}
                                    onChange={handleSelectChange}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: {
                                                    borderRadius: 3,
                                                },
                                            }}
                                            variant="outlined"
                                            label="Emails"
                                            placeholder="Select emails to share..."
                                            onChange={handleInputChange}
                                        />
                                    )}
                                    required
                                />
                            </FormControl>
                            <FormControl sx={{width: '180px'}}>
                                <InputLabel id="permission-select-label">Permission</InputLabel>
                                <Select
                                    labelId="permission-select-label"
                                    id="permission-select"
                                    value={isReadWrite}
                                    label="Permission"
                                    onChange={handleChange}
                                    required
                                    sx={{borderRadius: 3}}
                                >
                                    <MenuItem value={'read'}>Viewer</MenuItem>
                                    <MenuItem value={'write'}>Editor</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Divider sx={{mt: 2, mb: 2}}/>
                        <Typography gutterBottom variant="h6" component="div" sx={{mb: 2}}>
                            Access to
                        </Typography>
                        <List sx={{width: '100%', bgcolor: 'background.paper', p: 0}}>
                            <ListItem
                                secondaryAction={
                                    <Typography variant="subtitle2" gutterBottom>
                                        Owner
                                    </Typography>
                                }>
                                <ListItemAvatar>
                                    <Avatar alt="ProfilePic" src={owner.image?.replace('public', '')}/>
                                </ListItemAvatar>
                                <ListItemText primary={owner.name} secondary={owner.email}/>
                            </ListItem>
                        </List>
                        <List sx={{width: '100%', bgcolor: 'background.paper', p: 0}}>
                            {
                                fileSharedUsers.length > 0 &&
                                fileSharedUsers.map((user) =>
                                    <ListItem
                                        key={user._id}
                                        secondaryAction={
                                            <>
                                                <Button
                                                    id="permission-button"
                                                    aria-controls={openMenu ? 'permission-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={openMenu ? 'true' : undefined}
                                                    onClick={handleMenuClick}
                                                    size={"small"}
                                                    variant={"contained"}
                                                >
                                                    {
                                                        file?.sharedUsers &&
                                                        getFileAccess(file, user._id) ? 'Editor' : 'Viewer'
                                                    }
                                                </Button>
                                                <Menu
                                                    id="permission-menu"
                                                    MenuListProps={{
                                                        'aria-labelledby': 'permission-button',
                                                    }}
                                                    anchorEl={anchorMenuEl}
                                                    open={openMenu}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem onClick={() => updateAccess('read', [user._id])}>
                                                        <ListItemIcon>
                                                            {
                                                                !getFileAccess(file, user._id) &&
                                                                <CheckIcon fontSize="small"/>
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText>Viewer</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => updateAccess('write', [user._id])}>
                                                        <ListItemIcon>
                                                            {
                                                                getFileAccess(file, user._id) &&
                                                                <CheckIcon fontSize="small"/>
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText>Editor</ListItemText>
                                                    </MenuItem>
                                                    <Divider/>
                                                    <MenuItem onClick={() => removeAccess(fileId, user._id)}>
                                                        Remove Access
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        }>
                                        <ListItemAvatar>
                                            <Avatar alt="ProfilePic" src={user?.image?.replace('public', '')}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={user?.name} secondary={user?.email}/>
                                    </ListItem>
                                )
                            }
                        </List>

                        <Divider sx={{mt: 2, mb: 2}}/>
                        <Stack direction="row" spacing={2}>
                            <Button type={"submit"} variant={"contained"}>Share</Button>
                            <Button variant={"contained"} onClick={handleClose}>Close</Button>
                        </Stack>
                    </FormControl>
                </Box>
            </Modal>
        </>
    );
}
