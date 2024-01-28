import User from "@/app/models/User";
import Paper from "@/app/models/Paper";
import {checkFileAccess} from "@/app/lib/files";
import Loading from "@/app/[id]/loading";
import React, {Suspense} from "react";
import {getSharedUsers, getUserFiles} from "@/app/lib/FileActions";
import Editor from "@/app/components/File/Editor";
import {notFound} from "next/navigation";
import PreEditorSetup from "@/app/components/File/PreEditorSetup";

export default async function FileEditorPreviewPage({params, searchParams}) {
    const fileId = params.fileId;
    const userId = params.id;

    const user = await User.findOne({_id: userId})
    const file = await Paper.findOne({_id: fileId})
    if (!file) {
        return notFound()
    }

    const owner = await User.findOne({_id: file.owner.id})

    const fileAccess = await checkFileAccess(file, userId);
    const userFiles = await getUserFiles(userId);

    let files = [];
    userFiles.flat().map((data) => {
        files.push({id: data._id, label: data.title})
    })

    const fileSharedUsers = await getSharedUsers(fileId);

    return (
        <Suspense fallback={<Loading/>}>
            {file && <PreEditorSetup
                userId={userId} fileId={fileId} searchParams={searchParams}
                user={user} file={file} fileAccess={fileAccess} files={files} owner={owner}
                fileSharedUsers={fileSharedUsers}
            />}
        </Suspense>
    );
}
