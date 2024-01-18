"use client";

import {
    RichTextEditorProvider,
    RichTextField,
} from "mui-tiptap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function FileEditor({editor, mode}) {

    return (
        <>
            <Typography variant={'h6'} sx={{textAlign: 'center', fontWeight: 'bold'}}>
                Editor
            </Typography>
            <Divider/>
            <Box sx={{
                overflow: "hidden",
                overflowY: "scroll",
            }}>
                {(mode === 'edit' || mode === undefined) &&
                    <RichTextEditorProvider editor={editor}>
                        <RichTextField variant={'standard'} style={{minHeight: '100vh'}}/>
                    </RichTextEditorProvider>
                }
            </Box>
        </>
    );
}
