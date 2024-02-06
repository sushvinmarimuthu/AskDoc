import React, {Suspense} from "react";
import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";
import Search from "@/app/components/home/Search";
import Files from "@/app/components/home/Files";
import Loading from "@/app/[id]/loading";
import {getSharedUsers, getUserFiles} from "@/app/lib/FileActions";

export default async function HomePage({params, searchParams}) {
    const userId = params.id;
    const userFiles = await getUserFiles(userId);
    const fileId = searchParams?.fileId || null;
    const fileSharedUsers = await getSharedUsers(fileId);

    return (
        <>
            <Box sx={{mb: 3}}>
                <Suspense fallback={<Skeleton variant={'rectangular'} sx={{
                    mt: 2,
                    borderRadius: 5,
                    width: '100%',
                    boxShadow: 2,
                    height: '35px',
                    bgcolor: 'white'
                }}/>}>
                    <Search userFiles={userFiles}/>
                </Suspense>
            </Box>

            <Suspense fallback={<Loading/>}>
                <Files userFiles={userFiles} userId={userId} searchParams={searchParams} fileSharedUsers={fileSharedUsers}/>
            </Suspense>
        </>
    );
}
