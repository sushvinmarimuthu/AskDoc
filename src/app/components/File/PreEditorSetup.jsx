"use client";

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
import Editor from "@/app/components/File/Editor";
import {useEffect, useState} from "react";
import {saveFileData} from "@/app/lib/FileActions";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";

async function handleFileUpdate(fileData, fileId) {
    const formData = new FormData();
    formData.append('fileData', fileData);
    formData.append('fileId', fileId);
    await saveFileData(formData);
}

export default function PreEditorSetup(props) {
    const {fileId, userId, searchParams, user, file, fileAccess, files, owner, fileSharedUsers, yDoc, provider} = props;
    const [status, setStatus] = useState('Connecting...');

    const [fileData, setFileData] = useState(file.fileData);
    const [cursorPos, setCursor] = useState(0);

    const editor = useEditor({
        onCreate({editor}) {
            provider.on("synced", () => {
                if (editor.isEmpty) {
                    editor.commands.setContent(fileData)
                }
            });
        },
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
                document: yDoc,
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: {
                    name: user.name,
                    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                },
            }),
            Placeholder.configure({
                placeholder:
                    'Write something...',
            }),
        ],
        autofocus: true,

        async onUpdate({editor}) {
            setFileData(editor.getHTML());
            if (file.type !== 'application/pdf') {
                await handleFileUpdate(editor.getHTML(), fileId)
            }
        },

        onSelectionUpdate({editor}) {
            setCursor(editor.state.tr.selection.anchor);
        }
    });

    useEffect(() => {
        const statusHandler = (event) => {
            setStatus(event.status);
        }

        provider.on("status", statusHandler);

        return () => {
            provider.off("status", statusHandler);
        }
    }, [provider]);

    return (
        <>
            {editor && <Editor userId={userId} fileId={fileId} searchParams={searchParams} editor={editor}
                               user={user} file={file} fileAccess={fileAccess} files={files} owner={owner}
                               fileSharedUsers={fileSharedUsers} fileData={fileData} setFileData={setFileData}
                               yDoc={yDoc} cursorPos={cursorPos} status={status}
            />}
        </>
    );
}
