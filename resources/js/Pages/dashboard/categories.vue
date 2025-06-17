<template>
    <div>
        <!-- Заголовок -->
        <h1 class="text-2xl font-semibold text-white mb-4">Категории</h1>

        <!-- Поиск и кнопка "Создать" -->
        <div class="mb-4 flex justify-between items-center">
            <div class="relative w-1/3">
                <input
                    v-model="search"
                    @input="onSearch"
                    type="text"
                    placeholder="Поиск по названию..."
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
                    <th class="px-4 py-2 text-left">Название</th>
                    <th class="px-4 py-2 text-left">Видимость</th>
                    <th class="px-4 py-2 text-left">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="category in categories.data" :key="category.id"
                    class="border-t border-gray-700 hover:bg-gray-700 transition">
                    <td class="px-4 py-2">{{ category.id }}</td>
                    <td class="px-4 py-2">{{ category.name }}</td>
                    <td class="px-4 py-2">{{ category.visible ? 'Видимая' : 'Скрытая' }}</td>
                    <td class="px-4 py-2 flex space-x-2">
                        <button @click="openEditModal(category)" class="text-blue-400 hover:text-blue-300">
                            Редактировать
                        </button>
                        <button @click="openDeleteModal(category)" class="text-red-400 hover:text-red-300">
                            Удалить
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-4 flex justify-center items-center space-x-2">
            <Link
                v-for="link in categories.links"
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
            :title="editCategory.id ? 'Редактирование категории' : 'Создание категории'"
            confirmText="Сохранить"
            @close="closeModal"
            @confirm="saveChanges"
        >
            <label for="name" class="block mb-2 text-white">Название</label>
            <input
                v-model="editCategory.name"
                type="text"
                id="name"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />
            <label for="zid" class="block mb-2 text-white">ZID</label>
            <input
                v-model="editCategory.zid"
                type="text"
                id="zid"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />

            <label for="Icon" class="block mb-2 text-white">Icon</label>
            <input
                v-model="editCategory.icon"
                type="text"
                id="icon"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />
            <label for="visible" class="block mb-2 text-white">Видимость</label>
            <select
                v-model="editCategory.visible"
                id="visible"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            >
                <option :value="true">Видимая</option>
                <option :value="false">Скрытая</option>
            </select>
        </ReusableModal>

        <ReusableModal
            :isOpen="showDeleteModal"
            title="Удаление категории"
            confirmText="Удалить"
            @close="closeModal"
            @confirm="deleteCategory"
        >
            <div class="text-white">
                Вы уверены, что хотите удалить категорию <b>{{ editCategory.name }}</b>?
            </div>
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
import {ref} from "vue";
import {Link, router} from "@inertiajs/vue3";
import ReusableModal from "@/Components/Dashboard/MainModal.vue";

const props = defineProps({
    categories: Object,
    filters: Object,
});

const search = ref(props.filters.search || "");
const editCategory = ref({zid: "", name: "", visible: true, 'icon': ""});
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const onSearch = () => {
    router.get(route("categories.index"), {search: search.value}, {preserveState: true, replace: true});
};

const openCreateModal = () => {
    editCategory.value = {zid: "", name: "", visible: true};
    showEditModal.value = true;
};

const openEditModal = (category) => {
    editCategory.value = {...category};
    showEditModal.value = true;
};

const openDeleteModal = (category) => {
    editCategory.value = {...category};
    showDeleteModal.value = true;
};

const closeModal = () => {
    showEditModal.value = false;
    showDeleteModal.value = false;
};

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const saveChanges = () => {
  if (editCategory.value.id) {
    router.put(
        route("categories.update", editCategory.value.id),
        editCategory.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  } else {
    router.post(
        route("categories.store"),
        editCategory.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  }
};

const deleteCategory = () => {
  router.delete(
      route("categories.destroy", editCategory.value.id),
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};

</script>
