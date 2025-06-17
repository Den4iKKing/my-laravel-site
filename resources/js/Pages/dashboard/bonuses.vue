<template>
  <div>
    <h1 class="text-2xl font-semibold text-white mb-4">Настройки бонусов</h1>

    <div class="mb-4 flex justify-between items-center">
      <div class="relative w-1/3">
        <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Поиск по минимальной сумме..."
            class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <button
          @click="openCreateModal"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
      >
        Создать
      </button>
    </div>

    <div class="bg-gray-800 p-4 rounded-md">
      <table class="w-full table-auto text-white">
        <thead>
        <tr>
          <th class="px-4 py-2 text-left">Мин. сумма</th>
          <th class="px-4 py-2 text-left">Процент бонуса</th>
          <th class="px-4 py-2 text-left">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bonus in bonuses.data" :key="bonus.id"
            class="border-t border-gray-700 hover:bg-gray-700 transition">
          <td class="px-4 py-2">{{ bonus.min_amount }}</td>
          <td class="px-4 py-2">{{ bonus.bonus_percent }}%</td>
          <td class="px-4 py-2 flex space-x-2">
            <button @click="openEditModal(bonus)" class="text-blue-400 hover:text-blue-300">
              Редактировать
            </button>
            <button @click="openDeleteModal(bonus)" class="text-red-400 hover:text-red-300">
              Удалить
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-center items-center space-x-2">
      <Link
          v-for="link in bonuses.links"
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

    <ReusableModal
        :is-open="showEditModal"
        :title="editBonus.id ? 'Редактирование бонуса' : 'Создание бонуса'"
        confirm-text="Сохранить"
        @close="closeModal"
        @confirm="saveChanges"
    >
      <label for="min_amount" class="block mb-2 text-white">Минимальная сумма</label>
      <input
          v-model="editBonus.min_amount"
          type="number"
          id="min_amount"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />

      <label for="bonus_percent" class="block mb-2 text-white">Процент бонуса</label>
      <input
          v-model="editBonus.bonus_percent"
          type="number"
          id="bonus_percent"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />
    </ReusableModal>

    <ReusableModal
        :is-open="showDeleteModal"
        title="Удаление бонуса"
        confirm-text="Удалить"
        @close="closeModal"
        @confirm="deleteBonus"
    >
      <div class="text-white">
        Вы уверены, что хотите удалить бонус с минимальной суммой <b>{{ editBonus.min_amount }}</b>?
      </div>
    </ReusableModal>
  </div>
</template>

<script>
import Dashboard from "@/Layouts/Dashboard.vue";
import { ref } from "vue";
import { Link, router } from "@inertiajs/vue3";
import ReusableModal from "@/Components/Dashboard/MainModal.vue";

export default {
  layout: Dashboard,
};
</script>

<script setup>
const props = defineProps({
  bonuses: Object,
  filters: Object,
});

const search = ref(props.filters?.search || '');
const editBonus = ref({ min_amount: '', bonus_percent: '' });
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const onSearch = () => {
  router.get('/admin/payment_bonuses', { search: search.value }, { preserveState: true, replace: true });
};

const openCreateModal = () => {
  editBonus.value = { min_amount: '', bonus_percent: '' };
  showEditModal.value = true;
};

const openEditModal = (bonus) => {
  editBonus.value = { ...bonus };
  showEditModal.value = true;
};

const openDeleteModal = (bonus) => {
  editBonus.value = { ...bonus };
  showDeleteModal.value = true;
};

const closeModal = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
};

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const saveChanges = () => {
  if (editBonus.value.id) {
    router.put(
        `/admin/payment_bonuses/${editBonus.value.id}`,
        editBonus.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  } else {
    router.post(
        '/admin/payment_bonuses',
        editBonus.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  }
};

const deleteBonus = () => {
  router.delete(
      `/admin/payment_bonuses/${editBonus.value.id}`,
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};
</script>
