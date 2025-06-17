<template>
  <div>
    <h1 class="text-2xl font-semibold text-white mb-4">Пользователи</h1>

    <div class="mb-4 flex justify-between items-center">
      <div class="relative w-1/3">
        <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Поиск по Name..."
            class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <MagnifyingGlassIcon class="absolute right-2 top-2 w-5 h-5 text-gray-400" />
      </div>
    </div>

    <div class="bg-gray-800 p-4 rounded-md">
      <table class="w-full table-auto text-white">
        <thead>
        <tr>
          <th class="px-4 py-2 text-left">Игрок</th>
          <th class="px-4 py-2 text-left">SteamID</th>
          <th class="px-4 py-2 text-left">Баланс</th>
          <th class="px-4 py-2 text-left">Группа</th>
          <th class="px-4 py-2 text-left">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="user in users.data"
            :key="user.id"
            class="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"
        >
          <td class="px-4 py-2 flex items-center">
            <img
                :src="user.avatar"
                alt="avatar"
                class="w-8 h-8 rounded-full mr-3"
            />
            <span>{{ user.name }}</span>
          </td>
          <td class="px-4 py-2">{{ user.steamid }}</td>
          <td class="px-4 py-2">{{ user.balance }} ₽</td>
          <td class="px-4 py-2">
            <span
                :class="roleBadgeClass(user.group)"
                class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            >
                {{ user.group }}
            </span>
          </td>
          <td class="px-4 py-2 flex space-x-2">
            <button @click="openEditModal(user)" class="text-blue-400 hover:text-blue-300">Редактировать</button>
            <button @click="openPurchaseHistoryModal(user)" class="text-yellow-400 hover:text-yellow-300">История</button>
            <button @click="openUserCartModal(user)" class="text-green-400 hover:text-green-300">Корзина</button>
            <button @click="openDeleteModal(user)" class="text-red-400 hover:text-red-300">Удалить</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-center items-center space-x-2">
      <Link
          v-for="link in users.links"
          :key="link.label"
          :href="link.url"
          v-html="link.label"
          :class="[ 'px-4 py-2 rounded-md',
                    link.active ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500',
                    !link.url && 'cursor-not-allowed opacity-50'
                ]"
          class="transition-all duration-200"
      />
    </div>

    <ReusableModal
        :isOpen="showEditModal"
        title="Редактирование пользователя"
        confirmText="Сохранить"
        @close="closeModal"
        @confirm="saveChanges"
    >
      <div class="space-y-4">
        <div>
          <label class="text-white block mb-2">Баланс:</label>
          <input
              v-model="editUser.balance"
              type="number"
              class="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label class="text-white block mb-2">Бонусный баланс:</label>
          <input
              v-model="editUser.bonus_balance"
              type="number"
              class="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label class="text-white block mb-2">Группа:</label>
          <select
              v-model="editUser.group"
              class="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="user">Пользователь</option>
            <option value="Admin">Администратор</option>
          </select>
        </div>
      </div>
    </ReusableModal>

    <!-- Модальное окно истории покупок -->
    <ReusableModal
        :isOpen="showPurchaseHistoryModal"
        title="История покупок"
        confirmText="Закрыть"
        @close="closeModal"
        @confirm="closeModal"
    >
      <div v-if="purchaseHistory.length" class="space-y-4">
        <div class="max-h-96 overflow-y-auto">
          <table class="w-full table-auto text-white">
            <thead class="sticky top-0 bg-gray-800">
            <tr>
              <th class="px-4 py-2 text-left">Предмет</th>
<!--              <th class="px-4 py-2 text-left">Сервер</th>-->
              <th class="px-4 py-2 text-left">Цена</th>
              <th class="px-4 py-2 text-left">Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="purchase in purchaseHistory"
                :key="purchase.id"
                class="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"
            >
              <td class="px-4 py-2">{{ purchase.item_name }}</td>
              <td class="px-4 py-2">{{ purchase.price }} ₽</td>
              <td class="px-4 py-2">{{ formatDate(purchase.created_at) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-if="isLoadingHistory" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      </div>
      <div v-else-if="isLoadingHistory" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
      <div v-else class="text-white text-center py-4">
        У пользователя нет истории покупок
      </div>
    </ReusableModal>

    <!-- Модальное окно корзины пользователя -->
    <ReusableModal
        :isOpen="showCartModal"
        title="Корзина пользователя"
        confirmText="Закрыть"
        @close="closeModal"
        @confirm="closeModal"
    >
      <div v-if="userCart && userCart.items && userCart.items.length" class="space-y-4">


        <div class="max-h-96 overflow-y-auto">
          <div
              v-for="item in userCart.items"
              :key="item.shop_cart_id"
              class="bg-gray-700 p-3 rounded-md mb-3 flex justify-between items-center"
          >
            <div class="flex items-center">
              <img
                  v-if="item.image"
                  :src="item.image"
                  alt="item"
                  class="w-10 h-10 object-cover rounded mr-3"
              />
              <div>
                <p class="text-white font-medium">{{ item.name }}</p>
              </div>
            </div>
            <button
                @click="removeFromCart(item.shop_cart_id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200"
            >
              Удалить
            </button>
          </div>
        </div>
        <div v-if="isLoadingCart" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      </div>
      <div v-else-if="isLoadingCart" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
      <div v-else class="text-white text-center py-4">
        Корзина пользователя пуста
      </div>
    </ReusableModal>

    <!-- Модальное окно удаления пользователя -->
    <ReusableModal
        :isOpen="showDeleteModal"
        title="Удаление пользователя"
        confirmText="Удалить"
        @close="closeModal"
        @confirm="deleteUser"
    >
      <p class="text-white">Вы уверены, что хотите удалить пользователя "{{ editUser.name }}"?</p>
    </ReusableModal>
  </div>
</template>

<script>
import Dashboard from "@/Layouts/Dashboard.vue";

export default {
  layout: Dashboard,
}
</script>

<script setup>
import { ref, onMounted } from "vue";
import { Link, router } from "@inertiajs/vue3";
import ReusableModal from "@/Components/Dashboard/MainModal.vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import axios from "axios";

const props = defineProps({
  users: Object,
  filters: Object,
});

const search = ref(props.filters.search || "");
const editUser = ref({});
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showPurchaseHistoryModal = ref(false);
const showCartModal = ref(false);
const purchaseHistory = ref([]);
const userCart = ref(null);
const isLoadingHistory = ref(false);
const isLoadingCart = ref(false);
const cartServers = ref([]);
const selectedServer = ref(null);

const onSearch = () => {
  router.get(route("users.dashboard"), { search: search.value }, { preserveState: true, replace: true });
};

const openEditModal = (user) => {
  editUser.value = { ...user };
  showEditModal.value = true;
};

const openDeleteModal = (user) => {
  editUser.value = { ...user };
  showDeleteModal.value = true;
};

const openPurchaseHistoryModal = async (user) => {
  editUser.value = { ...user };
  showPurchaseHistoryModal.value = true;
  await loadPurchaseHistory(user.id);
};

const openUserCartModal = async (user) => {
  editUser.value = { ...user };
  showCartModal.value = true;
  await loadUserServers();
  if (cartServers.value.length > 0) {
    selectedServer.value = cartServers.value[0].id;
    await loadUserCart();
  }
};

const loadPurchaseHistory = async (userId) => {
  isLoadingHistory.value = true;
  try {
    const response = await axios.get(route('users.purchases', userId));
    purchaseHistory.value = response.data.purchases;
  } catch (error) {
    console.error('Ошибка при загрузке истории покупок:', error);
  } finally {
    isLoadingHistory.value = false;
  }
};

const loadUserServers = async () => {
  try {
    const response = await axios.get(route('servers.list'));
    cartServers.value = response.data.servers;
  } catch (error) {
    console.error('Ошибка при загрузке серверов:', error);
  }
};

const loadUserCart = async () => {
  if (!selectedServer.value) return;

  isLoadingCart.value = true;
  try {
    const response = await axios.get(route('users.cart', {
      user: editUser.value.id,
      server: 1
    }));
    userCart.value = response.data.cart;
  } catch (error) {
    console.error('Ошибка при загрузке корзины:', error);
    userCart.value = { items: [] };
  } finally {
    isLoadingCart.value = false;
  }
};

const removeFromCart = async (cartItemId) => {
  if (!confirm('Вы уверены, что хотите удалить этот предмет из корзины?')) return;

  try {
    await axios.delete(route('users.cart.remove', {
      user: editUser.value.id,
      server: 1,
      item: cartItemId
    }));

    // Обновляем корзину после удаления
    await loadUserCart();
  } catch (error) {
    console.error('Ошибка при удалении предмета из корзины:', error);
  }
};

const closeModal = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
  showPurchaseHistoryModal.value = false;
  showCartModal.value = false;
  purchaseHistory.value = [];
  userCart.value = null;
};

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const saveChanges = () => {
  router.put(
      route("users.update", editUser.value.id),
      editUser.value,
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};

const deleteUser = () => {
  router.delete(
      route("users.destroy", editUser.value.id),
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};

const roleBadgeClass = (role) => {
  switch (role) {
    case "Admin": return "bg-red-500 text-white";
    default: return "bg-green-500 text-white";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
