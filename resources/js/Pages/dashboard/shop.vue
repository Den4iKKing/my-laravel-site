<template>
  <div class="bg-gray-900 p-6 rounded-lg">
    <h1 class="text-3xl font-bold text-white mb-6 flex items-center">
      <span class="mr-2">Магазин</span>
      <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">{{ shopItems.total }} товаров</span>
    </h1>

    <div class="mb-6 flex justify-between items-center gap-4">
      <div class="relative w-1/3">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Поиск по названию..."
            class="w-full bg-gray-800 text-white pl-10 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder-gray-500"
        />
      </div>

      <div class="flex items-center gap-3">
        <button
            v-if="selectedItems.length > 0"
            @click="openCopyModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          Копировать ({{ selectedItems.length }})
        </button>

        <button
            @click="openCreateModal"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Создать
        </button>
      </div>
    </div>

    <div class="mb-6 flex justify-between items-center">
      <div class="flex gap-3">
        <div class="relative">
          <select
              v-model="selectedCategory"
              @change="onFilterChange"
              class="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="">Все категории</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <div class="relative">
          <select
              v-model="selectedServer"
              @change="onFilterChange"
              class="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="">Все серверы</option>
            <option v-for="server in servers" :key="server.id" :value="server.id">
              {{ server.ip }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <div v-if="selectedItems.length > 0" class="flex items-center gap-2">
        <button
            @click="clearSelection"
            class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm"
        >
          Очистить выбор
        </button>
      </div>
    </div>

    <div class="bg-gray-800 p-5 rounded-lg shadow-lg">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <div
            v-for="item in shopItems.data"
            :key="item.id"
            :class="[
                        'relative bg-gray-700 rounded-lg overflow-hidden transition-all duration-200',
                        'hover:shadow-lg hover:transform hover:scale-[1.02]',
                        isItemSelected(item.id) ? 'ring-2 ring-blue-500' : ''
                    ]"
        >
          <div class="absolute top-2 right-2 z-10">
            <input
                type="checkbox"
                :id="`select-item-${item.id}`"
                :checked="isItemSelected(item.id)"
                @change="toggleItemSelection(item.id)"
                class="w-4 h-4 accent-blue-500"
            />
          </div>

          <div class="cursor-pointer" @click="openEditModal(item)">
            <div class="h-40 overflow-hidden">
              <img
                  :src="item.image"
                  alt="item"
                  class="w-full h-full object-cover transition-transform hover:scale-110"
              />
            </div>
            <div class="p-4">
              <h3 class="text-sm font-semibold text-white truncate">{{ item.name }}</h3>
              <div class="flex justify-between items-center mt-2">
                <p class="text-sm font-bold text-green-400">{{ item.price }} ₽</p>
                <span class="text-xs bg-gray-600 px-2 py-1 rounded-full text-gray-300">
                                    {{ getCategoryName(item.category_id) }}
                                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="shopItems.data.length === 0" class="text-center p-8 text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4M8 16l-4-4 4-4M16 16l4-4-4-4"></path>
        </svg>
        <p class="text-xl">Товары не найдены</p>
        <p class="mt-2">Попробуйте изменить параметры поиска или создайте новый товар</p>
      </div>
    </div>

    <div class="mt-6 flex justify-center items-center">
      <div class="inline-flex rounded-md shadow-sm">
        <Link
            v-for="link in shopItems.links"
            :key="link.label"
            v-html="link.label"
            :href="link.url"
            :class="[
                        'px-4 py-2 border border-gray-700',
                        link.active ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
                        !link.url && 'cursor-not-allowed opacity-50',
                        'transition-all duration-200'
                    ]"
        />
      </div>
    </div>

    <ShopItemModal
        :key="modalKey"
        :isOpen="isModalOpen"
        :title="modalTitle"
        :confirmText="modalConfirmText"
        :selectedItem="selectedItem"
        :categories="categories"
        :servers="servers"
        :isDeleteAction="isDeleteAction"
        @close="closeModal"
        @confirm="handleConfirm"
        @delete="openDeleteConfirmation"
    />

    <div
        v-if="isCopyModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold text-white mb-4">Копирование товаров</h2>
        <p class="text-gray-300 mb-4">
          Выбрано {{ selectedItems.length }} товаров для копирования.
          Выберите сервер назначения:
        </p>

        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Сервер назначения</label>
          <div class="relative">
            <select
                v-model="targetServerId"
                class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="" disabled>Выберите сервер</option>
              <option v-for="server in servers" :key="server.id" :value="server.id">
                {{ server.ip }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
              @click="closeCopyModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Отмена
          </button>
          <button
              @click="confirmCopy"
              :disabled="!targetServerId"
              :class="[
                            'px-4 py-2 text-white rounded-lg transition',
                            targetServerId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-500 cursor-not-allowed'
                        ]"
          >
            Скопировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dashboard from "@/Layouts/Dashboard.vue";

export default {
  layout: Dashboard,
}
</script>

<script setup>
import { ref, computed } from "vue";
import { Link, router } from "@inertiajs/vue3";
import ShopItemModal from "@/Components/Dashboard/shop/ModalShop.vue";

// Пропсы
const props = defineProps({
  shopItems: Object,
  categories: Array,
  servers: Object,
  filters: Object,
});

// Состояние
const search = ref(props.filters?.search || "");
const selectedCategory = ref(props.filters?.category || "");
const selectedServer = ref(props.filters?.server || "");
const isModalOpen = ref(false);
const isCopyModalOpen = ref(false);
const isDeleteAction = ref(false);
const modalTitle = ref("");
const modalConfirmText = ref("");
const selectedItem = ref(null);
const selectedItems = ref([]);
const targetServerId = ref("");

const getCategoryName = (categoryId) => {
  const category = props.categories.find(c => c.id === categoryId);
  return category ? category.name : "Без категории";
};

const isItemSelected = (itemId) => {
  return selectedItems.value.includes(itemId);
};

const toggleItemSelection = (itemId) => {
  if (isItemSelected(itemId)) {
    selectedItems.value = selectedItems.value.filter(id => id !== itemId);
  } else {
    selectedItems.value.push(itemId);
  }
};

const clearSelection = () => {
  selectedItems.value = [];
};

const onSearch = () => {
  router.get(
      route("shop.index"),
      {
        search: search.value,
        category: selectedCategory.value,
        server: selectedServer.value
      },
      {
        preserveState: true,
        replace: true
      }
  );
};

const onFilterChange = () => {
  router.get(
      route("shop.index"),
      {
        search: search.value,
        category: selectedCategory.value,
        server: selectedServer.value
      },
      {
        preserveState: true,
        replace: true
      }
  );
};

const openEditModal = (item) => {
  selectedItem.value = item;
  isDeleteAction.value = false;
  modalTitle.value = "Редактирование товара";
  modalConfirmText.value = "Сохранить";
  isModalOpen.value = true;
};

const modalKey = ref(0);

const openCreateModal = () => {
  selectedItem.value = null;
  isDeleteAction.value = false;
  modalTitle.value = "Создание товара";
  modalConfirmText.value = "Создать";
  modalKey.value++;
  isModalOpen.value = true;
};
const openDeleteConfirmation = () => {
  isDeleteAction.value = true;
  modalTitle.value = "Удаление товара";
  modalConfirmText.value = "Удалить";
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
  isDeleteAction.value = false;
};

const openCopyModal = () => {
  targetServerId.value = "";
  isCopyModalOpen.value = true;
};

const closeCopyModal = () => {
  isCopyModalOpen.value = false;
  targetServerId.value = "";
};

const confirmCopy = () => {
  if (!targetServerId.value) return;

  router.post(route("shop.copy"), {
    item_ids: selectedItems.value,
    target_server_id: targetServerId.value
  }, {
    headers: {"X-CSRF-TOKEN": csrfToken},
    onSuccess: () => {
      closeCopyModal();
      clearSelection();
    }
  });
};

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const handleConfirm = (formData) => {
  if (isDeleteAction.value) {
    router.delete(route("shop.destroy", selectedItem.value.id), {
      headers: {"X-CSRF-TOKEN": csrfToken},
      onSuccess: () => closeModal(),
    });
  } else {
    if (selectedItem.value) {
      router.put(route("shop.update", selectedItem.value.id), formData, {
        headers: {"X-CSRF-TOKEN": csrfToken},
        onSuccess: () => {
          closeModal();
          selectedItem.value = null;
        },
      });
    } else {
      router.post(route("shop.create"), formData, {
        headers: {"X-CSRF-TOKEN": csrfToken},
        onSuccess: () => {
          closeModal();
          selectedItem.value = null;
        },
      });
    }
  }
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
