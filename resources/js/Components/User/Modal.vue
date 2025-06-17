<template>
  <transition name="modal-fade">
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
        @click.self="onCancel"
        @wheel="handleWheel"
        ref="modalBackdrop"
    >
      <div
          class="bg-gray-800 p-6 rounded-lg shadow-lg relative mt-5 mb-5"
          style="border-radius: 20px; max-width: 400px; min-width: 200px; max-height: 90vh; overflow-y: auto;"
          ref="modalContent"
      >
        <h3
            class="text-xl font-semibold text-white mb-4"
            style="text-align: center; height: 30px; margin-top: -12px; padding-bottom: 40px;"
        >
          {{ title }}
        </h3>
        <div class="text-white">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: { type: String, default: "Подтвердите действие" },
  confirmText: { type: String, default: "Подтвердить" },
});

const emit = defineEmits(["close", "confirm"]);

const modalBackdrop = ref(null);
const modalContent = ref(null);

const onCancel = () => emit("close");
const onConfirm = () => emit("confirm");

const handleWheel = (event) => {
  if (!modalContent.value) return;

  // Проверяем, что скролл происходит вне модального окна
  const isScrollingOutside = !modalContent.value.contains(event.target);

  if (isScrollingOutside) {
    event.preventDefault();

    // Прокручиваем содержимое модального окна
    const scrollAmount = event.deltaY;
    modalContent.value.scrollTop += scrollAmount;
  }
};

const onKeyDown = (event) => {
  if (event.key === "Escape") {
    onCancel();
  }
};

const disableScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
};

const enableScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

watch(
    () => props.isOpen,
    (newValue) => {
      if (newValue) {
        disableScroll();
      } else {
        enableScroll();
      }
    },
    {immediate: true});

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  enableScroll();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>