export const APP_SAVE_KEYS = {
    KEYS: 'keys',
    SESSION_KEY: 'sessionKey',
    ROLE: 'role',
    TIME_EXPIRED: 'timeExpired',
    THEME: 'THEME',
    LANGUAGE: 'LANGUAGE'
}
export const APP_ROLE_DEFAULT = [
    {value: 1, label: "Admin"},
    {value: 2, label: "Staff"},
    {value: 3, label: "User"}
]
export  const APP_REGEX = {
    VN_PHONENUMBER: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
    EMAIL : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
}