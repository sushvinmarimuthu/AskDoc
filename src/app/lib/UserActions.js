'use server';

import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import {ObjectId} from "mongodb";
import {revalidatePath} from "next/cache";
import bcrypt from "bcrypt";
import {registerPasswordValidator, resetPasswordValidator} from "@/app/lib/users";
import bcryptjs from "bcrypt";
import {put} from '@vercel/blob';


export async function registerUser(formData) {
    await connectDB();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');


    if (!name || !email || !password) {
        return 'Missing Fields';
    }

    const isEmailExist = await User.find({email: email}).limit(1).count()
    if (isEmailExist !== 0) {
        return 'Email already exists.';
    }

    await registerPasswordValidator(password).then(error => {
        if (error === 'RequiredFieldError') {
            return 'This field is required.';
        } else if (error === 'PasswordLengthError') {
            return 'Password must be 8 characters.';
        }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const image = null;
    const emailVerified = null;
    const passwordResetToken = null;
    const passwordResetTokenExpiresAt = null;

    await User.create({
        name,
        email,
        hashedPassword,
        image,
        emailVerified,
        passwordResetToken,
        passwordResetTokenExpiresAt,
    })
}

export async function updateUserData(formData) {
    await connectDB();

    const id = formData.get('userId');
    const name = formData.get('name');
    const imageFile = formData.get('file');

    if (name && imageFile.name === "undefined") {
        await User.findOneAndUpdate({_id: new ObjectId(id)}, {name: name});
    }

    if (name && imageFile.name !== "undefined") {
        const ext = imageFile.name.split('.')[1]

        const blob = await put(`avatars/${id}.${ext}`, imageFile, {
            access: 'public',
        });
        await User.findOneAndUpdate({_id: new ObjectId(id)}, {name: name, image: blob.url});
    }

    revalidatePath(`/`);
}

export async function updateUserPassword(formData) {
    const id = formData.get('id');
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    const user = await User.findOne({_id: new ObjectId(id)})

    const passwordMatch = await bcrypt.compare(currentPassword, user.hashedPassword)

    if (!passwordMatch) {
        return 'Incorrect password.'
    } else if (currentPassword === newPassword) {
        return 'New password can not be same as your previous password.'
    } else if (newPassword !== confirmPassword) {
        return 'Please, Check the Confirmation Password and try again.'
    } else if (newPassword === confirmPassword) {
        if (newPassword.length < 8) {
            return 'Password must be 8 characters.'
        }
    }
    if (passwordMatch) {
        user.hashedPassword = await bcrypt.hash(newPassword, 10)
        user.save()
        revalidatePath(`/${id}/profile?page=change-password`);
        return 'success'
    }
}

export async function forgotPassword(formData) {
    await connectDB();
    const email = formData.get('email');

    const user = await User.findOne({email: email});
    if (!user) {
        return undefined;
    }

    const passwordResetToken = bcryptjs.genSaltSync(32);
    const passwordResetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt;

    user.save();

    return `/auth/reset-password?passwordResetToken=${passwordResetToken}`
}

export async function resetUserPassword(formData) {
    await connectDB();
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    const passwordResetToken = formData.get('passwordResetToken');

    await resetPasswordValidator(newPassword, confirmPassword).then(error => {
        if (error === 'PasswordNotMatchedError') {
            return "Please, check the confirmation password.";
        } else if (error === 'PasswordLengthError') {
            return "Password must be 8 characters.";
        }
    })

    const user = await User.findOne({passwordResetToken: passwordResetToken});
    if (!user) {
        return 'User not found.';
    } else if (user && new Date(user.passwordResetTokenExpiresAt) < new Date()) {
        return "Password reset token has expired.";
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordResetToken = null
    user.passwordResetTokenExpiresAt = null
    user.hashedPassword = newHashedPassword

    user.save()

    return undefined;
}

export async function getUserEmail(email, ownerId) {
    await connectDB();
    const user = await User.findOne({_id: new ObjectId(ownerId)})
    const result = await User.find({"email": {"$regex": email, "$options": "i", $ne: user.email}})
    let emails = []
    result.map((data) => {
        emails.push({value: data._id.toString(), label: data.email});
    })
    return JSON.parse(JSON.stringify(emails));
}


export async function getUser(userId) {
    const user = await User.findOne({_id: new ObjectId(userId)});
    return JSON.parse(JSON.stringify(user));

}