import {LoadingButton} from "@mui/lab";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import {ListItem, ListItemButton, ListItemText, Popover, Select} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";

export default function ToolsButton({getSelectionText, setSourceLang, setTargetLang, sourceLang, targetLang, fileAccess}) {
    const [anchorToolsEl, setAnchorToolsEl] = useState(null);
    const openTools = Boolean(anchorToolsEl);
    const handleToolsClick = (event) => {
        setAnchorToolsEl(event.currentTarget);
    };
    const handleToolsClose = () => {
        setAnchorToolsEl(null);
    };

    const [anchorTranslationEl, setAnchorTranslationEl] = useState(null);
    const openTranslation = Boolean(anchorTranslationEl);
    const handleTranslationClick = (event) => {
        setAnchorTranslationEl(event.currentTarget);
    };
    const handleTranslationClose = () => {
        setAnchorTranslationEl(null);
    };

    function handleSourceLangChange(e) {
        handleTranslationClose()
        setSourceLang(e.target.value)
    }

    function handleTargetLangChange(e) {
        handleTranslationClose()
        setTargetLang(e.target.value)
    }


    return (
        <>
            <LoadingButton
                id="tools-button"
                aria-controls={openTools ? 'tools-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openTools ? 'true' : undefined}
                onClick={handleToolsClick}
                endIcon={<ArrowDropDownIcon/>}
                loadingPosition="end"
                variant={"contained"}
                size={"small"}
                color={"success"}
                disabled={!fileAccess}
            >
                Tools
            </LoadingButton>
            <Menu
                id="tools-menu"
                anchorEl={anchorToolsEl}
                open={openTools}
                onClose={handleToolsClose}
                MenuListProps={{
                    'aria-labelledby': 'tools-button',
                }}
            >
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="comments">
                            <SettingsIcon onClick={handleTranslationClick}/>
                        </IconButton>
                    }
                    disablePadding
                >
                    <ListItemButton dense={false} onClick={() => {
                        handleToolsClose()
                        getSelectionText('TextTranslation')
                    }}>
                        <ListItemText primary={"Translation"}/>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton dense={false} onClick={() => {
                        handleToolsClose()
                        getSelectionText('TextQuestion')
                    }}>
                        <ListItemText primary={"Assistant"}/>
                    </ListItemButton>
                </ListItem>
            </Menu>


            <Popover
                open={openTranslation}
                anchorEl={anchorTranslationEl}
                onClose={handleTranslationClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                <Stack direction="row" spacing={2} sx={{mt: 1, p: 1}}>
                    <FormControl size={"small"} sx={{minWidth: 120}}>
                        <InputLabel
                            id="source_language_label">Source</InputLabel>
                        <Select
                            labelId="source_language_label"
                            id="source_language"
                            defaultValue={'eng'}
                            label="Source"
                            onChange={handleSourceLangChange}
                            value={sourceLang}
                        >
                            <MenuItem value={'eng'}>English</MenuItem>
                            <MenuItem value={'hin'}>Hindi</MenuItem>
                            <MenuItem value={'tel'}>Telugu</MenuItem>
                            <MenuItem value={'mar'}>Marathi</MenuItem>
                            <MenuItem value={'guj'}>Gujarati</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size={"small"} sx={{minWidth: 120}}>
                        <InputLabel
                            id="target_language_label">Target</InputLabel>
                        <Select
                            labelId="target_language_label"
                            id="target_language"
                            label="Target"
                            onChange={handleTargetLangChange}
                            value={targetLang}
                        >
                            <MenuItem value={'eng'}>English</MenuItem>
                            <MenuItem value={'hin'}>Hindi</MenuItem>
                            <MenuItem value={'tel'}>Telugu</MenuItem>
                            <MenuItem value={'mar'}>Marathi</MenuItem>
                            <MenuItem value={'guj'}>Gujarati</MenuItem>
                            <MenuItem value={'pun'}>Punjabi</MenuItem>
                            <MenuItem value={'tam'}>Tamil</MenuItem>
                            <MenuItem value={'ban'}>Bangla</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Popover>
        </>
    );
}