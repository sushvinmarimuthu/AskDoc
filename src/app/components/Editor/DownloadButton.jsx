import {LoadingButton} from "@mui/lab";
import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import {downloadFile, saveFileData} from "@/app/lib/FileActions";

export default function DownloadButton({fileData, fileId, userId}) {
    const [anchorDownloadEl, setAnchorDownloadEl] = useState(null);
    const openDownload = Boolean(anchorDownloadEl);
    const handleDownloadClick = (event) => {
        setAnchorDownloadEl(event.currentTarget);
    };
    const handleDownloadClose = () => {
        setAnchorDownloadEl(null);
    };

    async function handleFileUpdate(fileId, fileData) {
        const formData = new FormData();
        formData.append('fileData', fileData);
        formData.append('fileId', fileId);

        await saveFileData(formData);
    }

    async function handleDownloadFile(fileType) {
        handleDownloadClose();
        await handleFileUpdate(fileId, fileData);
        await downloadFile(fileId, fileType, userId).then((response) => {
            const link = document.createElement("a");
            link.href = response.replace('public', '');
            link.download = response.slice(response.lastIndexOf('/') + 1);
            link.click();
        })
    }

    return (
        <>
            <LoadingButton
                id="download-button"
                aria-controls={openDownload ? 'download-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openDownload ? 'true' : undefined}
                onClick={handleDownloadClick}
                endIcon={<DownloadIcon/>}
                loadingPosition="end"
                variant={"contained"}
                size={"small"}
                color={"success"}
            >
                Download
            </LoadingButton>
            <Menu
                id="download-menu"
                anchorEl={anchorDownloadEl}
                open={openDownload}
                onClose={handleDownloadClose}
                MenuListProps={{
                    'aria-labelledby': 'download-button',
                }}
            >
                <MenuItem onClick={() => handleDownloadFile('.docx')}>Microsoft Word
                    (.docx)</MenuItem>
                {/*<MenuItem onClick={() => handleDownloadFile('.rtf')}>Rich Text Format*/}
                {/*    (.rtf)</MenuItem>*/}
                {/*<MenuItem onClick={() => handleDownloadFile('.pdf')}>PDF Document*/}
                {/*    (.pdf)</MenuItem>*/}
                <MenuItem onClick={() => handleDownloadFile('.txt')}>Plain Text
                    (.txt)</MenuItem>
            </Menu>
        </>
    );
}