export async function registerPasswordValidator(password) {
    if (password === '') {
        return 'RequiredFieldError'
    } else if (password.length < 8) {
        return 'PasswordLengthError'
    }
}

export async function resetPasswordValidator(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        return 'PasswordNotMatchedError'
    } else if (newPassword === confirmPassword) {
        if (newPassword.length < 8) {
            return 'PasswordLengthError'
        }
    }
}

export async function changePasswordValidator(currentPassword, newPassword, confirmPassword, passwordMatch){
    if(!passwordMatch){
        return 'IncorrectPasswordError'
    } else if(currentPassword === newPassword) {
        return 'OldPasswordMatchError'
    } else if (newPassword !== confirmPassword) {
        return 'PasswordNotMatchedError'
    } else if (newPassword === confirmPassword) {
        if (newPassword.length < 8) {
            return 'PasswordLengthError'
        }
    }
}