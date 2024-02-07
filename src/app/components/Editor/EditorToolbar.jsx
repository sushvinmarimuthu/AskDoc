import {
    LinkBubbleMenu, MenuButtonAddTable, MenuButtonBlockquote, MenuButtonBold, MenuButtonBulletedList,
    MenuButtonCode, MenuButtonCodeBlock, MenuButtonEditLink, MenuButtonHighlightColor, MenuButtonHorizontalRule,
    MenuButtonItalic, MenuButtonOrderedList, MenuButtonRedo, MenuButtonStrikethrough,
    MenuButtonSubscript, MenuButtonSuperscript, MenuButtonTaskList, MenuButtonTextColor,
    MenuButtonUnderline, MenuButtonUndo, MenuControlsContainer, MenuDivider, MenuSelectFontFamily, MenuSelectFontSize,
    MenuSelectHeading, MenuSelectTextAlign, RichTextEditorProvider
} from "mui-tiptap";
import Stack from "@mui/material/Stack";
import ToolsButton from "@/app/components/Editor/ToolsButton";
import DownloadButton from "@/app/components/Editor/DownloadButton";
import Toolbar from "@mui/material/Toolbar";
import React, {useState} from "react";
import toast from 'react-hot-toast';
import {TableBubbleMenu} from "mui-tiptap";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import {Autocomplete, Popover} from "@mui/material";
import Button from "@mui/material/Button";
import {useRouter} from "next/navigation";
import FileShareModal from "@/app/components/File/FileShareModal";
import IconButton from "@mui/material/IconButton";
import {createFile, textQA, textTranslation} from "@/app/lib/FileActions";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import GroupsIcon from "@mui/icons-material/Groups";

export default function EditorToolbar(props) {
    let {editor, fileAccess, fileId, userId, file, files, owner, fileSharedUsers, handlePreviewFile, yDoc, status, previewFileId} = props;
    const [sourceLang, setSourceLang] = useState('eng');
    const [targetLang, setTargetLang] = useState('');
    const router = useRouter();

    async function getSelectionText(action) {
        // TODO: Change the code for Q/A when get the API.
        if (window.getSelection().toString().length > 0) {
            if ((sourceLang === null || targetLang === '') && action === 'TextTranslation') {
                toast("Please, Select the Source and Target Language.");
            } else {
                const sel = window.getSelection();
                const text = sel.toString();
                if (sel.rangeCount && text !== '') {
                    const range = sel.getRangeAt(0);
                    if (action === 'TextTranslation') {
                        const formData = new FormData();
                        formData.append('text', text);
                        formData.append('source_lang', sourceLang);
                        formData.append('target_lang', targetLang);

                        await textTranslation(formData).then((response) => {
                            if (response === undefined) {
                                toast("Please, select any other language.")
                            } else {
                                range.collapse(false);
                                range.insertNode(document.createTextNode(" " + response));
                                sel.collapseToEnd();
                            }
                        })
                    } else {
                        const formData = new FormData();
                        formData.append('text', text);
                        formData.append("previewFileId", previewFileId);
                        await textQA(formData).then((response) => {
                            range.collapse(false);
                            range.insertNode(document.createTextNode(" " + response));
                            sel.collapseToEnd();
                        })
                    }
                }
            }
        } else {
            toast("Please, select some text for input.");
        }
    }

    async function handleFileCreate(formData) {
        formData.append('userId', userId);
        await createFile(formData).then((response) => {
            router.push(`/${userId}/files/${response}/edit`)
        }).catch(() => {
            toast.error("Server error. Please try again later.")
        })
    }

    // New File Popover
    const [anchorNewEl, setAnchorNewEl] = useState(null);

    const handleNewClick = (event) => {
        setAnchorNewEl(event.currentTarget);
    };

    const handleNewClose = () => {
        setAnchorNewEl(null);
    };

    const openNew = Boolean(anchorNewEl);

    function handleRedirect() {
        yDoc.destroy();
        router.push(`/${userId}/home`);
    }


    return (
        editor &&
        <Toolbar sx={{mt: 2, borderRadius: '10px 10px 0 0', width: '100%', backgroundColor: 'white'}}>
            <RichTextEditorProvider editor={editor}>
                <Stack sx={{p: 1}}>
                    <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1} direction={'row'} alignItems="center">
                            <Tooltip title="Back to home" disableFocusListener disableTouchListener>
                                <IconButton size={"small"} onClick={handleRedirect}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Tooltip>
                            <Autocomplete
                                size={"small"}
                                defaultValue={file.title}
                                disablePortal
                                disableClearable
                                onChange={(event, data) => {
                                    handlePreviewFile(data?.id);
                                }}
                                id="files"
                                options={files}
                                isOptionEqualToValue={(option, value) => option.label === value}
                                sx={{width: 300, p: 1}}
                                renderInput={(params) => <TextField {...params} label="Preview File"/>}
                            />
                        </Stack>
                        <Stack spacing={1} direction={'row'} alignItems="center">
                            <Autocomplete
                                size={"small"}
                                defaultValue={file.title}
                                disablePortal
                                disableClearable
                                onChange={(event, data) => {
                                    router.push(`/${userId}/files/${data?.id}/edit`)
                                }}
                                id="files"
                                options={files}
                                isOptionEqualToValue={(option, value) => option.label === value}
                                sx={{width: 300, p: 1}}
                                renderInput={(params) => <TextField {...params} label="Editor File"/>}
                            />
                            <Tooltip title={status === "connected" ? "Connected" : "Connecting..."} disableFocusListener
                                     disableTouchListener>
                                <FiberManualRecordIcon color={status === "connected" ? "success" : "error"}
                                                       fontSize={"small"}/>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    <MenuControlsContainer>
                        <MenuButtonUndo/>
                        <MenuButtonRedo/>
                        <MenuDivider/>

                        <MenuSelectHeading/>
                        <MenuSelectFontFamily options={[
                            {label: "Monospace", value: "monospace"},
                            {label: "Roboto", value: "Roboto"},
                            {label: "Serif", value: "serif"},
                            {label: "Cursive", value: "cursive"},
                            {label: "Comic Sans MS", value: "Comic Sans MS, Comic Sans"},
                            {label: 'Arial', value: 'Arial'},
                            {label: 'Times New Roman', value: 'Times New Roman'},
                            {label: 'Courier New', value: 'Courier New'},
                            {label: 'EB Garamond', value: 'EB Garamond'},
                        ]}/>
                        <MenuDivider/>
                        <MenuButtonTextColor/>
                        <MenuButtonHighlightColor/>
                        <MenuDivider/>

                        <MenuSelectFontSize/>
                        <MenuDivider/>

                        <MenuButtonBold/>
                        <MenuButtonItalic/>
                        <MenuButtonUnderline/>
                        <MenuButtonStrikethrough/>
                        <MenuDivider/>

                        <MenuButtonCode/>
                        <MenuButtonCodeBlock/>
                        <MenuButtonBlockquote/>
                        <MenuDivider/>

                        <LinkBubbleMenu/>
                        <MenuButtonEditLink/>
                        <MenuDivider/>

                        <MenuButtonHorizontalRule/>
                        <MenuDivider/>

                        <MenuButtonSubscript/>
                        <MenuButtonSuperscript/>
                        {/*<MenuDivider/>*/}

                        <MenuSelectTextAlign/>
                        <MenuButtonTaskList/>
                        <MenuButtonBulletedList/>
                        <MenuButtonOrderedList/>
                        <MenuDivider/>

                        <MenuButtonAddTable/>
                        <TableBubbleMenu/>
                        <MenuDivider/>

                        <Stack direction="row" spacing={2} alignItems={"center"}>
                            <ToolsButton
                                getSelectionText={getSelectionText}
                                setSourceLang={setSourceLang}
                                setTargetLang={setTargetLang}
                                sourceLang={sourceLang}
                                targetLang={targetLang}
                                fileAccess={fileAccess}
                            />

                            <DownloadButton fileData={editor.getHTML()}
                                            fileId={fileId} userId={userId} fileTitle={file.title}
                                            updatedAt={file.updatedAt}/>

                            <Tooltip title="Create new document" disableFocusListener disableTouchListener>
                                <Button variant={'contained'} size={'small'} onClick={handleNewClick}>New</Button>
                            </Tooltip>
                            <Popover
                                open={openNew}
                                anchorEl={anchorNewEl}
                                onClose={handleNewClose}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                            >
                                <Stack component={'form'} sx={{m: 1}} spacing={2} direction={'row'}
                                       action={async (formData) => handleFileCreate(formData)}>
                                    <TextField variant={'outlined'} label={"Name"} size={'small'} name={'name'}/>
                                    <Button variant={'contained'} size={'small'} type={'submit'}>Create</Button>
                                </Stack>
                            </Popover>

                            {owner.id === userId ?
                                <FileShareModal owner={owner} fileId={fileId} fileTitle={file.title}
                                                buttonType={'icon'} file={file} fileSharedUsers={fileSharedUsers}/>
                                :
                                <Tooltip title="Shared with you">
                                    <GroupsIcon fontSize={"small"}/>
                                </Tooltip>
                            }
                        </Stack>

                    </MenuControlsContainer>
                </Stack>
            </RichTextEditorProvider>
        </Toolbar>
    )
}