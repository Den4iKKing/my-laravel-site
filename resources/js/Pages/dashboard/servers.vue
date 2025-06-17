<template>
    <div>
        <h1 class="text-2xl font-semibold text-white mb-4">Сервера</h1>

        <div class="mb-4 flex justify-between items-center">
            <div class="relative w-1/3">
                <input
                    v-model="search"
                    @input="onSearch"
                    type="text"
                    placeholder="Поиск по названию или IP..."
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
                    <th class="px-4 py-2 text-left">Имя</th>
                    <th class="px-4 py-2 text-left">IP</th>
                    <th class="px-4 py-2 text-left">Game Port</th>
                    <th class="px-4 py-2 text-left">Query Port</th>
                    <th class="px-4 py-2 text-left">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="server in servers.data" :key="server.id"
                    class="border-t border-gray-700 hover:bg-gray-700 transition">
                    <td class="px-4 py-2">{{ server.id }}</td>
                    <td class="px-4 py-2">{{ server.name }}</td>
                    <td class="px-4 py-2">{{ server.ip }}</td>
                    <td class="px-4 py-2">{{ server.game_port }}</td>
                    <td class="px-4 py-2">{{ server.query_port }}</td>
                    <td class="px-4 py-2 flex space-x-2">
                        <button @click="openEditModal(server)" class="text-blue-400 hover:text-blue-300">
                            Редактировать
                        </button>
                        <button @click="openDeleteModal(server)" class="text-red-400 hover:text-red-300">
                            Удалить
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4 flex justify-center items-center space-x-2">
            <Link
                v-for="link in servers.links"
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
            :title="editServer.id ? 'Редактирование сервера' : 'Создание сервера'"
            confirmText="Сохранить"
            @close="closeModal"
            @confirm="saveChanges"
        >
            <label for="name" class="block mb-2 text-white">Имя</label>
            <input
                v-model="editServer.name"
                type="text"
                id="name"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />

            <label for="ip" class="block mb-2 text-white">IP</label>
            <input
                v-model="editServer.ip"
                type="text"
                id="ip"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />

            <label for="game_port" class="block mb-2 text-white">Game Port</label>
            <input
                v-model="editServer.game_port"
                type="number"
                id="game_port"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />

            <label for="query_port" class="block mb-2 text-white">Query Port</label>
            <input
                v-model="editServer.query_port"
                type="number"
                id="query_port"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />
            <label for="zid" class="block mb-2 text-white">ZID</label>
            <input
                v-model="editServer.zid"
                type="number"
                id="zid"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            />
            <label for="visible" class="block mb-2 text-white">Видимость</label>
            <select
                v-model="editServer.visible"
                id="visible"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            >
                <option :value="true">Видимый</option>
                <option :value="false">Скрытый</option>
            </select>
        </ReusableModal>

        <ReusableModal
            :isOpen="showDeleteModal"
            title="Удаление сервера"
            confirmText="Удалить"
            @close="closeModal"
            @confirm="deleteServer"
        >
            <div class="text-white">
                Вы уверены, что хотите удалить сервер <b>{{ editServer.name }}</b>?
            </div>
        </ReusableModal>
    </div>
</template>

<script>
import Dashboard from "@/Layouts/Dashboard.vue";
import {ref} from "vue";
import {Link, router} from "@inertiajs/vue3";
import ReusableModal from "@/Components/Dashboard/MainModal.vue";

export default {
    layout: Dashboard,
};
</script>
<script setup>
const props = defineProps({
    servers: Object,
    filters: Object,
});

const search = ref(props.filters.search || "");
const editServer = ref({name: "", ip: "", zid: "", game_port: "", query_port: "", visible: true});
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const onSearch = () => {
    router.get(route("servers.index"), {search: search.value}, {preserveState: true, replace: true});
};

const openCreateModal = () => {
    editServer.value = {name: "", ip: "", zid: "", game_port: "", query_port: "", visible: true};
    showEditModal.value = true;
};

const openEditModal = (server) => {
    editServer.value = {...server};
    showEditModal.value = true;
};

const openDeleteModal = (server) => {
    editServer.value = {...server};
    showDeleteModal.value = true;
};

const closeModal = () => {
    showEditModal.value = false;
    showDeleteModal.value = false;
};
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const saveChanges = () => {
  if (editServer.value.id) {
    router.put(
        route("servers.update", editServer.value.id),
        editServer.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  } else {
    router.post(
        route("servers.store"),
        editServer.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal,
        }
    );
  }
};

const deleteServer = () => {
  router.delete(
      route("servers.destroy", editServer.value.id),
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
        onSuccess: closeModal,
      }
  );
};

</script>
