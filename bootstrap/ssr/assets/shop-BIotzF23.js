import { ref, computed, watch, onMounted, onUnmounted, mergeProps, withCtx, createBlock, createVNode, openBlock, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList, withDirectives, vModelText, vModelSelect, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttrs } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { R as ReusableModal } from "./MainModal-yQIB2i_G.js";
import axios from "axios";
import { debounce } from "lodash";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { _ as _sfc_main$2 } from "./Dashboard-fXrpRFWF.js";
import "@heroicons/vue/24/outline";
const _sfc_main$1 = {
  __name: "ModalShop",
  __ssrInlineRender: true,
  props: {
    isOpen: Boolean,
    title: String,
    confirmText: String,
    selectedItem: Object,
    categories: Array,
    servers: Array,
    isDeleteAction: Boolean
  },
  emits: ["close", "confirm", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = ref({
      name: "",
      price: 0,
      zid: 0,
      about: "/empty",
      sale: 0,
      image: "",
      atr: "",
      category_id: "",
      server_id: 1
    });
    const attributeMode = ref("item");
    const searchQuery = ref("");
    const searchResults = ref([]);
    const isLoading = ref(false);
    const showResults = ref(false);
    const selectedAttributes = ref([]);
    const selectedItem = ref(null);
    const validationErrors = ref([]);
    const fieldErrors = ref({});
    const newAttribute = ref({
      amount: 1,
      type: "item"
    });
    const customAttribute = ref({
      type: "custom",
      name: "",
      image: "",
      amount: 1,
      value: "",
      command: ""
    });
    const isEditingAttribute = ref(false);
    const isEditingCustomAttribute = ref(false);
    const editingAttributeIndex = ref(-1);
    const switchAttributeMode = (mode) => {
      attributeMode.value = mode;
      if (mode === "item") {
        searchQuery.value = "";
        selectedItem.value = null;
      }
      cancelEditAttribute();
      cancelEditCustomAttribute();
    };
    const isValidItemAttribute = computed(() => {
      return selectedItem.value && newAttribute.value.amount > 0 && newAttribute.value.type;
    });
    const isValidCustomAttribute = computed(() => {
      return customAttribute.value.name && customAttribute.value.image && customAttribute.value.command && customAttribute.value.amount > 0;
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
        const response = await axios.get("/itemslib/search", {
          params: {
            search: searchQuery.value
          }
        });
        searchResults.value = response.data.data.data;
      } catch (error) {
        console.error("Error searching items:", error);
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
        searchQuery.value = "";
        newAttribute.value = { amount: 1, type: "item" };
        updateFormAttributes();
        if (fieldErrors.value.attributes) {
          fieldErrors.value.attributes = false;
          const index = validationErrors.value.findIndex((err) => err === "Атрибуты");
          if (index !== -1) {
            validationErrors.value.splice(index, 1);
          }
        }
      }
    };
    const addCustomAttribute = () => {
      if (isValidCustomAttribute.value) {
        const attribute = {
          type: "custom",
          name: customAttribute.value.name,
          image: customAttribute.value.image,
          amount: parseInt(customAttribute.value.amount),
          value: customAttribute.value.value,
          command: customAttribute.value.command
        };
        selectedAttributes.value.push(attribute);
        customAttribute.value = {
          type: "custom",
          name: "",
          image: "",
          amount: 1,
          value: "",
          command: ""
        };
        updateFormAttributes();
        if (fieldErrors.value.attributes) {
          fieldErrors.value.attributes = false;
          const index = validationErrors.value.findIndex((err) => err === "Атрибуты");
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
    const editAttribute = (index) => {
      const attribute = selectedAttributes.value[index];
      editingAttributeIndex.value = index;
      if (attribute.type === "custom") {
        isEditingCustomAttribute.value = true;
        attributeMode.value = "custom";
        customAttribute.value = {
          type: "custom",
          name: attribute.name,
          image: attribute.image,
          amount: attribute.amount,
          value: attribute.value || "",
          command: attribute.command || ""
        };
      } else {
        isEditingAttribute.value = true;
        attributeMode.value = "item";
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
          type: "custom",
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
      searchQuery.value = "";
      newAttribute.value = { amount: 1, type: "item" };
    };
    const cancelEditCustomAttribute = () => {
      isEditingCustomAttribute.value = false;
      editingAttributeIndex.value = -1;
      customAttribute.value = {
        type: "custom",
        name: "",
        image: "",
        amount: 1,
        value: "",
        command: ""
      };
    };
    const updateFormAttributes = () => {
      form.value.atr = JSON.stringify(selectedAttributes.value);
    };
    const validateForm = () => {
      validationErrors.value = [];
      fieldErrors.value = {};
      if (!form.value.name) {
        validationErrors.value.push("Название");
        fieldErrors.value.name = true;
      }
      if (!form.value.image) {
        validationErrors.value.push("Изображение");
        fieldErrors.value.image = true;
      }
      if (!form.value.about) {
        validationErrors.value.push("Описание");
        fieldErrors.value.about = true;
      }
      if (!form.value.price || form.value.price <= 0) {
        validationErrors.value.push("Цена");
        fieldErrors.value.price = true;
      }
      if (!form.value.category_id) {
        validationErrors.value.push("Категория");
        fieldErrors.value.category_id = true;
      }
      if (selectedAttributes.value.length === 0) {
        validationErrors.value.push("Атрибуты");
        fieldErrors.value.attributes = true;
      }
      return validationErrors.value.length === 0;
    };
    const validateAndConfirm = () => {
      if (props.isDeleteAction) {
        emit("confirm", form.value);
        return;
      }
      updateFormAttributes();
      if (validateForm()) {
        emit("confirm", form.value);
      } else {
        setTimeout(() => {
          const modalElement = document.querySelector(".product-modal");
          if (modalElement) {
            modalElement.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    };
    watch(() => props.selectedItem, (newItem) => {
      if (newItem) {
        form.value = { ...newItem };
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
          server_id: 1
        };
        selectedAttributes.value = [];
      }
      validationErrors.value = [];
      fieldErrors.value = {};
      cancelEditAttribute();
      cancelEditCustomAttribute();
    }, { immediate: true });
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        showResults.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(ReusableModal, mergeProps({
        isOpen: __props.isOpen,
        title: __props.title,
        confirmText: __props.confirmText,
        onClose: ($event) => _ctx.$emit("close"),
        onConfirm: validateAndConfirm,
        class: "product-modal"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if (__props.isDeleteAction) {
              _push2(`<div class="text-white" data-v-7c07d367${_scopeId}> Вы уверены, что хотите удалить товар <b data-v-7c07d367${_scopeId}>${ssrInterpolate((_a = selectedItem.value) == null ? void 0 : _a.name)}</b>? </div>`);
            } else {
              _push2(`<div class="text-white" data-v-7c07d367${_scopeId}>`);
              if (validationErrors.value.length > 0) {
                _push2(`<div class="bg-red-500 text-white p-3 rounded-md mb-4" data-v-7c07d367${_scopeId}><p class="font-medium mb-1" data-v-7c07d367${_scopeId}>Пожалуйста, заполните следующие поля:</p><ul class="list-disc pl-5" data-v-7c07d367${_scopeId}><!--[-->`);
                ssrRenderList(validationErrors.value, (error, index) => {
                  _push2(`<li data-v-7c07d367${_scopeId}>${ssrInterpolate(error)}</li>`);
                });
                _push2(`<!--]--></ul></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-7c07d367${_scopeId}><div data-v-7c07d367${_scopeId}><label for="name" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Название <span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></label><input${ssrRenderAttr("value", form.value.name)} type="text" id="name" class="${ssrRenderClass([{ "ring-2 ring-red-500": fieldErrors.value.name }, "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label for="image" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Изображение <span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></label><input${ssrRenderAttr("value", form.value.image)} type="text" id="image" class="${ssrRenderClass([{ "ring-2 ring-red-500": fieldErrors.value.image }, "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label for="price" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Цена <span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></label><input${ssrRenderAttr("value", form.value.price)} type="number" id="price" class="${ssrRenderClass([{ "ring-2 ring-red-500": fieldErrors.value.price }, "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label for="sale" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Скидка (0-100)</label><input${ssrRenderAttr("value", form.value.sale)} type="number" id="sale" min="0" max="100" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label for="sale" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Приоритет(больше цифра - выше предмет)</label><input${ssrRenderAttr("value", form.value.zid)} type="number" id="zid" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div><div class="md:col-span-2" data-v-7c07d367${_scopeId}><label for="about" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Описание<span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></label><textarea id="about" rows="3" class="${ssrRenderClass([{ "ring-2 ring-red-500": fieldErrors.value.about }, "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-7c07d367${_scopeId}>${ssrInterpolate(form.value.about)}</textarea></div><div data-v-7c07d367${_scopeId}><label for="category" class="block mb-2 font-medium" data-v-7c07d367${_scopeId}>Категория <span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></label><select id="category" class="${ssrRenderClass([{ "ring-2 ring-red-500": fieldErrors.value.category_id }, "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-7c07d367${_scopeId}><option value="" data-v-7c07d367${ssrIncludeBooleanAttr(Array.isArray(form.value.category_id) ? ssrLooseContain(form.value.category_id, "") : ssrLooseEqual(form.value.category_id, "")) ? " selected" : ""}${_scopeId}>Выберите категорию</option><!--[-->`);
              ssrRenderList(__props.categories, (category) => {
                _push2(`<option${ssrRenderAttr("value", category.id)} data-v-7c07d367${ssrIncludeBooleanAttr(Array.isArray(form.value.category_id) ? ssrLooseContain(form.value.category_id, category.id) : ssrLooseEqual(form.value.category_id, category.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(category.name)}</option>`);
              });
              _push2(`<!--]--></select></div></div><div class="mt-6" data-v-7c07d367${_scopeId}><h3 class="text-lg font-medium mb-3" data-v-7c07d367${_scopeId}>Атрибуты <span class="text-red-500" data-v-7c07d367${_scopeId}>*</span></h3>`);
              if (fieldErrors.value.attributes) {
                _push2(`<div class="text-red-400 text-sm mb-2" data-v-7c07d367${_scopeId}> Добавьте хотя бы один атрибут </div>`);
              } else {
                _push2(`<!---->`);
              }
              if (selectedAttributes.value.length > 0) {
                _push2(`<div class="mb-4" data-v-7c07d367${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-2" data-v-7c07d367${_scopeId}><!--[-->`);
                ssrRenderList(selectedAttributes.value, (item, index) => {
                  _push2(`<div class="flex items-center bg-gray-600 p-2 rounded-md group hover:bg-gray-500 transition-colors" data-v-7c07d367${_scopeId}><img${ssrRenderAttr("src", item.image)} alt="item" class="w-8 h-8 object-cover rounded mr-2" data-v-7c07d367${_scopeId}><span class="flex-grow text-sm" data-v-7c07d367${_scopeId}>${ssrInterpolate(item.name)} <span class="text-gray-300" data-v-7c07d367${_scopeId}>(${ssrInterpolate(item.amount)} шт.)</span>`);
                  if (item.type === "custom") {
                    _push2(`<span class="text-blue-300 text-xs ml-1" data-v-7c07d367${_scopeId}>Команда</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</span><div class="flex items-center space-x-1 ml-2" data-v-7c07d367${_scopeId}><button class="text-blue-400 hover:text-blue-300 opacity-80 group-hover:opacity-100 transition-opacity" title="Редактировать" data-v-7c07d367${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" data-v-7c07d367${_scopeId}><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" data-v-7c07d367${_scopeId}></path></svg></button><button class="text-red-400 hover:text-red-300 opacity-80 group-hover:opacity-100 transition-opacity" title="Удалить" data-v-7c07d367${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" data-v-7c07d367${_scopeId}><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" data-v-7c07d367${_scopeId}></path></svg></button></div></div>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="mb-3" data-v-7c07d367${_scopeId}><div class="flex space-x-2" data-v-7c07d367${_scopeId}><button class="${ssrRenderClass([
                "px-3 py-2 rounded-md transition-colors",
                attributeMode.value === "item" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              ])}" data-v-7c07d367${_scopeId}> Предмет/Чертеж </button><button class="${ssrRenderClass([
                "px-3 py-2 rounded-md transition-colors",
                attributeMode.value === "custom" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              ])}" data-v-7c07d367${_scopeId}> Кастомная команда </button></div></div>`);
              if (attributeMode.value === "item") {
                _push2(`<div class="bg-gray-800 rounded-md p-3 mb-4" data-v-7c07d367${_scopeId}><div class="search-container relative" data-v-7c07d367${_scopeId}><div class="flex items-center mb-2" data-v-7c07d367${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7c07d367${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-7c07d367${_scopeId}></path></svg><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Поиск предметов..." class="flex-grow bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}>`);
                if (isLoading.value) {
                  _push2(`<div class="ml-2" data-v-7c07d367${_scopeId}><svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-7c07d367${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7c07d367${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7c07d367${_scopeId}></path></svg></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (searchResults.value.length && showResults.value) {
                  _push2(`<div class="absolute z-10 mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto w-full" data-v-7c07d367${_scopeId}><!--[-->`);
                  ssrRenderList(searchResults.value, (item) => {
                    _push2(`<div class="flex items-center p-2 hover:bg-gray-600 cursor-pointer" data-v-7c07d367${_scopeId}><img${ssrRenderAttr("src", item.image)} alt="item" class="w-8 h-8 object-cover rounded mr-2" data-v-7c07d367${_scopeId}><span class="text-white" data-v-7c07d367${_scopeId}>${ssrInterpolate(item.name)}</span></div>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (selectedItem.value) {
                  _push2(`<div class="mt-3 flex flex-col space-y-3" data-v-7c07d367${_scopeId}><div class="flex items-center p-2 bg-gray-700 rounded-md" data-v-7c07d367${_scopeId}><img${ssrRenderAttr("src", selectedItem.value.image)} alt="Selected item" class="w-10 h-10 object-cover rounded mr-3" data-v-7c07d367${_scopeId}><span class="text-white font-medium" data-v-7c07d367${_scopeId}>${ssrInterpolate(selectedItem.value.name)}</span></div><div class="grid grid-cols-2 gap-2" data-v-7c07d367${_scopeId}><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Тип</label><select class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}><option value="" disabled data-v-7c07d367${ssrIncludeBooleanAttr(Array.isArray(newAttribute.value.type) ? ssrLooseContain(newAttribute.value.type, "") : ssrLooseEqual(newAttribute.value.type, "")) ? " selected" : ""}${_scopeId}>Выберите тип</option><option value="item" data-v-7c07d367${ssrIncludeBooleanAttr(Array.isArray(newAttribute.value.type) ? ssrLooseContain(newAttribute.value.type, "item") : ssrLooseEqual(newAttribute.value.type, "item")) ? " selected" : ""}${_scopeId}>Предмет</option><option value="blueprint" data-v-7c07d367${ssrIncludeBooleanAttr(Array.isArray(newAttribute.value.type) ? ssrLooseContain(newAttribute.value.type, "blueprint") : ssrLooseEqual(newAttribute.value.type, "blueprint")) ? " selected" : ""}${_scopeId}>Чертеж</option></select></div><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Количество</label><input type="number"${ssrRenderAttr("value", newAttribute.value.amount)} min="1" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div></div><button${ssrIncludeBooleanAttr(!isValidItemAttribute.value) ? " disabled" : ""} class="${ssrRenderClass([
                    "w-full py-2 rounded-md transition-colors",
                    isValidItemAttribute.value ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  ])}" data-v-7c07d367${_scopeId}>${ssrInterpolate(isEditingAttribute.value ? "Сохранить изменения" : "Добавить предмет")}</button>`);
                  if (isEditingAttribute.value) {
                    _push2(`<button class="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors" data-v-7c07d367${_scopeId}> Отменить редактирование </button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (attributeMode.value === "custom") {
                _push2(`<div class="bg-gray-800 rounded-md p-3 mb-4" data-v-7c07d367${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3" data-v-7c07d367${_scopeId}><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Название</label><input${ssrRenderAttr("value", customAttribute.value.name)} type="text" placeholder="Название команды" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>URL изображения</label><input${ssrRenderAttr("value", customAttribute.value.image)} type="text" placeholder="URL изображения" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Количество</label><input type="number"${ssrRenderAttr("value", customAttribute.value.amount)} placeholder="Количество" min="1" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div><div data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Бейдж</label><input${ssrRenderAttr("value", customAttribute.value.value)} type="text" placeholder="Бейдж" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}></div></div><div class="mb-3" data-v-7c07d367${_scopeId}><label class="block text-sm mb-1 text-gray-300" data-v-7c07d367${_scopeId}>Команда</label><textarea placeholder="Введите команду" rows="2" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7c07d367${_scopeId}>${ssrInterpolate(customAttribute.value.command)}</textarea></div><button${ssrIncludeBooleanAttr(!isValidCustomAttribute.value) ? " disabled" : ""} class="${ssrRenderClass([
                  "w-full py-2 rounded-md transition-colors",
                  isValidCustomAttribute.value ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"
                ])}" data-v-7c07d367${_scopeId}>${ssrInterpolate(isEditingCustomAttribute.value ? "Сохранить изменения" : "Добавить команду")}</button>`);
                if (isEditingCustomAttribute.value) {
                  _push2(`<button class="w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors" data-v-7c07d367${_scopeId}> Отменить редактирование </button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            }
            _push2(`<div class="mt-6 flex justify-between" data-v-7c07d367${_scopeId}><button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" data-v-7c07d367${_scopeId}> Удалить </button></div>`);
          } else {
            return [
              __props.isDeleteAction ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-white"
              }, [
                createTextVNode(" Вы уверены, что хотите удалить товар "),
                createVNode("b", null, toDisplayString((_b = selectedItem.value) == null ? void 0 : _b.name), 1),
                createTextVNode("? ")
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "text-white"
              }, [
                validationErrors.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-red-500 text-white p-3 rounded-md mb-4"
                }, [
                  createVNode("p", { class: "font-medium mb-1" }, "Пожалуйста, заполните следующие поля:"),
                  createVNode("ul", { class: "list-disc pl-5" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(validationErrors.value, (error, index) => {
                      return openBlock(), createBlock("li", { key: index }, toDisplayString(error), 1);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "name",
                      class: "block mb-2 font-medium"
                    }, [
                      createTextVNode("Название "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.value.name = $event,
                      type: "text",
                      id: "name",
                      class: ["w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", { "ring-2 ring-red-500": fieldErrors.value.name }]
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.name]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "image",
                      class: "block mb-2 font-medium"
                    }, [
                      createTextVNode("Изображение "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.value.image = $event,
                      type: "text",
                      id: "image",
                      class: ["w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", { "ring-2 ring-red-500": fieldErrors.value.image }]
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.image]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "price",
                      class: "block mb-2 font-medium"
                    }, [
                      createTextVNode("Цена "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.value.price = $event,
                      type: "number",
                      id: "price",
                      class: ["w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", { "ring-2 ring-red-500": fieldErrors.value.price }]
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.price]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "sale",
                      class: "block mb-2 font-medium"
                    }, "Скидка (0-100)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.value.sale = $event,
                      type: "number",
                      id: "sale",
                      min: "0",
                      max: "100",
                      class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.sale]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "sale",
                      class: "block mb-2 font-medium"
                    }, "Приоритет(больше цифра - выше предмет)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.value.zid = $event,
                      type: "number",
                      id: "zid",
                      class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.zid]
                    ])
                  ]),
                  createVNode("div", { class: "md:col-span-2" }, [
                    createVNode("label", {
                      for: "about",
                      class: "block mb-2 font-medium"
                    }, [
                      createTextVNode("Описание"),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => form.value.about = $event,
                      id: "about",
                      rows: "3",
                      class: ["w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", { "ring-2 ring-red-500": fieldErrors.value.about }]
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.about]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "category",
                      class: "block mb-2 font-medium"
                    }, [
                      createTextVNode("Категория "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.category_id = $event,
                      id: "category",
                      class: ["w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", { "ring-2 ring-red-500": fieldErrors.value.category_id }]
                    }, [
                      createVNode("option", { value: "" }, "Выберите категорию"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                        return openBlock(), createBlock("option", {
                          key: category.id,
                          value: category.id
                        }, toDisplayString(category.name), 9, ["value"]);
                      }), 128))
                    ], 10, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.category_id]
                    ])
                  ])
                ]),
                createVNode("div", { class: "mt-6" }, [
                  createVNode("h3", { class: "text-lg font-medium mb-3" }, [
                    createTextVNode("Атрибуты "),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  fieldErrors.value.attributes ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-red-400 text-sm mb-2"
                  }, " Добавьте хотя бы один атрибут ")) : createCommentVNode("", true),
                  selectedAttributes.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "mb-4"
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(selectedAttributes.value, (item, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "flex items-center bg-gray-600 p-2 rounded-md group hover:bg-gray-500 transition-colors"
                        }, [
                          createVNode("img", {
                            src: item.image,
                            alt: "item",
                            class: "w-8 h-8 object-cover rounded mr-2"
                          }, null, 8, ["src"]),
                          createVNode("span", { class: "flex-grow text-sm" }, [
                            createTextVNode(toDisplayString(item.name) + " ", 1),
                            createVNode("span", { class: "text-gray-300" }, "(" + toDisplayString(item.amount) + " шт.)", 1),
                            item.type === "custom" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-blue-300 text-xs ml-1"
                            }, "Команда")) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center space-x-1 ml-2" }, [
                            createVNode("button", {
                              onClick: ($event) => editAttribute(index),
                              class: "text-blue-400 hover:text-blue-300 opacity-80 group-hover:opacity-100 transition-opacity",
                              title: "Редактировать"
                            }, [
                              (openBlock(), createBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                class: "h-4 w-4",
                                viewBox: "0 0 20 20",
                                fill: "currentColor"
                              }, [
                                createVNode("path", { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" })
                              ]))
                            ], 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => removeAttribute(index),
                              class: "text-red-400 hover:text-red-300 opacity-80 group-hover:opacity-100 transition-opacity",
                              title: "Удалить"
                            }, [
                              (openBlock(), createBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                class: "h-4 w-4",
                                viewBox: "0 0 20 20",
                                fill: "currentColor"
                              }, [
                                createVNode("path", {
                                  "fill-rule": "evenodd",
                                  d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                  "clip-rule": "evenodd"
                                })
                              ]))
                            ], 8, ["onClick"])
                          ])
                        ]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "mb-3" }, [
                    createVNode("div", { class: "flex space-x-2" }, [
                      createVNode("button", {
                        onClick: ($event) => switchAttributeMode("item"),
                        class: [
                          "px-3 py-2 rounded-md transition-colors",
                          attributeMode.value === "item" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        ]
                      }, " Предмет/Чертеж ", 10, ["onClick"]),
                      createVNode("button", {
                        onClick: ($event) => switchAttributeMode("custom"),
                        class: [
                          "px-3 py-2 rounded-md transition-colors",
                          attributeMode.value === "custom" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        ]
                      }, " Кастомная команда ", 10, ["onClick"])
                    ])
                  ]),
                  attributeMode.value === "item" ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "bg-gray-800 rounded-md p-3 mb-4"
                  }, [
                    createVNode("div", { class: "search-container relative" }, [
                      createVNode("div", { class: "flex items-center mb-2" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-5 w-5 text-gray-400 mr-2",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          })
                        ])),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                          onInput: unref(searchItems),
                          placeholder: "Поиск предметов...",
                          class: "flex-grow bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                          [vModelText, searchQuery.value]
                        ]),
                        isLoading.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "ml-2"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "animate-spin h-5 w-5 text-blue-500",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            })
                          ]))
                        ])) : createCommentVNode("", true)
                      ]),
                      searchResults.value.length && showResults.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "absolute z-10 mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto w-full"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(searchResults.value, (item) => {
                          return openBlock(), createBlock("div", {
                            key: item.id,
                            onClick: ($event) => selectItem(item),
                            class: "flex items-center p-2 hover:bg-gray-600 cursor-pointer"
                          }, [
                            createVNode("img", {
                              src: item.image,
                              alt: "item",
                              class: "w-8 h-8 object-cover rounded mr-2"
                            }, null, 8, ["src"]),
                            createVNode("span", { class: "text-white" }, toDisplayString(item.name), 1)
                          ], 8, ["onClick"]);
                        }), 128))
                      ])) : createCommentVNode("", true),
                      selectedItem.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "mt-3 flex flex-col space-y-3"
                      }, [
                        createVNode("div", { class: "flex items-center p-2 bg-gray-700 rounded-md" }, [
                          createVNode("img", {
                            src: selectedItem.value.image,
                            alt: "Selected item",
                            class: "w-10 h-10 object-cover rounded mr-3"
                          }, null, 8, ["src"]),
                          createVNode("span", { class: "text-white font-medium" }, toDisplayString(selectedItem.value.name), 1)
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Тип"),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => newAttribute.value.type = $event,
                              class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            }, [
                              createVNode("option", {
                                value: "",
                                disabled: ""
                              }, "Выберите тип"),
                              createVNode("option", { value: "item" }, "Предмет"),
                              createVNode("option", { value: "blueprint" }, "Чертеж")
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, newAttribute.value.type]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Количество"),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => newAttribute.value.amount = $event,
                              min: "1",
                              class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, newAttribute.value.amount]
                            ])
                          ])
                        ]),
                        createVNode("button", {
                          onClick: ($event) => isEditingAttribute.value ? saveEditedAttribute() : addAttribute(),
                          disabled: !isValidItemAttribute.value,
                          class: [
                            "w-full py-2 rounded-md transition-colors",
                            isValidItemAttribute.value ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"
                          ]
                        }, toDisplayString(isEditingAttribute.value ? "Сохранить изменения" : "Добавить предмет"), 11, ["onClick", "disabled"]),
                        isEditingAttribute.value ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: cancelEditAttribute,
                          class: "w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                        }, " Отменить редактирование ")) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ])
                  ])) : createCommentVNode("", true),
                  attributeMode.value === "custom" ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "bg-gray-800 rounded-md p-3 mb-4"
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-3" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Название"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => customAttribute.value.name = $event,
                          type: "text",
                          placeholder: "Название команды",
                          class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, customAttribute.value.name]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "URL изображения"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => customAttribute.value.image = $event,
                          type: "text",
                          placeholder: "URL изображения",
                          class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, customAttribute.value.image]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Количество"),
                        withDirectives(createVNode("input", {
                          type: "number",
                          "onUpdate:modelValue": ($event) => customAttribute.value.amount = $event,
                          placeholder: "Количество",
                          min: "1",
                          class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, customAttribute.value.amount]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Бейдж"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => customAttribute.value.value = $event,
                          type: "text",
                          placeholder: "Бейдж",
                          class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, customAttribute.value.value]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mb-3" }, [
                      createVNode("label", { class: "block text-sm mb-1 text-gray-300" }, "Команда"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => customAttribute.value.command = $event,
                        placeholder: "Введите команду",
                        rows: "2",
                        class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, customAttribute.value.command]
                      ])
                    ]),
                    createVNode("button", {
                      onClick: ($event) => isEditingCustomAttribute.value ? saveEditedCustomAttribute() : addCustomAttribute(),
                      disabled: !isValidCustomAttribute.value,
                      class: [
                        "w-full py-2 rounded-md transition-colors",
                        isValidCustomAttribute.value ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      ]
                    }, toDisplayString(isEditingCustomAttribute.value ? "Сохранить изменения" : "Добавить команду"), 11, ["onClick", "disabled"]),
                    isEditingCustomAttribute.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: cancelEditCustomAttribute,
                      class: "w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                    }, " Отменить редактирование ")) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ])
              ])),
              createVNode("div", { class: "mt-6 flex justify-between" }, [
                createVNode("button", {
                  onClick: ($event) => _ctx.$emit("delete"),
                  class: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                }, " Удалить ", 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dashboard/shop/ModalShop.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ShopItemModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7c07d367"]]);
const __default__ = {
  layout: _sfc_main$2
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "shop",
  __ssrInlineRender: true,
  props: {
    shopItems: Object,
    categories: Array,
    servers: Object,
    filters: Object
  },
  setup(__props) {
    var _a, _b, _c;
    const props = __props;
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const selectedCategory = ref(((_b = props.filters) == null ? void 0 : _b.category) || "");
    const selectedServer = ref(((_c = props.filters) == null ? void 0 : _c.server) || "");
    const isModalOpen = ref(false);
    const isCopyModalOpen = ref(false);
    const isDeleteAction = ref(false);
    const modalTitle = ref("");
    const modalConfirmText = ref("");
    const selectedItem = ref(null);
    const selectedItems = ref([]);
    const targetServerId = ref("");
    const getCategoryName = (categoryId) => {
      const category = props.categories.find((c) => c.id === categoryId);
      return category ? category.name : "Без категории";
    };
    const isItemSelected = (itemId) => {
      return selectedItems.value.includes(itemId);
    };
    const modalKey = ref(0);
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
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    const handleConfirm = (formData) => {
      if (isDeleteAction.value) {
        router.delete(route("shop.destroy", selectedItem.value.id), {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: () => closeModal()
        });
      } else {
        if (selectedItem.value) {
          router.put(route("shop.update", selectedItem.value.id), formData, {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: () => {
              closeModal();
              selectedItem.value = null;
            }
          });
        } else {
          router.post(route("shop.create"), formData, {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: () => {
              closeModal();
              selectedItem.value = null;
            }
          });
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900 p-6 rounded-lg" }, _attrs))} data-v-f3ab5158><h1 class="text-3xl font-bold text-white mb-6 flex items-center" data-v-f3ab5158><span class="mr-2" data-v-f3ab5158>Магазин</span><span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300" data-v-f3ab5158>${ssrInterpolate(__props.shopItems.total)} товаров</span></h1><div class="mb-6 flex justify-between items-center gap-4" data-v-f3ab5158><div class="relative w-1/3" data-v-f3ab5158><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-f3ab5158><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-f3ab5158></path></svg></div><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по названию..." class="w-full bg-gray-800 text-white pl-10 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder-gray-500" data-v-f3ab5158></div><div class="flex items-center gap-3" data-v-f3ab5158>`);
      if (selectedItems.value.length > 0) {
        _push(`<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center gap-2" data-v-f3ab5158><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-f3ab5158></path></svg> Копировать (${ssrInterpolate(selectedItems.value.length)}) </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition flex items-center gap-2" data-v-f3ab5158><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-f3ab5158></path></svg> Создать </button></div></div><div class="mb-6 flex justify-between items-center" data-v-f3ab5158><div class="flex gap-3" data-v-f3ab5158><div class="relative" data-v-f3ab5158><select class="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500" data-v-f3ab5158><option value="" data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, "") : ssrLooseEqual(selectedCategory.value, "")) ? " selected" : ""}>Все категории</option><!--[-->`);
      ssrRenderList(__props.categories, (category) => {
        _push(`<option${ssrRenderAttr("value", category.id)} data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, category.id) : ssrLooseEqual(selectedCategory.value, category.id)) ? " selected" : ""}>${ssrInterpolate(category.name)}</option>`);
      });
      _push(`<!--]--></select><div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" data-v-f3ab5158><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f3ab5158></path></svg></div></div><div class="relative" data-v-f3ab5158><select class="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500" data-v-f3ab5158><option value="" data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(selectedServer.value) ? ssrLooseContain(selectedServer.value, "") : ssrLooseEqual(selectedServer.value, "")) ? " selected" : ""}>Все серверы</option><!--[-->`);
      ssrRenderList(__props.servers, (server) => {
        _push(`<option${ssrRenderAttr("value", server.id)} data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(selectedServer.value) ? ssrLooseContain(selectedServer.value, server.id) : ssrLooseEqual(selectedServer.value, server.id)) ? " selected" : ""}>${ssrInterpolate(server.ip)}</option>`);
      });
      _push(`<!--]--></select><div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" data-v-f3ab5158><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f3ab5158></path></svg></div></div></div>`);
      if (selectedItems.value.length > 0) {
        _push(`<div class="flex items-center gap-2" data-v-f3ab5158><button class="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm" data-v-f3ab5158> Очистить выбор </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-gray-800 p-5 rounded-lg shadow-lg" data-v-f3ab5158><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5" data-v-f3ab5158><!--[-->`);
      ssrRenderList(__props.shopItems.data, (item) => {
        _push(`<div class="${ssrRenderClass([
          "relative bg-gray-700 rounded-lg overflow-hidden transition-all duration-200",
          "hover:shadow-lg hover:transform hover:scale-[1.02]",
          isItemSelected(item.id) ? "ring-2 ring-blue-500" : ""
        ])}" data-v-f3ab5158><div class="absolute top-2 right-2 z-10" data-v-f3ab5158><input type="checkbox"${ssrRenderAttr("id", `select-item-${item.id}`)}${ssrIncludeBooleanAttr(isItemSelected(item.id)) ? " checked" : ""} class="w-4 h-4 accent-blue-500" data-v-f3ab5158></div><div class="cursor-pointer" data-v-f3ab5158><div class="h-40 overflow-hidden" data-v-f3ab5158><img${ssrRenderAttr("src", item.image)} alt="item" class="w-full h-full object-cover transition-transform hover:scale-110" data-v-f3ab5158></div><div class="p-4" data-v-f3ab5158><h3 class="text-sm font-semibold text-white truncate" data-v-f3ab5158>${ssrInterpolate(item.name)}</h3><div class="flex justify-between items-center mt-2" data-v-f3ab5158><p class="text-sm font-bold text-green-400" data-v-f3ab5158>${ssrInterpolate(item.price)} ₽</p><span class="text-xs bg-gray-600 px-2 py-1 rounded-full text-gray-300" data-v-f3ab5158>${ssrInterpolate(getCategoryName(item.category_id))}</span></div></div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (__props.shopItems.data.length === 0) {
        _push(`<div class="text-center p-8 text-gray-400" data-v-f3ab5158><svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4M8 16l-4-4 4-4M16 16l4-4-4-4" data-v-f3ab5158></path></svg><p class="text-xl" data-v-f3ab5158>Товары не найдены</p><p class="mt-2" data-v-f3ab5158>Попробуйте изменить параметры поиска или создайте новый товар</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 flex justify-center items-center" data-v-f3ab5158><div class="inline-flex rounded-md shadow-sm" data-v-f3ab5158><!--[-->`);
      ssrRenderList(__props.shopItems.links, (link) => {
        _push(ssrRenderComponent(unref(Link), {
          key: link.label,
          href: link.url,
          class: [
            "px-4 py-2 border border-gray-700",
            link.active ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700",
            !link.url && "cursor-not-allowed opacity-50",
            "transition-all duration-200"
          ]
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(ShopItemModal, {
        key: modalKey.value,
        isOpen: isModalOpen.value,
        title: modalTitle.value,
        confirmText: modalConfirmText.value,
        selectedItem: selectedItem.value,
        categories: __props.categories,
        servers: __props.servers,
        isDeleteAction: isDeleteAction.value,
        onClose: closeModal,
        onConfirm: handleConfirm,
        onDelete: openDeleteConfirmation
      }, null, _parent));
      if (isCopyModalOpen.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-f3ab5158><div class="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full" data-v-f3ab5158><h2 class="text-xl font-bold text-white mb-4" data-v-f3ab5158>Копирование товаров</h2><p class="text-gray-300 mb-4" data-v-f3ab5158> Выбрано ${ssrInterpolate(selectedItems.value.length)} товаров для копирования. Выберите сервер назначения: </p><div class="mb-4" data-v-f3ab5158><label class="block text-gray-300 mb-2" data-v-f3ab5158>Сервер назначения</label><div class="relative" data-v-f3ab5158><select class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500" data-v-f3ab5158><option value="" disabled data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(targetServerId.value) ? ssrLooseContain(targetServerId.value, "") : ssrLooseEqual(targetServerId.value, "")) ? " selected" : ""}>Выберите сервер</option><!--[-->`);
        ssrRenderList(__props.servers, (server) => {
          _push(`<option${ssrRenderAttr("value", server.id)} data-v-f3ab5158${ssrIncludeBooleanAttr(Array.isArray(targetServerId.value) ? ssrLooseContain(targetServerId.value, server.id) : ssrLooseEqual(targetServerId.value, server.id)) ? " selected" : ""}>${ssrInterpolate(server.ip)}</option>`);
        });
        _push(`<!--]--></select><div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" data-v-f3ab5158><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-f3ab5158><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f3ab5158></path></svg></div></div></div><div class="flex justify-end gap-3 mt-6" data-v-f3ab5158><button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition" data-v-f3ab5158> Отмена </button><button${ssrIncludeBooleanAttr(!targetServerId.value) ? " disabled" : ""} class="${ssrRenderClass([
          "px-4 py-2 text-white rounded-lg transition",
          targetServerId.value ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-500 cursor-not-allowed"
        ])}" data-v-f3ab5158> Скопировать </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/shop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const shop = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f3ab5158"]]);
export {
  shop as default
};
