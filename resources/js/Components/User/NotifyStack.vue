<!-- NotifyStack.vue -->
<template>
  <teleport to="body">
    <div class="fixed top-5 right-5 space-y-2 z-50">
      <transition-group name="notify-slide" tag="div">
        <div
            v-for="(notification, index) in notifications"
            :key="notification.id"
            :class="['notify', statusClasses[notification.status]]"
            class="p-4 rounded-lg shadow-xl flex items-center space-x-4 backdrop-blur-sm border border-opacity-20 max-w-md"
            :style="{ marginTop: `${index * 0.5}rem` }"
        >
          <div :class="['icon-container', iconBgClasses[notification.status]]" class="p-3 rounded-full flex items-center justify-center">
            <span class="text-xl">{{ icons[notification.status] }}</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-base">{{ notification.title }}</h3>
            <p class="text-sm opacity-90">{{ notification.message }}</p>
          </div>
          <button @click="close(notification.id)" class="text-sm opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

const notifications = ref([]);

const statusClasses = {
  success: "bg-darkgreen-500/60 text-emerald-50 border-emerald-500",
  error: "bg-darkred-200/60 text-wht-100 border-rose-500",
  warning: "bg-amber-900/80 text-amber-50 border-amber-500",
  info: "bg-indigo-900/80 text-indigo-50 border-indigo-500"
};

const iconBgClasses = {
  success: "bg-emerald-500/30",
  error: "bg-rose-500/30",
  warning: "bg-amber-500/30",
  info: "bg-indigo-500/30"
};

const icons = {
  success: "✓",
  error: "×",
  warning: "!",
  info: "i"
};

const addNotification = (title, message, status, duration = 3000) => {
  if (notifications.value.length >= 3) {
    notifications.value.shift();
  }

  const id = Date.now();
  notifications.value.push({ id, title, message, status });

  setTimeout(() => {
    close(id);
  }, duration);
};

const close = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

defineExpose({
  addNotification
});
</script>

<style scoped>
.notify-slide-enter-active,
.notify-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notify-slide-enter-from,
.notify-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notify-slide-move {
  transition: transform 0.4s;
}

.icon-container {
  width: 32px;
  height: 32px;
}

.notify {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>