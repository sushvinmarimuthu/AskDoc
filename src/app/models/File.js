import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FileSchema = new Schema({
    title: String,
    description: String,
    fileData: String,
    type: String,
    size: Number,
    owner: {
        id: String,
        name: String,
        email: String,
    },
    sharedUsers: [],
}, {timestamps: true});


const File = mongoose.models.File || mongoose.model('File', FileSchema);
export default File;