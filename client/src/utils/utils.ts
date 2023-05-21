import { toast } from 'react-toastify';
export const notify = (message: string, type: "success" | "error" | "warning" | "none" = "success") => {

    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        case "warning":
            toast.warning(message);
            break;
        default:
            toast(message);
            break;
    }
}

export const filterRangeToString = ({ min, max }: { min: number, max: number }) => {
    if (min === max) {
        return min.toString();
    }
    return `${min} - ${max}`;

}

export const getBaseUrl = () => {
    if (import.meta.env.DEV) {
        return "http://localhost:4200/api";
    }
    return "/api";
}
