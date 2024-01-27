import {FontSize, LinkBubbleMenuHandler, ResizableImage, RichTextEditorProvider, RichTextField} from "mui-tiptap";
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
import Placeholder from '@tiptap/extension-placeholder';
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";
import {Highlight} from "@tiptap/extension-highlight";
import {Color} from "@tiptap/extension-color";
import {Link} from "@tiptap/extension-link";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";


export default function EditorPreviewComp({doc}) {
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
                document: doc,
            }),
            Placeholder.configure({
                placeholder:
                    'Write something...',
            }),
        ],
        // editable: false,
        autofocus: true,
        onUpdate({editor}) {
            console.log(editor.getHTML())
        },
    });

    return (
        <>
            <Typography variant={'h6'} sx={{textAlign: 'center', fontWeight: 'bold'}}>
                Preview
            </Typography>
            <Divider/>
            <Box sx={{
                    overflow: "hidden",
                    overflowY: "scroll",
                }}>
                <RichTextEditorProvider editor={editor}>
                    <RichTextField variant={'standard'} style={{minHeight: '100vh'}}/>
                </RichTextEditorProvider>
            </Box>
        </>
    )
}