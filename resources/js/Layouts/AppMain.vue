
<template>
  <div class="video-background">
    <video autoplay muted loop class="video-background__video">
<!--      <source src="/uploads/industrial.mp4" type="video/mp4" />-->
      <source src="/uploads/industrial.webm" type="video/webm">
    </video>
    <div class="overlay"></div> 
    <div class="content">
    <div v-if="authError" class="auth-error">
      {{ authError }}
    </div>
      <slot />
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import Toast from "@/Components/User/Toast.vue"

console.log('TT.загружен!')

const authError = ref('')
const page = usePage()

onMounted(() => {
  console.log('FLASH:', page.props.value) // ← Вот здесь
  // Пробуем достать ошибку через query-параметр
  const urlParams = new URLSearchParams(window.location.search)
  const err = urlParams.get('error') || page.props.value.error
  console.log('AUTH ERROR:', err);


  if (err) {
    authError.value = err

    // Убираем query-параметр из адресной строки
    if (urlParams.has('auth_error')) {
      urlParams.delete('auth_error')
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
    }
  }
})
</script>


<style scoped>
.video-background {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video-background__video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.auth-error {
  background-color: #dc2626; /* красный */
  color: white;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 600;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

</style>
