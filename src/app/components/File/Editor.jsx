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
import EditorToolbar from "@/app/components/Editor/EditorToolbar";
import {getFile} from "@/app/lib/FileActions";
import EditorPreviewComp from "@/app/components/Editor/EditorPreviewComp";

const FileEditor = dynamic(() => import('@/app/components/File/FileEditor'), {
    ssr: false,
    loading: () => <Skeleton variant="rectangular"/>,
})

const FilePreview = dynamic(() => import('@/app/components/File/FilePreview'), {
    ssr: false,
    loading: () => <Skeleton variant="rectangular"/>,
})

export default function Editor(props) {
    const {fileId, userId, searchParams, user, file, fileAccess, files, owner, fileSharedUsers, editor, fileData, doc} = props;

    const [fileSaved, setFileSaved] = useState(true);
    const [previewFile, setPreviewFile] = useState(null);

    editor.on('create', ({editor}) => {
        editor.commands.setContent(fileData)
    })

    async function handlePreviewFile(previewId) {
        await getFile(previewId).then((response) => {
            setPreviewFile(response);
        })
    }

    // useEffect(() => {
    //     if (!fileSaved) {
    //         const interval = setInterval(() => {
    //             setFileSaved(true);
    //         }, 3000);
    //
    //         return () => clearInterval(interval);
    //     }
    // }, [fileSaved]);

    // useEffect(() => {
    //     if (editor && editor.getHTML()) {
    //         editor.on('update', async ({editor}) => {
    //             setFileData(editor.getHTML());
    //             if (file.type !== 'application/pdf') {
    //                 await handleFileUpdate(editor.getHTML());
    //             }
    //         })
    //     }
    // }, [editor, file.type]);

    return (
        <>
            <Box sx={{mt: 2}}>
                <EditorToolbar editor={editor} fileAccess={fileAccess} fileId={fileId} userId={userId}
                               fileSaved={fileSaved} file={file} files={files} owner={owner}
                               fileSharedUsers={fileSharedUsers} handlePreviewFile={handlePreviewFile}
                />
                <Divider/>
                <Splitter direction={SplitDirection.Horizontal}
                          gutterClassName="custom-gutter-horizontal"
                >
                    {/*<Box sx={{*/}
                    {/*    borderRadius: '0 0 0 10px',*/}
                    {/*    display: "flex",*/}
                    {/*    flexDirection: "column",*/}
                    {/*    height: "700px",*/}
                    {/*    backgroundColor: 'white',*/}
                    {/*    boxShadow: 2*/}
                    {/*}}>*/}
                    {/*    <>*/}
                    {/*        <Typography variant={'h6'} sx={{textAlign: 'center', fontWeight: 'bold'}}>*/}
                    {/*            Preview(Read-Only)*/}
                    {/*        </Typography>*/}
                    {/*        <Divider sx={{mb: 1.5}}/>*/}
                    {/*        {(searchParams.mode === 'view' || searchParams?.mode === undefined) &&*/}
                    {/*            <Box sx={{*/}
                    {/*                overflow: "hidden",*/}
                    {/*                overflowY: "scroll",*/}
                    {/*            }}>*/}
                    {/*                {previewFile ?*/}
                    {/*                    previewFile.type === 'application/pdf' ?*/}
                    {/*                        <iframe*/}
                    {/*                            src={`${previewFile.fileData}#toolbar=0&navpanes=0&scrollbar=0`}*/}
                    {/*                            style={{minHeight: '100vh', width: '100%'}}/>*/}
                    {/*                        :*/}
                    {/*                        <FilePreview fileData={previewFile.fileData}/>*/}
                    {/*                    :*/}

                    {/*                    file.type === 'application/pdf' ?*/}
                    {/*                        <iframe src={`${file.fileData}#toolbar=0&navpanes=0&scrollbar=0`}*/}
                    {/*                                style={{minHeight: '100vh', width: '100%'}}/>*/}
                    {/*                        :*/}
                    {/*                        <FilePreview fileData={fileData}/>*/}
                    {/*                }*/}
                    {/*            </Box>*/}
                    {/*        }*/}
                    {/*    </>*/}
                    {/*</Box>*/}

                    <Box sx={{
                        borderRadius: '0 0 0 10px',
                        display: "flex",
                        flexDirection: "column",
                        height: "700px",
                        backgroundColor: 'white',
                        boxShadow: 2
                    }}>
                        <EditorPreviewComp doc={doc}/>
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
