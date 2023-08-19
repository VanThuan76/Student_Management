import { APP_REGEX } from "../constant/AppConstant";

export function normalizeNumber(value: string) {
    if (value) {
        value = value.toString().replaceAll(/\D/g, '');
        if (value !== '') {
            return parseInt(value, 10);
        }
    }
    return null;
}

export function validateVNPhone(message?: string) {
    return {
        validator: (_: any, value: string) => {
            console.log(value.toString())
            if (value) {
                if (value.toString().match(APP_REGEX.VN_PHONENUMBER)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(message || 'Vui lòng nhập đúng định dạng số điện thoại');
                }
            }

        }
    }
}
export function validateEmail(message?: string) {
    return {
        validator: (_: any, value: string) => {
            console.log(value.toString())
            if (value) {
                if (value.toString().match(APP_REGEX.EMAIL)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(message || 'Vui lòng nhập đúng định dạng email');
                }
            }

        }
    }
}