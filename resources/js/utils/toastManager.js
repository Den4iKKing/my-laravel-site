// utils/toastManager.js
import { ref } from "vue";

const toasts = ref([]);

export function useToast() {
    const addToast = (toast) => {
        const id = Date.now();
        toasts.value.push({ id, ...toast });

        setTimeout(() => {
            toasts.value = toasts.value.filter((t) => t.id !== id);
        }, toast.duration || 5000);
    };

    return { toasts, addToast };
}
