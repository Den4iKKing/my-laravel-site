<template>
  <Modal
      :isOpen="isOpen"
      :title="title"
      :confirmText="confirmText"
      @close="$emit('close')"
      @confirm="validateAndConfirm"
      class="product-modal"
  >
    <div v-if="isDeleteAction" class="text-white">
      Вы уверены, что хотите удалить товар <b>{{ selectedItem?.name }}</b>?
    </div>
    <div v-else class="text-white">
      <div v-if="validationErrors.length > 0" class="bg-red-500 text-white p-3 rounded-md mb-4">
        <p class="font-medium mb-1">Пожалуйста, заполните следующие поля:</p>
        <ul class="list-disc pl-5">
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block mb-2 font-medium">Название <span class="text-red-500">*</span></label>
          <input
              v-model="form.name"
              type="text"
              id="name"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'ring-2 ring-red-500': fieldErrors.name}"
          />
        </div>
        <div>
          <label for="image" class="block mb-2 font-medium">Изображение <span class="text-red-500">*</span></label>
          <input
              v-model="form.image"
              type="text"
              id="image"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'ring-2 ring-red-500': fieldErrors.image}"
          />
        </div>

        <div>
          <label for="price" class="block mb-2 font-medium">Цена <span class="text-red-500">*</span></label>
          <input
              v-model="form.price"
              type="number"
              id="price"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'ring-2 ring-red-500': fieldErrors.price}"
          />
        </div>

        <div>
          <label for="sale" class="block mb-2 font-medium">Скидка (0-100)</label>
          <input
              v-model="form.sale"
              type="number"
              id="sale"
              min="0"
              max="100"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="sale" class="block mb-2 font-medium">Приоритет(больше цифра - выше предмет)</label>
          <input
              v-model="form.zid"
              type="number"
              id="zid"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="md:col-span-2">
          <label for="about" class="block mb-2 font-medium">Описание<span class="text-red-500">*</span></label>
          <textarea
              v-model="form.about"
              id="about"
              rows="3"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'ring-2 ring-red-500': fieldErrors.about}"

          ></textarea>
        </div>
        <div>
          <label for="category" class="block mb-2 font-medium">Категория <span class="text-red-500">*</span></label>
          <select
              v-model="form.category_id"
              id="category"
              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'ring-2 ring-red-500': fieldErrors.category_id}"
          >
            <option value="">Выберите категорию</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!--        <div>-->
        <!--          <label for="server" class="block mb-2 font-medium">Сервер <span class="text-red-500">*</span></label>-->
        <!--          <select-->
        <!--              v-model="form.server_id"-->
        <!--              id="server"-->
        <!--              class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"-->
        <!--              :class="{'ring-2 ring-red-500': fieldErrors.server_id}"-->
        <!--          >-->
        <!--            <option value="">Выберите сервер</option>-->
        <!--            <option v-for="server in servers" :key="server.id" :value="server.id">-->
        <!--              {{ server.ip }}-->
        <!--            </option>-->
        <!--          </select>-->
        <!--        </div>-->
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-medium mb-3">Атрибуты <span class="text-red-500">*</span></h3>
        <div v-if="fieldErrors.attributes" class="text-red-400 text-sm mb-2">
          Добавьте хотя бы один атрибут
        </div>

        <div v-if="selectedAttributes.length > 0" class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="(item, index) in selectedAttributes" :key="index"
                 class="flex items-center bg-gray-600 p-2 rounded-md group hover:bg-gray-500 transition-colors">
              <img :src="item.image"
                   alt="item"
                   class="w-8 h-8 object-cover rounded mr-2" />
              <span class="flex-grow text-sm">
                {{ item.name }}
                <span class="text-gray-300">({{ item.amount }} шт.)</span>
                <span v-if="item.type === 'custom'" class="text-blue-300 text-xs ml-1">Команда</span>
              </span>
              <div class="flex items-center space-x-1 ml-2">
                <button @click="editAttribute(index)"
                        class="text-blue-400 hover:text-blue-300 opacity-80 group-hover:opacity-100 transition-opacity"
                        title="Редактировать">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       viewBox="0 0 20 20"
                       fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button @click="removeAttribute(index)"
                        class="text-red-400 hover:text-red-300 opacity-80 group-hover:opacity-100 transition-opacity"
                        title="Удалить">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       viewBox="0 0 20 20"
                       fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Переключатель типа добавляемого атрибута -->
        <div class="mb-3">
          <div class="flex space-x-2">
            <button
                @click="switchAttributeMode('item')"
                :class="[
                'px-3 py-2 rounded-md transition-colors',
                attributeMode === 'item'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              Предмет/Чертеж
            </button>
            <button
                @click="switchAttributeMode('custom')"
                :class="[
                'px-3 py-2 rounded-md transition-colors',
                attributeMode === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              Кастомная команда
            </button>
          </div>
        </div>

        <div v-if="attributeMode === 'item'" class="bg-gray-800 rounded-md p-3 mb-4">
          <div class="search-container relative">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                  type="text"
                  v-model="searchQuery"
                  @input="searchItems"
                  placeholder="Поиск предметов..."
                  class="flex-grow bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div v-if="isLoading" class="ml-2">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>

            <div v-if="searchResults.length && showResults"
                 class="absolute z-10 mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto w-full">
              <div v-for="item in searchResults"
                   :key="item.id"
                   @click="selectItem(item)"
                   class="flex items-center p-2 hover:bg-gray-600 cursor-pointer">
                <img :src="item.image"
                     alt="item"
                     class="w-8 h-8 object-cover rounded mr-2" />
                <span class="text-white">{{ item.name }}</span>
              </div>
            </div>

            <div v-if="selectedItem" class="mt-3 flex flex-col space-y-3">
              <div class="flex items-center p-2 bg-gray-700 rounded-md">
                <img :src="selectedItem.image" alt="Selected item" class="w-10 h-10 object-cover rounded mr-3" />
                <span class="text-white font-medium">{{ selectedItem.name }}</span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm mb-1 text-gray-300">Тип</label>
                  <select
                      v-model="newAttribute.type"
                      class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Выберите тип</option>
                    <option value="item">Предмет</option>
                    <option value="blueprint">Чертеж</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm mb-1 text-gray-300">Количество</label>
                  <input
                      type="number"
                      v-model="newAttribute.amount"
                      min="1"
                      class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                  @click="isEditingAttribute ? saveEditedAttribute() : addAttribute()"
                  :disabled="!isValidItemAttribute"
                  :class="[
                  'w-full py-2 rounded-md transition-colors',
                  isValidItemAttribute
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ isEditingAttribute ? 'Сохранить изменения' : 'Добавить предмет' }}
              </button>

              <button
                  v-if="isEditingAttribute"
                  @click="cancelEditAttribute"
                  class="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Отменить редактирование
              </button>
            </div>
          </div>
        </div>

        <div v-if="attributeMode === 'custom'" class="bg-gray-800 rounded-md p-3 mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm mb-1 text-gray-300">Название</label>
              <input
                  v-model="customAttribute.name"
                  type="text"
                  placeholder="Название команды"
                  class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 text-gray-300">URL изображения</label>
              <input
                  v-model="customAttribute.image"
                  type="text"
                  placeholder="URL изображения"
                  class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 text-gray-300">Количество</label>
              <input
                  type="number"
                  v-model="customAttribute.amount"
                  placeholder="Количество"
                  min="1"
                  class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm mb-1 text-gray-300">Бейдж</label>
              <input
                  v-model="customAttribute.value"
                  type="text"
                  placeholder="Бейдж"
                  class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="block text-sm mb-1 text-gray-300">Команда</label>
            <textarea
                v-model="customAttribute.command"
                placeholder="Введите команду"
                rows="2"
                class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
              @click="isEditingCustomAttribute ? saveEditedCustomAttribute() : addCustomAttribute()"
              :disabled="!isValidCustomAttribute"
              :class="[
              'w-full py-2 rounded-md transition-colors',
              isValidCustomAttribute
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ isEditingCustomAttribute ? 'Сохранить изменения' : 'Добавить команду' }}
          </button>

          <button
              v-if="isEditingCustomAttribute"
              @click="cancelEditCustomAttribute"
              class="w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
          >
            Отменить редактирование
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-between">
      <button
          @click="$emit('delete')"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Удалить
      </button>
    </div>
  </Modal>
</template>

<script setup>
import {ref, watch, computed, onMounted, onUnmounted} from 'vue';
import Modal from "@/Components/Dashboard/MainModal.vue";
import axios from 'axios';
import {debounce} from 'lodash';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  confirmText: String,
  selectedItem: Object,
  categories: Array,
  servers: Array,
  isDeleteAction: Boolean,
});

const emit = defineEmits(['close', 'confirm', 'delete']);

const form = ref({
  name: "",
  price: 0,
  zid: 0,
  about: "/empty",
  sale: 0,
  image: "",
  atr: "",
  category_id: "",
  server_id: 1,
});

const attributeMode = ref('item');

const searchQuery = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
const showResults = ref(false);
const selectedAttributes = ref([]);
const selectedItem = ref(null);

const validationErrors = ref([]);
const fieldErrors = ref({});

const newAttribute = ref({
  amount: 1,
  type: 'item',
});

const customAttribute = ref({
  type: 'custom',
  name: '',
  image: '',
  amount: 1,
  value: '',
  command: ''
});

const isEditingAttribute = ref(false);
const isEditingCustomAttribute = ref(false);
const editingAttributeIndex = ref(-1);

const switchAttributeMode = (mode) => {
  attributeMode.value = mode;
  if (mode === 'item') {
    searchQuery.value = '';
    selectedItem.value = null;
  }
  cancelEditAttribute();
  cancelEditCustomAttribute();
};

const isValidItemAttribute = computed(() => {
  return (
      selectedItem.value &&
      newAttribute.value.amount > 0 &&
      newAttribute.value.type
  );
});

const isValidCustomAttribute = computed(() => {
  return (
      customAttribute.value.name &&
      customAttribute.value.image &&
      customAttribute.value.command &&
      customAttribute.value.amount > 0
  );
});

const searchItems = debounce(async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  isLoading.value = true;
  showResults.value = true;

  try {
    const response = await axios.get('/itemslib/search', {
      params: {
        search: searchQuery.value
      }
    });
    searchResults.value = response.data.data.data;
  } catch (error) {
    console.error('Error searching items:', error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
}, 300);

const selectItem = (item) => {
  selectedItem.value = item;
  searchQuery.value = item.name;
  showResults.value = false;
};

const addAttribute = () => {
  if (isValidItemAttribute.value) {
    const attribute = {
      type: newAttribute.value.type,
      id: selectedItem.value.id,
      itemid: selectedItem.value.itemid,
      name: selectedItem.value.name,
      image: selectedItem.value.image,
      amount: parseInt(newAttribute.value.amount)
    };

    selectedAttributes.value.push(attribute);

    selectedItem.value = null;
    searchQuery.value = '';
    newAttribute.value = {amount: 1, type: 'item'};
    updateFormAttributes();

    if (fieldErrors.value.attributes) {
      fieldErrors.value.attributes = false;
      const index = validationErrors.value.findIndex(err => err === 'Атрибуты');
      if (index !== -1) {
        validationErrors.value.splice(index, 1);
      }
    }
  }
};

const addCustomAttribute = () => {
  if (isValidCustomAttribute.value) {
    const attribute = {
      type: 'custom',
      name: customAttribute.value.name,
      image: customAttribute.value.image,
      amount: parseInt(customAttribute.value.amount),
      value: customAttribute.value.value,
      command: customAttribute.value.command
    };

    selectedAttributes.value.push(attribute);

    customAttribute.value = {
      type: 'custom',
      name: '',
      image: '',
      amount: 1,
      value: '',
      command: ''
    };
    updateFormAttributes();

    if (fieldErrors.value.attributes) {
      fieldErrors.value.attributes = false;
      const index = validationErrors.value.findIndex(err => err === 'Атрибуты');
      if (index !== -1) {
        validationErrors.value.splice(index, 1);
      }
    }
  }
};

const removeAttribute = (index) => {
  selectedAttributes.value.splice(index, 1);
  updateFormAttributes();
};

// Функции для редактирования атрибутов
const editAttribute = (index) => {
  const attribute = selectedAttributes.value[index];
  editingAttributeIndex.value = index;

  if (attribute.type === 'custom') {
    // Редактирование кастомного атрибута
    isEditingCustomAttribute.value = true;
    attributeMode.value = 'custom';
    customAttribute.value = {
      type: 'custom',
      name: attribute.name,
      image: attribute.image,
      amount: attribute.amount,
      value: attribute.value || '',
      command: attribute.command || ''
    };
  } else {
    isEditingAttribute.value = true;
    attributeMode.value = 'item';

    selectedItem.value = {
      id: attribute.id,
      itemid: attribute.itemid,
      name: attribute.name,
      image: attribute.image
    };

    searchQuery.value = attribute.name;
    newAttribute.value = {
      amount: attribute.amount,
      type: attribute.type
    };
  }
};

const saveEditedAttribute = () => {
  if (isValidItemAttribute.value && editingAttributeIndex.value >= 0) {
    const updatedAttribute = {
      type: newAttribute.value.type,
      id: selectedItem.value.id,
      itemid: selectedItem.value.itemid,
      name: selectedItem.value.name,
      image: selectedItem.value.image,
      amount: parseInt(newAttribute.value.amount)
    };

    selectedAttributes.value[editingAttributeIndex.value] = updatedAttribute;
    updateFormAttributes();
    cancelEditAttribute();
  }
};

const saveEditedCustomAttribute = () => {
  if (isValidCustomAttribute.value && editingAttributeIndex.value >= 0) {
    const updatedAttribute = {
      type: 'custom',
      name: customAttribute.value.name,
      image: customAttribute.value.image,
      amount: parseInt(customAttribute.value.amount),
      value: customAttribute.value.value,
      command: customAttribute.value.command
    };

    selectedAttributes.value[editingAttributeIndex.value] = updatedAttribute;
    updateFormAttributes();
    cancelEditCustomAttribute();
  }
};

const cancelEditAttribute = () => {
  isEditingAttribute.value = false;
  editingAttributeIndex.value = -1;
  selectedItem.value = null;
  searchQuery.value = '';
  newAttribute.value = {amount: 1, type: 'item'};
};

const cancelEditCustomAttribute = () => {
  isEditingCustomAttribute.value = false;
  editingAttributeIndex.value = -1;
  customAttribute.value = {
    type: 'custom',
    name: '',
    image: '',
    amount: 1,
    value: '',
    command: ''
  };
};

const updateFormAttributes = () => {
  form.value.atr = JSON.stringify(selectedAttributes.value);
};

const validateForm = () => {
  validationErrors.value = [];
  fieldErrors.value = {};

  if (!form.value.name) {
    validationErrors.value.push('Название');
    fieldErrors.value.name = true;
  }

  if (!form.value.image) {
    validationErrors.value.push('Изображение');
    fieldErrors.value.image = true;
  }

  if (!form.value.about) {
    validationErrors.value.push('Описание');
    fieldErrors.value.about = true;
  }

  if (!form.value.price || form.value.price <= 0) {
    validationErrors.value.push('Цена');
    fieldErrors.value.price = true;
  }

  if (!form.value.category_id) {
    validationErrors.value.push('Категория');
    fieldErrors.value.category_id = true;
  }

  if (selectedAttributes.value.length === 0) {
    validationErrors.value.push('Атрибуты');
    fieldErrors.value.attributes = true;
  }

  return validationErrors.value.length === 0;
};

const validateAndConfirm = () => {
  if (props.isDeleteAction) {
    emit('confirm', form.value);
    return;
  }

  updateFormAttributes();
  if (validateForm()) {
    emit('confirm', form.value);
  } else {
    setTimeout(() => {
      const modalElement = document.querySelector('.product-modal');
      if (modalElement) {
        modalElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
};

watch(() => props.selectedItem, (newItem) => {
  if (newItem) {
    form.value = {...newItem};
    try {
      selectedAttributes.value = newItem.atr ? JSON.parse(newItem.atr) : [];
    } catch (e) {
      selectedAttributes.value = [];
    }
  } else {
    form.value = {
      name: "",
      price: 0,
      sale: 0,
      about: "/empty",
      image: "",
      zid: "",
      atr: "[]",
      category_id: "",
      server_id: 1,
    };
    selectedAttributes.value = [];
  }
  validationErrors.value = [];
  fieldErrors.value = {};
  cancelEditAttribute();
  cancelEditCustomAttribute();
}, {immediate: true});

const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.product-modal :deep(.max-h-60) {
  max-height: 15rem;
}
</style>
