<template>
  <div>
    <h1 class="text-2xl font-semibold text-white mb-4">Логи операций</h1>

    <div class="mb-4 flex justify-between items-center space-x-4">
      <div class="relative w-1/3">
        <input
            v-model="filters.steamid"
            @input="applyFilters"
            type="text"
            placeholder="Поиск по SteamID / Name..."
            class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <select
          v-model="filters.type"
          @change="applyFilters"
          class="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="">Все типы логов</option>
        <option value="buy_log">Покупки</option>
        <option value="buy_log_new">Корзина</option>
        <option value="payment_statistic">Пополнения</option>
        <option value="other_log">Плагин</option>
        <option value="promo_log">Промокоды</option>

      </select>


      <select
          v-model="filters.sort_direction"
          @change="applyFilters"
          class="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="desc">По убыванию</option>
        <option value="asc">По возрастанию</option>
      </select>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-4">
      <div v-for="(stats, type) in logStatistics" :key="type"
           class="bg-gray-800 p-4 rounded-md text-white">
        <h3 class="text-lg font-semibold mb-2">{{ getLogTypeName(type) }}</h3>
        <p>Записей: {{ stats.total_count }}</p>
        <p>Сумма: {{ formatPrice(stats.total_amount) }}</p>
      </div>
    </div>

    <div class="bg-gray-800 p-4 rounded-md">
      <table class="w-full table-auto text-white">
        <thead>
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Тип операции</th>
          <th class="px-4 py-2 text-left">Игровой ник</th>

          <th class="px-4 py-2 text-left">SteamID</th>
          <th class="px-4 py-2 text-left">Название</th>
          <th class="px-4 py-2 text-left">Сумма</th>
<!--          <th class="px-4 py-2 text-left">Баланс</th>-->
          <th class="px-4 py-2 text-left">Дата создания</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="log in logs.data" :key="log.id"
            class="border-t border-gray-700 hover:bg-gray-700 transition">
          <td class="px-4 py-2">{{ log.id }}</td>
          <td class="px-4 py-2">{{ getLogTypeName(log.log_type) }}</td>
          <td class="px-4 py-2">{{ log.name }}</td>

          <td class="px-4 py-2">{{ log.steamid }}</td>
          <td class="px-4 py-2">
            <template v-if="log.log_type !== 'other_log'">
              {{ log.item_name }}
            </template>
            <template v-if="log.log_type === 'other_log' && log.message">
              {{ log.message }}
            </template>
          </td>
          <td class="px-4 py-2">{{ formatPrice(log.price) }}</td>
<!--          <td class="px-4 py-2">{{ balance }} ₽</td>-->
          <td class="px-4 py-2">{{ formatDate(log.created_at) }}</td>
        </tr>
        </tbody>
      </table>

    </div>

    <div class="mt-4 flex justify-center items-center space-x-2">
      <a
          v-for="link in processedPaginationLinks"
          :key="link.label"
          :href="link.url"
          v-html="link.label"
          :class="[
            'px-4 py-2 rounded-md',
            link.active ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500',
            !link.url && 'cursor-not-allowed opacity-50'
          ]"
          class="transition-all duration-200"
      />
    </div>
  </div>
</template>
<script>
import Dashboard from "@/Layouts/Dashboard.vue";

export default {
  layout: Dashboard,
};
</script>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import Dashboard from "@/Layouts/Dashboard.vue";

const props = defineProps({
  logs: Object,
  logStatistics: Object,
  filters: Object
});

const filters = ref({
  steamid: props.filters.steamid || '',
  type: props.filters.type || '',
  sort_by: props.filters.sort_by || 'created_at',
  sort_direction: props.filters.sort_direction || 'desc'
});
let timeout = null;

const applyFilters = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    router.get(route('logs.index'), filters.value, {
      preserveState: false,
      replace: true
    });
  }, 500);
};

const formatPrice = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(value || 0);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getLogTypeName = (type) => {
  const typeNames = {
    'buy_log': 'Покупки',
    'buy_log_new': 'Корзина',
    'payment_statistic': 'Пополнения',
    'other_log': 'Плагин',
    'promo_log': 'Промокод'

  };
  return typeNames[type] || type;
};


const processedPaginationLinks = computed(() => {
  if (!props.logs.links) return [];

  return props.logs.links.map(link => {
    if (!link.url) return link;

    const url = new URL(link.url);

    if (filters.value.steamid) {
      url.searchParams.set('steamid', filters.value.steamid);
    }

    if (filters.value.type) {
      url.searchParams.set('type', filters.value.type);
    }

    if (filters.value.sort_by) {
      url.searchParams.set('sort_by', filters.value.sort_by);
    }

    if (filters.value.sort_direction) {
      url.searchParams.set('sort_direction', filters.value.sort_direction);
    }

    return {
      ...link,
      url: url.toString()
    };
  });
});
</script>