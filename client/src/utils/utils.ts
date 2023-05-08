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