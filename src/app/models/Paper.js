import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaperSchema = new Schema({
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


const Paper = mongoose.models.Paper || mongoose.model('Paper', PaperSchema);
export default Paper;