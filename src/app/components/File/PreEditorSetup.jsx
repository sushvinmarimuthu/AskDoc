"use client";

import '@/app/css/CustomGutter.css';
import '@/app/css/collaboration.css';

import {FontSize, LinkBubbleMenuHandler, ResizableImage} from "mui-tiptap";
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
import {Highlight} from "@tiptap/extension-highlight";
import {Color} from "@tiptap/extension-color";
import {Link} from "@tiptap/extension-link";
import * as Y from "yjs";
import Editor from "@/app/components/File/Editor";
import {useState} from "react";
import {saveFileData} from "@/app/lib/FileActions";


async function handleFileUpdate(fileData, fileId) {
    // setFileSaved(false)
    const formData = new FormData();
    formData.append('fileData', fileData);
    formData.append('fileId', fileId);

    await saveFileData(formData);
}

export default function PreEditorSetup(props) {
    const ydoc = new Y.Doc();
    const {fileId, userId, searchParams, user, file, fileAccess, files, owner, fileSharedUsers} = props;

    const [fileData, setFileData] = useState(file.fileData);

    const editor = useEditor({
        extensions: [
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
                document: ydoc,
            }),
            // CollaborationCursor.configure({
            //     provider: provider,
            //     user: {
            //         name: user.name,
            //         color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            //     },
            // }),
            Placeholder.configure({
                placeholder:
                    'Write something...',
            }),
        ],
        content: fileData,
        autofocus: true,

        async onUpdate({editor}) {
            console.log("Updated...")
            setFileData(editor.getHTML());
            if (file.type !== 'application/pdf') {
                await handleFileUpdate(editor.getHTML(), fileId).then(() => {
                    console.log("File saved...")
                });
            }
        }
    });

    return (
        <>
            {editor && <Editor userId={userId} fileId={fileId} searchParams={searchParams} editor={editor}
                               user={user} file={file} fileAccess={fileAccess} files={files} owner={owner}
                               fileSharedUsers={fileSharedUsers} fileData={fileData} ydoc={ydoc}/>}
        </>
    );
}
