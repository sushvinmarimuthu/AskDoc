"use client";

import React, {useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {ClickAwayListener, Grow, InputAdornment, MenuList, Paper} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Stack from "@mui/material/Stack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {Popper} from "@mui/base";
import MenuItem from "@mui/material/MenuItem";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import IconButton from "@mui/material/IconButton";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const filterOptions = ['All files', 'Owned by me', 'Shared with me'];

function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);

    // Sorting
    const [buttonColor, setButtonColor] = useState("inherit");
    const [selectedIndex, setSelectedIndex] = useState(0);

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
            setButtonColor("inherit")
        } else {
            params.set('sortBy', 'title')
            setButtonColor("primary")
        }
        replace(`${pathname}?${params}`);
    }

    // Files to Show
    const [openFilterMenu, setOpenFilterMenu] = useState(false);
    const anchorFilterMenuRef = useRef(null);

    const handleFilterMenuItemClick = (event, index) => {
        if (index === 0 || params.has('ownedByMe') || params.has('sharedWithMe')) {
            params.delete('filterBy')
        } else if (index === 1) {
            params.set('filterBy', 'ownedByMe')
        } else if (index === 2) {
            params.set('filterBy', 'sharedWithMe')
        }
        setSelectedIndex(index);
        setOpenFilterMenu(false);
        replace(`${pathname}?${params}`);
    };

    const handleFilterToggle = () => {
        setOpenFilterMenu((prevOpen) => !prevOpen);
    };

    const handleFilterMenuClose = (event) => {
        if (anchorFilterMenuRef.current && anchorFilterMenuRef.current.contains(event.target)) {
            return;
        }

        setOpenFilterMenu(false);
    };

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
                            <Stack direction={'row'} spacing={2}>
                                <Button
                                    ref={anchorFilterMenuRef}
                                    size="small"
                                    aria-controls={openFilterMenu ? 'filter-menu-button' : undefined}
                                    aria-expanded={openFilterMenu ? 'true' : undefined}
                                    aria-label="Filter Menu"
                                    aria-haspopup="filter-menu"
                                    onClick={handleFilterToggle}
                                    endIcon={<ArrowDropDownIcon/>}
                                >
                                    {filterOptions[selectedIndex]}
                                </Button>
                                <Popper
                                    sx={{
                                        zIndex: 1,
                                    }}
                                    open={openFilterMenu}
                                    anchorEl={anchorFilterMenuRef.current}
                                    role={undefined}
                                    transition
                                >
                                    {({TransitionProps, placement}) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin:
                                                    placement === 'bottom' ? 'center top' : 'center bottom',
                                            }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleFilterMenuClose}>
                                                    <MenuList id="filter-menu-button" autoFocusItem>
                                                        {filterOptions.map((option, index) => (
                                                            <MenuItem
                                                                key={option}
                                                                selected={index === selectedIndex}
                                                                onClick={(event) => handleFilterMenuItemClick(event, index)}
                                                            >
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>

                                <IconButton color={buttonColor} onClick={handleSort}>
                                    <SortByAlphaIcon/>
                                </IconButton>
                            </Stack>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </>
    );
}

export default Search;
