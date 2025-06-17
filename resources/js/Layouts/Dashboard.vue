<template>
  <div class="flex bg-gray-900 min-h-screen font-sans">
    <div class="w-64 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg p-6 flex flex-col">
<!--      <div class="mb-8">-->
<!--        <h2 class="text-white text-2xl font-bold flex items-center">-->
<!--          <span class="text-blue-400 mr-2">J</span>Donate <span class="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">2.0</span>-->
<!--        </h2>-->
<!--        <div class="h-0.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-2"></div>-->
<!--      </div>-->

      <div class="mb-4">
        <span class="text-gray-400 text-xs font-medium uppercase tracking-wider">Управление</span>
      </div>

      <nav class="space-y-1 flex-1">
        <Link
            href="/admin"
            class="flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60"
            :class="{ 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400': isActive('/admin') }"
        >
          <Squares2X2Icon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Статистика</span>
        </Link>

        <Link
            href="/admin/users"
            class="flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60"
            :class="{ 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400': isActive('/admin/users') }"
        >
          <UserGroupIcon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Пользователи</span>
        </Link>

        <Link
            href="/admin/promocodes"
            class="flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60"
            :class="{ 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400': isActive('/admin/promocodes') }"
        >
          <GiftIcon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Промокоды</span>
        </Link>
        <Link
            href="/logs"
            class="flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60"
            :class="{ 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400': isActive('/logs') }"
        >
          <GiftIcon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span>История</span>
        </Link>
        <Link
            href="/admin/payment_bonuses"
            class="flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60"
            :class="{ 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400': isActive('/admin/payment_bonuses') }"
        >
          <SparklesIcon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Бонусы</span>
        </Link>

        <div class="py-2">
          <div class="h-px w-full bg-gray-700/50"></div>
        </div>

        <div>
          <div
              @click="toggleShopDropdown"
              class="flex items-center justify-between text-gray-300 hover:text-white p-3 rounded-md cursor-pointer ease-in-out hover:bg-gray-700/60"
              :class="{ 'bg-blue-600/10 text-blue-300': isShopDropdownOpen }"
          >
            <div class="flex items-center">
              <CubeIcon class="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Магазин</span>
            </div>
            <ChevronDownIcon
                :class="{ 'rotate-180': isShopDropdownOpen }"
                class="w-5 h-5 transition-transform duration-300"
            />
          </div>

          <div
              v-show="isShopDropdownOpen"
              class="overflow-hidden transition-all duration-300 mt-1"
          >
            <div class="pl-4 space-y-1 border-l border-gray-700 ml-3">
              <Link
                  href="/admin/shop"
                  class="flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none"
                  :class="{ 'text-blue-400': isActive('/admin/shop') }"
              >
                <TagIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Предметы</span>
              </Link>

              <Link
                  href="/admin/shop/categories"
                  class="flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none"
                  :class="{ 'text-blue-400': isActive('/admin/shop/categories') }"
              >
                <FolderIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Категории</span>
              </Link>

              <Link
                  href="/admin/servers"
                  class="flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none"
                  :class="{ 'text-blue-400': isActive('/admin/servers') }"
              >
                <ServerIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Сервера</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div class="mt-6 p-3 bg-gray-800/60 rounded-lg">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
          <div class="ml-3">
            <p class="text-white text-sm font-medium">Администратор</p>
            <p class="text-gray-400 text-xs">Онлайн</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
<!--      <div class="p-6 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between">-->
<!--        <h1 class="text-xl font-bold text-white">Панель администратора</h1>-->

<!--      </div>-->

      <div class="p-6 overflow-auto max-h-[calc(107vh-64px)]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import {
  Squares2X2Icon,
  CubeIcon,
  UserGroupIcon,
  TagIcon,
  FolderIcon,
  ServerIcon,
  SparklesIcon,
  GiftIcon,
  ChevronDownIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/vue/24/outline";

const isActive = (route) => window.location.pathname === route;

const isShopDropdownOpen = ref(false);

const toggleShopDropdown = () => {
  isShopDropdownOpen.value = !isShopDropdownOpen.value;
};
</script>

<!--<style>-->
<!--.rotate-180 {-->
<!--  transform: rotate(180deg);-->
<!--}-->

<!--a:hover, button:hover {-->
<!--  transform: translateY(-1px);-->
<!--}-->

<!--a:active, button:active {-->
<!--  transform: translateY(0);-->
<!--}-->
<!--body{-->
<!--  overflow: hidden;-->
<!--}-->
<!--</style>-->