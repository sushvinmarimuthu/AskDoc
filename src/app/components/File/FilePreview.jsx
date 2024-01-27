"use client";

import {RichTextReadOnly} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from '@tiptap/extension-image'

// Table MUI Tiptap
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import {Color} from "@tiptap/extension-color";
import {Highlight} from "@tiptap/extension-highlight";
import {LinkBubbleMenuHandler} from "mui-tiptap";
import {Link} from "@tiptap/extension-link";
import {FontSize} from "mui-tiptap";


export default function FilePreview({fileData}) {

    return (
        <>
            <RichTextReadOnly variant={'outlined'} content={fileData} style={{minHeight: '100vh'}} extensions={[
                StarterKit, Underline, Superscript, Subscript, TextStyle, FontFamily,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                FontSize,
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
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableHeader,
                TableCell,
                Image.configure({
                    inline: true,
                    allowBase64: true,
                }),
            ]}/>
        </>
    );
}
