"use client";

import '@/app/css/CustomGutter.css';
import '@/app/css/collaboration.css';

import React, {useState} from "react";
import dynamic from "next/dynamic";
import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Splitter, {SplitDirection} from '@devbookhq/splitter'
import Divider from "@mui/material/Divider";
import EditorToolbar from "@/app/components/Editor/EditorToolbar";
import {getFile} from "@/app/lib/FileActions";
import Typography from "@mui/material/Typography";
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
    const {
        fileId,
        userId,
        searchParams,
        file,
        fileAccess,
        files,
        owner,
        fileSharedUsers,
        editor,
        yDoc,
        status,
        fileData, cursorPos
    } = props;

    const [previewFile, setPreviewFile] = useState(null);

    async function handlePreviewFile(previewId) {
        await getFile(previewId).then((response) => {
            setPreviewFile(response);
        })
    }

    return (
        <>
            <Box sx={{mt: 2}}>
                <EditorToolbar editor={editor} fileAccess={fileAccess} fileId={fileId} userId={userId} file={file}
                               files={files} owner={owner} fileSharedUsers={fileSharedUsers} handlePreviewFile={handlePreviewFile}
                               status={status} yDoc={yDoc} previewFileId={previewFile?._id} cursorPos={cursorPos}
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
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow: 2,
                                            }}>
                                                <FilePreview fileData={previewFile.fileData}/>
                                            </Box>
                                        :

                                        file.type === 'application/pdf' ?
                                            <iframe src={`${file.fileData}#toolbar=0&navpanes=0&scrollbar=0`}
                                                    style={{minHeight: '100vh', width: '100%'}}/>
                                            :
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow: 2,
                                            }}>
                                                <FilePreview fileData={fileData}/>
                                            </Box>
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
                    }}>
                        <FileEditor editor={editor} mode={searchParams.mode}/>
                    </Box>
                </Splitter>
            </Box>
        </>
    );
}
