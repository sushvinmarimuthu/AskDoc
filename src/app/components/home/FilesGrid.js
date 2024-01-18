import FileShareModal from "@/app/components/File/FileShareModal";
import Typography from "@mui/material/Typography";
import {Card, CardActionArea, CardActions, CardContent} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useRouter} from "next/navigation";
import GroupsIcon from '@mui/icons-material/Groups';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import FileOptionsModal from "@/app/components/File/FileOptionsModal";
import {useState} from "react";
import Loading from "@/app/[id]/loading";
import {checkFileAccess} from "@/app/lib/files";


export default function FilesGrid(props) {
    const {files, userId, fileSharedUsers} = props;
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    function dateFormat(dateInput) {
        let date = new Date(dateInput);
        return date.toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: 'numeric'})
    }

    async function handleCheckFileAccess(file) {
        return await checkFileAccess(file, userId);
    }

    function redirectToEditor(fileId) {
        setLoading(true)
        router.push(`/${userId}/files/${fileId}/edit`, {shallow: true})
    }

    return (
        <>
            {loading && <Loading/>}
            {files.map((file) =>
                <Grid item xs={3} key={file._id}>
                    <Card sx={{boxShadow: 2, minHeight: '210px'}}>
                        <CardActionArea onClick={() => redirectToEditor(file._id)}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" noWrap>
                                    {file.title}
                                </Typography>
                                <Typography noWrap variant="body1" color="text.secondary" gutterBottom>
                                    {file.description}
                                </Typography>
                                <Typography noWrap variant="body2" color="text.secondary" gutterBottom>
                                    Size: {Math.round(file.size / Math.pow(1024, 1))} KB
                                </Typography>
                                <Typography noWrap variant="body2" color="text.secondary" gutterBottom>
                                    Created by: {file.owner.name} at {dateFormat(file.createdAt)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Stack direction={'row'} spacing={2} sx={{width: '100%'}}>
                                {
                                    file.owner.id === userId ?
                                        <FileShareModal owner={file.owner} fileId={file._id} fileTitle={file.title}
                                                        buttonType={'button'} file={file}
                                                        fileSharedUsers={fileSharedUsers}/>
                                        :
                                        <Tooltip title="Shared with you">
                                            <IconButton>
                                                <GroupsIcon/>
                                            </IconButton>
                                        </Tooltip>
                                }
                                <Button size={"small"}
                                        onClick={() => router.push(`/${userId}/files/${file._id}/edit?mode=view`)}>View</Button>
                                {
                                    (file.owner.id === userId || (file.owner.id !== userId && handleCheckFileAccess(file, userId))) &&
                                    <Button size={"small"}
                                            onClick={() => router.push(`/${userId}/files/${file._id}/edit?mode=edit`)}>Edit</Button>}
                            </Stack>
                            {file.owner.id === userId &&
                                <Stack>
                                    <FileOptionsModal fileId={file._id} userId={userId} fileTitle={file.title}/>
                                </Stack>
                            }
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </>
    );
}
