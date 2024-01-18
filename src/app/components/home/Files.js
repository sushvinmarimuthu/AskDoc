'use client';

import Typography from "@mui/material/Typography";
import {Card, CardActionArea, CardContent} from "@mui/material";
import Grid from "@mui/material/Grid";
import {FileUploader} from "react-drag-drop-files";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, {Suspense, useEffect, useState} from "react";
import FilesGrid from "@/app/components/home/FilesGrid";
import toast from 'react-hot-toast';
import Fuse from "fuse.js";
import Loading from "@/app/[id]/loading";
import {uploadFile} from "@/app/lib/FileActions";


export default function Files(props) {
    const {userFiles, userId, searchParams, fileSharedUsers} = props;
    const [isUploading, setIsUploading] = useState(false);
    const [filesToShow, setFilesToShow] = useState([]);

    const sortBy = searchParams?.sortBy || null;
    const filterBy = searchParams?.filterBy || null;
    const searchQuery = searchParams?.searchQuery || null;


    function GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    async function setSortedFiles() {
        let array = filesToShow.map((data) => data);
        array.sort(GetSortOrder('title'))
        return array
    }

    useEffect(() => {
            if (searchQuery) {
                const fuse = new Fuse(filesToShow, {keys: ['title']});
                const results = fuse.search(searchQuery);
                let files = [];
                results.map((result) => {
                    files.push(result.item);
                })
                setFilesToShow(files);
            } else if (sortBy) {
                setSortedFiles().then(file => setFilesToShow(file));
            } else if (userFiles) {
                const [ownedByMe, sharedWithMe] = userFiles;
                if (filterBy === null) {
                    setFilesToShow(userFiles.flat());
                } else if (filterBy === 'ownedByMe') {
                    setFilesToShow(ownedByMe);
                } else if (filterBy === 'sharedWithMe') {
                    setFilesToShow(sharedWithMe);
                }
            }
        }, [searchQuery, sortBy, filterBy, userFiles]
    )


    async function handleUpload(file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);

        await uploadFile(formData).then(() => {
            setIsUploading(false)
            toast.success("File Uploaded.")
        }).catch(() => toast.error("Server error. Please try again later."));
    }

    return (
        <Grid container spacing={2} columns={{xs: 4, sm: 8, md: 12}} sx={{mb: 3}}>
            <Grid item xs={3}>
                <FileUploader name="file" types={["PDF", "TXT", "DOCX", "RTF"]} handleChange={handleUpload}>
                    <Card sx={{boxShadow: 2, minHeight: '210px'}}>
                        <CardActionArea
                            sx={{minHeight: '210px', textAlign: 'center', justifyContent: 'center'}}>
                            <CardContent>
                                {
                                    isUploading ? <Typography variant={'subtitle2'}
                                                              gutterBottom>Uploading...</Typography> :
                                        <>
                                            <CloudUploadIcon fontSize={'large'}/>
                                            <Typography variant={'subtitle2'} gutterBottom>Upload or drop a file
                                                right here</Typography>
                                        </>
                                }
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </FileUploader>
            </Grid>

            <Suspense fallback={<Loading/>}>
                <FilesGrid files={filesToShow} userId={userId} fileSharedUsers={fileSharedUsers}/>
            </Suspense>
        </Grid>
    );
}
