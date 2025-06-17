import { ref, unref, withCtx, createVNode, withDirectives, vModelText, vModelSelect, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { R as ReusableModal } from "./MainModal-yQIB2i_G.js";
import { _ as _sfc_main$1 } from "./Dashboard-fXrpRFWF.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@heroicons/vue/24/outline";
const __default__ = {
  layout: _sfc_main$1
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "categories",
  __ssrInlineRender: true,
  props: {
    categories: Object,
    filters: Object
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search || "");
    const editCategory = ref({ zid: "", name: "", visible: true, "icon": "" });
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
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
            onSuccess: closeModal
          }
        );
      } else {
        router.post(
          route("categories.store"),
          editCategory.value,
          {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: closeModal
          }
        );
      }
    };
    const deleteCategory = () => {
      router.delete(
        route("categories.destroy", editCategory.value.id),
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Категории</h1><div class="mb-4 flex justify-between items-center"><div class="relative w-1/3"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по названию..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></div><button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"> Создать </button></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">ID</th><th class="px-4 py-2 text-left">Название</th><th class="px-4 py-2 text-left">Видимость</th><th class="px-4 py-2 text-left">Действия</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.categories.data, (category) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition"><td class="px-4 py-2">${ssrInterpolate(category.id)}</td><td class="px-4 py-2">${ssrInterpolate(category.name)}</td><td class="px-4 py-2">${ssrInterpolate(category.visible ? "Видимая" : "Скрытая")}</td><td class="px-4 py-2 flex space-x-2"><button class="text-blue-400 hover:text-blue-300"> Редактировать </button><button class="text-red-400 hover:text-red-300"> Удалить </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(__props.categories.links, (link) => {
        _push(ssrRenderComponent(unref(Link), {
          key: link.label,
          href: link.url,
          class: [[
            "px-4 py-2 rounded-md",
            link.active ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500",
            !link.url && "cursor-not-allowed opacity-50"
          ], "transition-all duration-200"]
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showEditModal.value,
        title: editCategory.value.id ? "Редактирование категории" : "Создание категории",
        confirmText: "Сохранить",
        onClose: closeModal,
        onConfirm: saveChanges
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label for="name" class="block mb-2 text-white"${_scopeId}>Название</label><input${ssrRenderAttr("value", editCategory.value.name)} type="text" id="name" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="zid" class="block mb-2 text-white"${_scopeId}>ZID</label><input${ssrRenderAttr("value", editCategory.value.zid)} type="text" id="zid" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="Icon" class="block mb-2 text-white"${_scopeId}>Icon</label><input${ssrRenderAttr("value", editCategory.value.icon)} type="text" id="icon" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="visible" class="block mb-2 text-white"${_scopeId}>Видимость</label><select id="visible" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><option${ssrRenderAttr("value", true)}${ssrIncludeBooleanAttr(Array.isArray(editCategory.value.visible) ? ssrLooseContain(editCategory.value.visible, true) : ssrLooseEqual(editCategory.value.visible, true)) ? " selected" : ""}${_scopeId}>Видимая</option><option${ssrRenderAttr("value", false)}${ssrIncludeBooleanAttr(Array.isArray(editCategory.value.visible) ? ssrLooseContain(editCategory.value.visible, false) : ssrLooseEqual(editCategory.value.visible, false)) ? " selected" : ""}${_scopeId}>Скрытая</option></select>`);
          } else {
            return [
              createVNode("label", {
                for: "name",
                class: "block mb-2 text-white"
              }, "Название"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editCategory.value.name = $event,
                type: "text",
                id: "name",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editCategory.value.name]
              ]),
              createVNode("label", {
                for: "zid",
                class: "block mb-2 text-white"
              }, "ZID"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editCategory.value.zid = $event,
                type: "text",
                id: "zid",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editCategory.value.zid]
              ]),
              createVNode("label", {
                for: "Icon",
                class: "block mb-2 text-white"
              }, "Icon"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editCategory.value.icon = $event,
                type: "text",
                id: "icon",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editCategory.value.icon]
              ]),
              createVNode("label", {
                for: "visible",
                class: "block mb-2 text-white"
              }, "Видимость"),
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => editCategory.value.visible = $event,
                id: "visible",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, [
                createVNode("option", { value: true }, "Видимая"),
                createVNode("option", { value: false }, "Скрытая")
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, editCategory.value.visible]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showDeleteModal.value,
        title: "Удаление категории",
        confirmText: "Удалить",
        onClose: closeModal,
        onConfirm: deleteCategory
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-white"${_scopeId}> Вы уверены, что хотите удалить категорию <b${_scopeId}>${ssrInterpolate(editCategory.value.name)}</b>? </div>`);
          } else {
            return [
              createVNode("div", { class: "text-white" }, [
                createTextVNode(" Вы уверены, что хотите удалить категорию "),
                createVNode("b", null, toDisplayString(editCategory.value.name), 1),
                createTextVNode("? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
