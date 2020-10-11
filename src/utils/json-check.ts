export default function (value: any) {
    value = typeof value !== 'string'
        ? JSON.stringify(value)
        : value;

    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }

    if (typeof value === 'object' && value !== null) {
        return true;
    }

    return false;
}