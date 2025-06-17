<template>
    <nav class="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4" style="max-width: 1800px;">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <div class="flex items-center space-x-1">
                        <span class="text-2xl font-bold text-indigo-400">JDONATE</span>
                        <span class="text-2xl font-bold text-white">RUST</span>
                    </div>
                </div>

                <div class="hidden md:flex items-center space-x-8">
                    <div class="flex items-center space-x-6">
                        <a
                            v-for="(item, index) in menuItems"
                            :key="index"
                            :href="item.link"
                            target="_blank"
                            class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                        >
                            <img :src="item.image" alt="icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span class="font-medium">{{ item.label }}</span>
                        </a>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div
                            v-if="auth.user"
                            class="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
                            @click="openModal"
                        >
                            <span class="text-white font-semibold">{{ balance || '0' }}</span>
                            <img src="https://img.icons8.com/nolan/64/cheap-2.png" alt="Coin" class="w-5 h-5">
                        </div>

                        <div v-if="auth.user" class="relative" ref="userMenuRef">
                            <button
                                @click="toggleUserMenu"
                                class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-indigo-400 transition-colors duration-200"
                            >
                                <img
                                    :src="auth.user.avatar"
                                    alt="Avatar"
                                    class="w-full h-full object-cover"
                                />
                            </button>

                            <div
                                v-if="isUserMenuOpen"
                                class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2"
                            >
                                <a
                                    href="/logout"
                                    class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Выйти
                                </a>
                            </div>
                        </div>

                        <button
                            v-else
                            @click="login"
                            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Войти
                        </button>
                    </div>
                </div>

                <button
                    @click="toggleMobileMenu"
                    class="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                >
                    <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div
                v-if="isMobileMenuOpen"
                class="md:hidden border-t border-gray-700 py-4"
            >
                <div class="space-y-4">
                    <div class="space-y-2">
                        <a
                            v-for="(item, index) in menuItems"
                            :key="index"
                            :href="item.link"
                            target="_blank"
                            class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                            <img :src="item.image" alt="icon" class="w-5 h-5" />
                            <span class="font-medium">{{ item.label }}</span>
                        </a>
                    </div>

                    <div class="pt-4 border-t border-gray-700">
                        <div v-if="auth.user" class="space-y-3">
                            <div
                                class="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg cursor-pointer"
                                @click="openModal"
                            >
                                <span class="text-white font-medium">Баланс</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-white font-semibold">{{ balance || '0' }}</span>
                                    <img src="https://img.icons8.com/nolan/64/cheap-2.png" alt="Coin" class="w-5 h-5">
                                </div>
                            </div>

                            <a
                                href="/logout"
                                class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            >
                                Выйти
                            </a>
                        </div>

                        <button
                            v-else
                            @click="login"
                            class="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Modal :isVisible="isModalVisible" @close="closeModal"/>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from "./PaymentModal.vue";
import axios from 'axios';

const { auth } = defineProps(['auth']);

const isModalVisible = ref(false);
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);
const balance = ref(null);

const menuItems = [
    {
        label: 'Telegram',
        link: 'https://t.me/',
        image: 'https://img.icons8.com/nolan/64/telegram-app.png'
    },
    {
        label: 'Discord',
        link: 'https://discord.gg',
        image: 'https://img.icons8.com/nolan/64/discord-logo.png'
    },
    {
        label: 'VK',
        link: 'https://vk.com/',
        image: 'https://img.icons8.com/nolan/64/vk-com.png'
    }
];

const fetchBalance = async () => {
    if (!auth?.user) return;
    try {
        const response = await axios.get('/api/user/balance');
        balance.value = response.data.balance;
    } catch (error) {
        console.error('Ошибка загрузки баланса:', error);
    }
};

const openModal = () => {
    isModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
};

const closeModal = () => {
    isModalVisible.value = false;
    document.body.style.overflow = '';
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        isUserMenuOpen.value = false;
    }
};

const login = () => {
    window.location.href = '/login';
};

let intervalId = null;

onMounted(() => {
    fetchBalance();
    intervalId = setInterval(fetchBalance, 100000);
    document.addEventListener('click', handleClickOutside);
});


onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Анимации можно добавить через CSS переходы, которые уже включены в классы */
</style>
