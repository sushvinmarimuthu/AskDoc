"use client";

import '@/app/css/CustomGutter.css';
import '@/app/css/collaboration.css';

import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Splitter, {SplitDirection} from '@devbookhq/splitter'
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {FontSize, LinkBubbleMenuHandler, ResizableImage} from "mui-tiptap";
import {Document} from "@tiptap/extension-document";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import {TextStyle} from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {Collaboration} from "@tiptap/extension-collaboration";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";
import EditorToolbar from "@/app/components/Editor/EditorToolbar";
import {Highlight} from "@tiptap/extension-highlight";
import {Color} from "@tiptap/extension-color";
import {Link} from "@tiptap/extension-link";
import * as Y from "yjs";
import {HocuspocusProvider} from "@hocuspocus/provider";
import {getFile, saveFileData} from "@/app/lib/FileActions";

const FileEditor = dynamic(() => import('@/app/components/File/FileEditor'), {
    ssr: false,
    loading: () => <Skeleton variant="rectangular"/>,
})

const FilePreview = dynamic(() => import('@/app/components/File/FilePreview'), {
    ssr: false,
    loading: () => <Skeleton variant="rectangular"/>,
})

const doc = new Y.Doc();

export default function Editor(props) {
    const {fileId, userId, searchParams, user, file, fileAccess, files, owner, fileSharedUsers} = props;

    const provider = new HocuspocusProvider({
        url: 'wss://0.0.0.0:1234',
        name: fileId,
        document: doc,
    })

    const [fileData, setFileData] = useState(file.fileData);

    const [fileSaved, setFileSaved] = useState(true);

    const [previewId, setPreviewId] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        if (previewId) {
            handlePreviewFile(previewId).then(r => {
                console.log(r);
            });
        }
    }, [previewId]);

    async function handlePreviewFile(previewId) {
        await getFile(previewId).then((response) => {
            setPreviewFile(response);
        })
    }

    const editor = useEditor({
        extensions: [
            Document,
            StarterKit.configure({history: false}),
            Underline, Superscript, Subscript, TextStyle, FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            FontSize,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            ResizableImage.configure({
                inline: true,
                allowBase64: true,
            }),
            Color.configure({
                types: ['textStyle'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            LinkBubbleMenuHandler,
            Link.configure({
                protocols: ['ftp', 'mailto'],
            }),
            Collaboration.configure({
                document: provider.document,
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: {
                    name: user.name,
                    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                },
            }),
        ],
        editable: (fileAccess && file.type !== 'application/pdf'),
        autofocus: true,
    });

    async function handleFileUpdate(fileData) {
        setFileSaved(false)
        const formData = new FormData();
        formData.append('fileData', fileData);
        formData.append('fileId', fileId);

        await saveFileData(formData);
    }

    useEffect(() => {
        if (!fileSaved) {
            const interval = setInterval(() => {
                setFileSaved(true);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [fileSaved]);

    useEffect(() => {
        if (editor && file) {
            editor.commands.setContent(file.type !== 'application/pdf' && fileData);
            if (editor.getHTML()) {
                editor.on('update', async ({editor}) => {
                    setFileData(editor.getHTML());
                    if (file.type !== 'application/pdf') {
                        await handleFileUpdate(editor.getHTML());
                    }
                })
            }
        }
    }, [editor, file]);

    return (
        <>
            <Box sx={{mt: 2}}>
                <EditorToolbar editor={editor} fileAccess={fileAccess} fileId={fileId} userId={userId}
                               fileSaved={fileSaved} setPreviewId={setPreviewId} file={file} files={files} owner={owner}
                               fileSharedUsers={fileSharedUsers}
                />
                <Divider/>
                <Splitter direction={SplitDirection.Horizontal}
                          gutterClassName="custom-gutter-horizontal"
                >
                    <Box sx={{
                        borderRadius: '0 0 0 10px',
                        display: "flex",
                        flexDirection: "column",
                        height: "700px",
                        backgroundColor: 'white',
                        boxShadow: 2
                    }}>
                        <>
                            <Typography variant={'h6'} sx={{textAlign: 'center', fontWeight: 'bold'}}>
                                Preview(Read-Only)
                            </Typography>
                            <Divider sx={{mb: 1.5}}/>
                            {(searchParams.mode === 'view' || searchParams?.mode === undefined) &&
                                <Box sx={{
                                    overflow: "hidden",
                                    overflowY: "scroll",
                                }}>
                                    {previewFile ?
                                        previewFile.type === 'application/pdf' ?
                                            <iframe
                                                src={`${previewFile.fileData}#toolbar=0&navpanes=0&scrollbar=0`}
                                                style={{minHeight: '100vh', width: '100%'}}/>
                                            :
                                            <FilePreview fileData={previewFile.fileData}/>
                                        :

                                        file.type === 'application/pdf' ?
                                            <iframe src={`${file.fileData}#toolbar=0&navpanes=0&scrollbar=0`}
                                                    style={{minHeight: '100vh', width: '100%'}}/>
                                            :
                                            <FilePreview fileData={fileData}/>
                                    }
                                </Box>
                            }
                        </>
                    </Box>

                    <Box sx={{
                        opacity: fileAccess ? 1 : 0.4,
                        borderRadius: '0 0 10px 0',
                        display: "flex",
                        flexDirection: "column",
                        height: "700px",
                        backgroundColor: 'white',
                        boxShadow: 2
                    }}
                    >
                        <FileEditor editor={editor} mode={searchParams.mode}/>
                    </Box>
                </Splitter>
            </Box>
        </>
    );
}
