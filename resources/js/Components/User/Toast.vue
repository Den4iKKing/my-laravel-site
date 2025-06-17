<template>
  <teleport to="body">
    <transition name="notify-slide">
      <div
          v-if="visible"
          :class="['notify', statusClass]"
          class="fixed top-5 right-5 p-4 rounded-lg shadow-xl flex items-center space-x-4 backdrop-blur-sm border border-opacity-20 z-50 max-w-md"
      >
        <div :class="['icon-container', iconBgClass]" class="p-3 rounded-full flex items-center justify-center">
          <span class="text-xl">{{ icon }}</span>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-base">{{ title }}</h3>
          <p class="text-sm opacity-90">{{ message }}</p>
        </div>
        <button @click="close" class="text-sm opacity-70 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";

const props = defineProps({
  title: String,
  message: String,
  status: {
    type: String,
    default: "info",
  },
  duration: {
    type: Number,
    default: 3000,
  },
  zIndex: {
    type: Number,
    default: 9999,
  }
});

const visible = ref(true);
const timer = ref(null);

const close = () => {
  visible.value = false;
  clearTimeout(timer.value);
};

onMounted(() => {
  timer.value = setTimeout(() => (visible.value = false), props.duration);
});

const statusClass = computed(() => {
  return {
    success: "bg-darkgreen-100/60 text-emerald-50 border-emerald-500",
    error: "bg-darkred-200/60 text-wht-100 border-rose-500",
    warning: "bg-amber-900/80 text-amber-50 border-amber-500",
    info: "bg-indigo-900/80 text-indigo-50 border-indigo-500",
  }[props.status] || "bg-gray-900/80 text-gray-50 border-gray-500";
});

const iconBgClass = computed(() => {
  return {
    success: "bg-emerald-500/30",
    error: "bg-rose-500/30",
    warning: "bg-amber-500/30",
    info: "bg-indigo-500/30",
  }[props.status] || "bg-gray-500/30";
});

const icon = computed(() => {
  return {
    success: "✓",
    error: "×",
    warning: "!",
    info: "i",
  }[props.status] || "i";
});
</script>

<style scoped>
.notify-slide-enter-active,
.notify-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notify-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notify-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.icon-container {
  width: 32px;
  height: 32px;
}

.notify {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>