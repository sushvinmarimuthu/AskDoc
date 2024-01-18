import dynamic from 'next/dynamic'

const ForgotPassword = dynamic(() => import('@/app/components/auth/ForgotPassword'), {
    ssr: false,
})

function ForgotPasswordPage() {

    return (
        <ForgotPassword/>
    );
}

export default ForgotPasswordPage;
