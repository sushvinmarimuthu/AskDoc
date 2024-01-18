'use client'

import React from "react";
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast';

const Login = dynamic(() => import('@/app/components/auth/login'), {
    ssr: false,
})

function logInErrors(error) {
    switch (error) {
        case "Signin":
            toast.error('Try signing with a different account.');
            break;
        case "OAuthSignin":
            toast.error('Try signing with a different account.');
            break;
        case "OAuthCallback":
            toast.error('Try signing with a different account.');
            break;
        case "OAuthCreateAccount":
            toast.error('Try signing with a different account.');
            break;
        case "EmailCreateAccount":
            toast.error('Try signing with a different account.');
            break;
        case "Callback":
            toast.error('Try signing with a different account.');
            break;
        case "OAuthAccountNotLinked":
            toast.error('To confirm your identity, sign in with the same account you used originally.');
            break;
        case "EmailSignin":
            toast.error('Check your email address.');
            break;
        case "CredentialsSignin":
            toast.error('Sign in failed. Check the details you provided are correct.');
            break;
        default:
            toast.error('Unable to sign in.');
            break
    }
}

function LoginPage() {
    return (
        <Login/>
    );
}

export default LoginPage;
