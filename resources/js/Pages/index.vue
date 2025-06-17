<template>
    <div class="background-image"></div>
    <div class="flex bg-gray-900 bg-opacity-50 min-h-screen h-full w-full relative z-10 flex-col">
        <h1 class="sr-only">Сервера Rust</h1>
        <div class="flex-1">
            <Navbar :auth="auth"/>
            <div class="auth-error"
                :class="{ 'auth-error--visible': showError }"
                >
                {{ authError }}
            </div>
            <div class="container mx-auto mt-4 content-container">
                <div class="flex flex-col md:flex-row gap-4 justify-center rela-test">
                    <div class="hidden md:block">
                        <SecondMonitoring
                            :servers="servers"
                            :selectedServerId="activeServerId"
                            @server-selected="handleServerSelection"
                        />

                    </div>
                    <div class="w-full max-w-4xl">
                        <Slider />
                        <div class="md:hidden w-full mb-4">
                            <SecondMonitoring
                                :servers="servers"
                                :selectedServerId="activeServerId"
                                @server-selected="handleServerSelection"
                            />

                        </div>
                        <Categories
                            :categories="categories"
                            :servers="servers"
                            :onSearch="handleSearch"
                        />
                        <ProductList
                            :auth="auth"
                            :products="products"
                            :loading="loading"
                            :searchQuery="searchQuery"
                            :activeCategoryId="activeCategoryId"
                            :activeServerId="activeServerId"
                        />
                    </div>
                    <div class="hidden md:block">
                        <ServerStatus :servers="servers"/>
                      <BonusInfo/>
                    </div>
                    <div v-if="isMobile" class="w-full mb-4">
                        <ServerStatus :servers="servers" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import Navbar from "@/Components/User/Navbar.vue";
import ServerStatus from "@/Components/User/Information.vue";
import Categories from "@/Components/User/Categories.vue";
import ProductList from "@/Components/User/Products.vue";
import SecondMonitoring from "@/Components/User/Monitoring.vue";
import axios from "axios";
import {onUnmounted } from "vue";
import {Head} from '@inertiajs/vue3'
import { usePage } from '@inertiajs/vue3'
import BonusInfo from "@/Components/User/BonusInfo.vue";

const isMobile = ref(false);
const checkIfMobile = () => {
    isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});

const servers = ref([]);
const categories = ref([]);
const products = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const activeCategoryId = ref(null);
const activeServerId = ref(1);
const videoOpacity = ref(0.7);
const {auth} = defineProps(["auth"]);

// Функция для обработки выбора сервера
const handleServerSelection = (serverId) => {
    console.log('Выбран сервер с ID:', serverId);
    activeServerId.value = serverId;

    // Найти выбранный сервер и показать информацию
    const selectedServer = servers.value.find(server => server.id === serverId);
    if (selectedServer) {
        console.log('Выбранный сервер:', selectedServer.name);
        // Здесь можно добавить дополнительные действия, например:
        // - Показать уведомление
        // - Обновить другие компоненты
        // - Сохранить выбор в localStorage
    }
};

// Обновленная функция handleSearch для работы с серверами
const handleSearch = (query, categoryId, serverId) => {
    searchQuery.value = query;
    activeCategoryId.value = categoryId;
    if (serverId !== undefined) {
        activeServerId.value = serverId;
    }
};

onMounted(async () => {
    try {
        const response = await axios.get("/api/shop-data");
        servers.value = response.data.servers;
        categories.value = response.data.categories;
        products.value = response.data.shop_items;
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    } finally {
        loading.value = false;
    }
});


const authError = ref('')
const page = usePage()
const showError = ref(false)

onMounted(() => {
  console.log("error mes sec load. DONE")
  const urlParams = new URLSearchParams(window.location.search)
  const err = urlParams.get('auth_error') || page.props.flash?.auth_error
  if (err) {
    authError.value = err
    showError.value = true

    if (urlParams.has('auth_error')) {
      urlParams.delete('auth_error')
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
    }

    // Плавное исчезновение через 3 секунды
    setTimeout(() => {
      showError.value = false
    }, 3000)

  }
})


</script>





<style scoped>

.auth-error {
  color: #fff;
  width: auto;
  height: auto;
  background-color:rgba(220, 38, 38, 0.51);
  font-weight: bold;
  margin-bottom: 20px;
  position: absolute;
  z-index: 111111;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 10%;
  text-align: center;
  padding: 3vh;

  opacity: 0;
  transition: opacity 0.5s ease;
}

.auth-error--visible {
  opacity: 1;
}

.video-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.video-element {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
}

.content-container {
    width: 100%;
    max-width: 1800px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.content-container > .flex > .hidden.md\:block {
    width: 400px !important;
    max-width: 400px !important;
    flex: 0 0 400px !important;
    overflow: hidden !important;
    position: relative;
}

.content-container > .flex > .hidden.md\:block div,
.content-container > .flex > .hidden.md\:block p,
.content-container > .flex > .hidden.md\:block span {
    min-width: 0 !important;
}

.lg\:grid-cols-4 {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr)) !important;
    gap: 15px !important;
}

.w-full.max-w-4xl {
    max-width: 1900px;
}

@media (min-width: 1800px) {
    .content-container {
        margin-left: auto;
        margin-right: auto;
    }
}

@media (max-width: 768px) {
    .video-element {
        object-fit: cover;
    }
}

@media (max-width: 480px) {
    .video-background {
        display: block;
    }
}

@media (max-width: 768px) {
    .content-container {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .flex-col {
        flex-direction: column;
    }

    .flex-row {
        flex-direction: column;
    }

    .gap-4 {
        gap: 0.75rem;
    }

    .max-w-4xl {
        max-width: 100%;
    }
}

.background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://files.facepunch.com/Alistair/103/06/2025/9648/june2025_junglerocks_01_4k.jpg');
    background-size: cover;
    background-position: center;
    z-index: 0;
}
</style>
