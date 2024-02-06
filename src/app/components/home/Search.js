"use client";

import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {ClickAwayListener, InputAdornment, MenuList} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Stack from "@mui/material/Stack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import IconButton from "@mui/material/IconButton";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Menu from "@mui/material/Menu";
import LoadingButton from '@mui/lab/LoadingButton';
import {buildIndex} from "@/app/lib/FileActions";

const filterOptions = ['All files', 'Owned by me', 'Shared with me'];

export default function Search({userFiles}) {
    const [isBuildingIndex, setIsBuildingIndex] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);

    function handleChange(event) {
        const {value} = event.target;
        if (value) {
            params.set('searchQuery', value)
        } else {
            params.delete('searchQuery')
        }
        replace(`${pathname}?${params}`);
    }

    function handleSort() {
        if (params.has('sortBy')) {
            params.delete('sortBy')
        } else {
            params.set('sortBy', 'title')
        }
        replace(`${pathname}?${params}`);
    }

    const handleFilterMenuItemClick = (event, index) => {
        if (index === 0 || params.has('ownedByMe') || params.has('sharedWithMe')) {
            params.delete('filterBy')
        } else if (index === 1) {
            params.set('filterBy', 'ownedByMe')
        } else if (index === 2) {
            params.set('filterBy', 'sharedWithMe')
        }
        handleFilterMenuClose();
        replace(`${pathname}?${params}`);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleFilterMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFilterMenuClose = () => {
        setAnchorEl(null);
    };

    async function handleBuildIndex() {
        setIsBuildingIndex(true);
        console.log(userFiles)
        await buildIndex(userFiles);
        setIsBuildingIndex(false);
    }

    return (
        <>
            <Box sx={{m: 1}}>
                <Grid container spacing={2} sx={{mt: 2}}>
                    <Box sx={{flexGrow: 1}}>
                        <TextField
                            type={'text'}
                            variant={'outlined'}
                            onChange={handleChange}
                            sx={{m: 1, "& fieldset": {border: 'none'}}}
                            size={'small'}
                            InputProps={{
                                sx: {
                                    boxShadow: 2,
                                    borderRadius: 3,
                                    backgroundColor: 'white',
                                },
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    </>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Grid item>
                            <Stack direction={'row'} spacing={2} alignItems={"center"}>
                                <Button
                                    id="filter-button"
                                    aria-controls={open ? 'filter-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleFilterMenuClick}
                                    endIcon={<ArrowDropDownIcon/>}
                                    size={"small"}
                                >
                                    {filterOptions[params.get('filterBy') === 'ownedByMe' ? 1 : params.get('filterBy') === 'sharedWithMe' ? 2 : 0]}
                                </Button>
                                <Menu
                                    id="filter-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleFilterMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'filter-button',
                                    }}
                                >
                                    <ClickAwayListener onClickAway={handleFilterMenuClose}>
                                        <MenuList id="filter-menu-button" autoFocusItem>
                                            {filterOptions.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    selected={
                                                        index === (params.get('filterBy') === 'ownedByMe' ? 1 : params.get('filterBy') === 'sharedWithMe' ? 2 : 0)
                                                    }
                                                    onClick={(event) => handleFilterMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Menu>

                                <IconButton color={params.get('sortBy') === 'title' ? 'primary' : 'inherit'}
                                            onClick={handleSort} size="small">
                                    <SortByAlphaIcon/>
                                </IconButton>

                                <LoadingButton variant="contained" color="success" size="small"
                                            onClick={handleBuildIndex} loading={isBuildingIndex}>
                                    Build Index
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </>
    );
}

