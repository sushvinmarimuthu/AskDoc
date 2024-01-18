import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    hashedPassword: String,
    image: String,
    emailVerified: Boolean,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
}, {timestamps: true});


const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;