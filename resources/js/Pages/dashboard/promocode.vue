<template>
  <div>
    <h1 class="text-2xl font-semibold text-white mb-4">Промокоды</h1>

    <div class="mb-4 flex justify-between items-center">
      <div class="relative w-1/3">
        <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Поиск по коду..."
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
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Код</th>
          <th class="px-4 py-2 text-left">Тип</th>
          <th class="px-4 py-2 text-left">Значение</th>
          <th class="px-4 py-2 text-left">Макс. использований</th>
          <th class="px-4 py-2 text-left">Использовано</th>
          <th class="px-4 py-2 text-left">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="promo in promocodes.data" :key="promo.id"
            class="border-t border-gray-700 hover:bg-gray-700 transition">
          <td class="px-4 py-2">{{ promo.id }}</td>
          <td class="px-4 py-2">{{ promo.code }}</td>
          <td class="px-4 py-2">{{ promo.type }}</td>
          <td class="px-4 py-2">{{ promo.value }}</td>
          <td class="px-4 py-2">{{ promo.max_uses }}</td>
          <td class="px-4 py-2">{{ promo.used }}</td>
          <td class="px-4 py-2 flex space-x-2">
            <button @click="openEditModal(promo)" class="text-blue-400 hover:text-blue-300">
              Редактировать
            </button>
            <button @click="openDeleteModal(promo)" class="text-red-400 hover:text-red-300">
              Удалить
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-center items-center space-x-2">
      <Link
          v-for="link in promocodes.links"
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
        :isOpen="showEditModal"
        :title="editPromo.id ? 'Редактирование промокода' : 'Создание промокода'"
        confirmText="Сохранить"
        @close="closeModal"
        @confirm="saveChanges"
    >
      <label for="code" class="block mb-2 text-white">Код</label>
      <input
          v-model="editPromo.code"
          type="text"
          id="code"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />

      <label for="type" class="block mb-2 text-white">Тип</label>
      <select
          v-model="editPromo.type"
          id="type"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      >
        <option value="bonus_balance">Бонусный баланс</option>
        <option value="deposit_bonus">Бонус на депозит</option>
      </select>

      <label for="value" class="block mb-2 text-white">Значение</label>
      <input
          v-model="editPromo.value"
          type="number"
          step="0.01"
          id="value"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />

      <label for="max_uses" class="block mb-2 text-white">Максимум использований</label>
      <input
          v-model="editPromo.max_uses"
          type="number"
          id="max_uses"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />

      <label for="used" class="block mb-2 text-white">Использовано</label>
      <input
          v-model="editPromo.used"
          type="number"
          id="used"
          class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
      />
    </ReusableModal>

    <ReusableModal
        :isOpen="showDeleteModal"
        title="Удаление промокода"
        confirmText="Удалить"
        @close="closeModal"
        @confirm="deletePromo"
    >
      <div class="text-white">
        Вы уверены, что хотите удалить промокод <b>{{ editPromo.code }}</b>?
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
  promocodes: Object,
  filters: Object,
});

const search = ref(props.filters.search || "");
const editPromo = ref({
  code: "",
  type: "bonus_balance",
  value: "",
  max_uses: "",
  used: "0"
});
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const onSearch = () => {
  router.get(
      route("promocodes.index"),
      { search: search.value },
      { preserveState: true, replace: true }
  );
};

const openCreateModal = () => {
  editPromo.value = {
    code: "",
    type: "bonus_balance",
    value: "",
    max_uses: "",
    used: "0"
  };
  showEditModal.value = true;
};

const openEditModal = (promo) => {
  editPromo.value = { ...promo };
  showEditModal.value = true;
};

const openDeleteModal = (promo) => {
  editPromo.value = { ...promo };
  showDeleteModal.value = true;
};

const closeModal = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
};

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const saveChanges = () => {
  if (editPromo.value.id) {
    router.put(
        route("promocodes.update", editPromo.value.id),
        editPromo.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  } else {
    router.post(
        route("promocodes.store"),
        editPromo.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  }
};

const deletePromo = () => {
  router.delete(
      route("promocodes.destroy", editPromo.value.id),
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};
</script>
