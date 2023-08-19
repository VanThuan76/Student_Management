const PREFIX = `SYSTEM::`;

function set(key: string, value: string) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(PREFIX + key, serializedValue);
    } catch (error) {
        throw new Error('store serialization failed');
    }
}

function get(key: string) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const serializedValue = localStorage.getItem(PREFIX + key);
        if (!serializedValue) {
            return;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        throw new Error('store deserialization failed');
    }
}

function removeItem(key: string) {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.removeItem(PREFIX + key);
    } catch (error) {
        throw new Error('store deserialization failed');
    }
}

function removeAllItem() {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.clear();
    } catch (error) {
        throw new Error('store deserialization failed');
    }
}

export const LocalStorageHelper = { set, get, removeAllItem, removeItem }