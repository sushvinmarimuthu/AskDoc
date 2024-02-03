"use client";

import * as Y from "yjs";
import {TiptapCollabProvider} from "@hocuspocus/provider";
import PreEditorSetup from "@/app/components/File/PreEditorSetup";

export default function ProviderSetup(props) {
    const {fileId, userId, searchParams, user, file, fileAccess, files, owner, fileSharedUsers, jwt} = props;
    const yDoc = new Y.Doc();

    const provider = new TiptapCollabProvider({
        appId: "v9107wmo",
        name: fileId,
        document: yDoc,
        token: jwt,
    })

    return (
        <>
            {(user && file) && <PreEditorSetup
                userId={userId} fileId={fileId} searchParams={searchParams}
                user={user} file={file} fileAccess={fileAccess} files={files} owner={owner}
                fileSharedUsers={fileSharedUsers} yDoc={yDoc} provider={provider}
            />}
        </>
    )
}