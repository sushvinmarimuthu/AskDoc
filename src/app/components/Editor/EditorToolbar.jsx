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
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {LoadingButton} from "@mui/lab";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import {Autocomplete, Popover} from "@mui/material";
import Button from "@mui/material/Button";
import {useRouter} from "next/navigation";
import FileShareModal from "@/app/components/File/FileShareModal";
import IconButton from "@mui/material/IconButton";
import {createFile, textTranslation} from "@/app/lib/FileActions";

export default function EditorToolbar(props) {
    let {editor, fileAccess, fileId, userId, fileSaved, file, files, owner, fileSharedUsers, handlePreviewFile} = props;
    const [sourceLang, setSourceLang] = useState('eng');
    const [targetLang, setTargetLang] = useState(null);
    const router = useRouter();

    async function getSelectionText(action) {
        // TODO: Change the code for Q/A when get the API.
        if (window.getSelection().toString().length > 0) {
            if ((sourceLang === null || targetLang === null) && action === 'TextTranslation') {
                toast("Please, Select the Source and Target Language.");
            } else {
                if (action === 'TextTranslation') {
                    const sel = window.getSelection();
                    const text = sel.toString();

                    if (sel.rangeCount && text !== '') {
                        const range = sel.getRangeAt(0);

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
                    }
                } else {
                    toast("Waiting for API, So try again later.")
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


    return (
        editor &&
        <Toolbar sx={{mt: 2, borderRadius: '10px 10px 0 0', width: '100%', backgroundColor: 'white'}}>
            <RichTextEditorProvider editor={editor}>
                <Stack sx={{p: 1}}>
                    <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction={'row'}>
                            <Tooltip title="Back to home" disableFocusListener disableTouchListener>
                                <IconButton size={"small"} onClick={() => router.push(`/${userId}/home`)}>
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
                                sx={{width: 300, p: 1}}
                                renderInput={(params) => <TextField {...params} label="Preview File"/>}
                            />
                        </Stack>
                        <Stack direction={'row'}>
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
                                sx={{width: 300, p: 1}}
                                renderInput={(params) => <TextField {...params} label="Editor File"/>}
                            />
                            <Tooltip title="File Saved" disableFocusListener disableTouchListener>
                                <LoadingButton loading={!fileSaved} size={"small"}>
                                    <CloudDoneIcon/>
                                </LoadingButton>
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
                        <MenuDivider/>

                        <MenuSelectTextAlign/>
                        <MenuButtonTaskList/>
                        <MenuButtonBulletedList/>
                        <MenuButtonOrderedList/>
                        <MenuDivider/>

                        <MenuButtonAddTable/>
                        <TableBubbleMenu/>
                        <MenuDivider/>

                        <Stack direction="row" spacing={1}>
                            <ToolsButton
                                getSelectionText={getSelectionText}
                                setSourceLang={setSourceLang}
                                setTargetLang={setTargetLang}
                                sourceLang={sourceLang}
                                targetLang={targetLang}
                                fileAccess={fileAccess}
                            />

                            <DownloadButton fileData={editor.getHTML()}
                                            fileId={fileId} userId={userId}/>

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


                            <FileShareModal owner={owner} fileId={fileId} fileTitle={file.title}
                                            buttonType={'icon'} file={file} fileSharedUsers={fileSharedUsers}/>
                        </Stack>

                    </MenuControlsContainer>
                </Stack>
            </RichTextEditorProvider>
        </Toolbar>
    )
}