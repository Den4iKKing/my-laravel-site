<template>
    <transition name="modal-fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[95vh] overflow-auto relative">
                <h3 class="text-xl font-semibold text-white mb-4">{{ title }}</h3>

                <div class="text-white">
                    <slot></slot>
                </div>

                <div class="mt-4 flex justify-end space-x-2">
                    <button
                        @click="onCancel"
                        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                        Отмена
                    </button>
                    <button
                        @click="onConfirm"
                        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    title: { type: String, default: "Подтвердите действие" },
    confirmText: { type: String, default: "Подтвердить" },
});

const emit = defineEmits(["close", "confirm"]);

const onCancel = () => emit("close");
const onConfirm = () => emit("confirm");
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}
</style>
