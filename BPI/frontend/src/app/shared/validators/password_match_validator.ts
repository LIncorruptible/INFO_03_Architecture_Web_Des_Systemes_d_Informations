import { AbstractControl } from "@angular/forms"

export const PasswordsMatchValidator = (
    password: string, confirmPassword: string) => {
    const validator = (form: AbstractControl) => {
        const passwordControl = form.get(password);
        const confirmPasswordControl = form.get(confirmPassword);

        if (!passwordControl || !confirmPasswordControl) {
            return;
        }

        if (confirmPasswordControl.value !== passwordControl.value) {
            confirmPasswordControl.setErrors({ notMatch: true });
        } else {
            const errors = confirmPasswordControl.errors;

            if(!errors) return;
            else {
                delete errors['notMatch'];
                if (!Object.keys(errors).length) {
                    confirmPasswordControl.setErrors(null);
                } else {
                    confirmPasswordControl.setErrors(errors);
            }
        } 
    }
    return validator;
}}