import dynamic from 'next/dynamic'

const Register = dynamic(() => import('@/app/components/auth/register'), {
    ssr: false,
})

function RegisterPage() {

    return (
        <Register/>
    );
}

export default RegisterPage;
