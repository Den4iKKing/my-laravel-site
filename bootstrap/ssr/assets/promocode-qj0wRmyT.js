import { ref, unref, withCtx, createVNode, withDirectives, vModelText, vModelSelect, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./Dashboard-fXrpRFWF.js";
import { Link, router } from "@inertiajs/vue3";
import { R as ReusableModal } from "./MainModal-yQIB2i_G.js";
import "@heroicons/vue/24/outline";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const __default__ = {
  layout: _sfc_main$1
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "promocode",
  __ssrInlineRender: true,
  props: {
    promocodes: Object,
    filters: Object
  },
  setup(__props) {
    const props = __props;
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
            onSuccess: closeModal
          }
        );
      } else {
        router.post(
          route("promocodes.store"),
          editPromo.value,
          {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: closeModal
          }
        );
      }
    };
    const deletePromo = () => {
      router.delete(
        route("promocodes.destroy", editPromo.value.id),
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Промокоды</h1><div class="mb-4 flex justify-between items-center"><div class="relative w-1/3"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по коду..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></div><button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"> Создать </button></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">ID</th><th class="px-4 py-2 text-left">Код</th><th class="px-4 py-2 text-left">Тип</th><th class="px-4 py-2 text-left">Значение</th><th class="px-4 py-2 text-left">Макс. использований</th><th class="px-4 py-2 text-left">Использовано</th><th class="px-4 py-2 text-left">Действия</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.promocodes.data, (promo) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition"><td class="px-4 py-2">${ssrInterpolate(promo.id)}</td><td class="px-4 py-2">${ssrInterpolate(promo.code)}</td><td class="px-4 py-2">${ssrInterpolate(promo.type)}</td><td class="px-4 py-2">${ssrInterpolate(promo.value)}</td><td class="px-4 py-2">${ssrInterpolate(promo.max_uses)}</td><td class="px-4 py-2">${ssrInterpolate(promo.used)}</td><td class="px-4 py-2 flex space-x-2"><button class="text-blue-400 hover:text-blue-300"> Редактировать </button><button class="text-red-400 hover:text-red-300"> Удалить </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(__props.promocodes.links, (link) => {
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
        title: editPromo.value.id ? "Редактирование промокода" : "Создание промокода",
        confirmText: "Сохранить",
        onClose: closeModal,
        onConfirm: saveChanges
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label for="code" class="block mb-2 text-white"${_scopeId}>Код</label><input${ssrRenderAttr("value", editPromo.value.code)} type="text" id="code" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="type" class="block mb-2 text-white"${_scopeId}>Тип</label><select id="type" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><option value="bonus_balance"${ssrIncludeBooleanAttr(Array.isArray(editPromo.value.type) ? ssrLooseContain(editPromo.value.type, "bonus_balance") : ssrLooseEqual(editPromo.value.type, "bonus_balance")) ? " selected" : ""}${_scopeId}>Бонусный баланс</option><option value="deposit_bonus"${ssrIncludeBooleanAttr(Array.isArray(editPromo.value.type) ? ssrLooseContain(editPromo.value.type, "deposit_bonus") : ssrLooseEqual(editPromo.value.type, "deposit_bonus")) ? " selected" : ""}${_scopeId}>Бонус на депозит</option></select><label for="value" class="block mb-2 text-white"${_scopeId}>Значение</label><input${ssrRenderAttr("value", editPromo.value.value)} type="number" step="0.01" id="value" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="max_uses" class="block mb-2 text-white"${_scopeId}>Максимум использований</label><input${ssrRenderAttr("value", editPromo.value.max_uses)} type="number" id="max_uses" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="used" class="block mb-2 text-white"${_scopeId}>Использовано</label><input${ssrRenderAttr("value", editPromo.value.used)} type="number" id="used" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}>`);
          } else {
            return [
              createVNode("label", {
                for: "code",
                class: "block mb-2 text-white"
              }, "Код"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editPromo.value.code = $event,
                type: "text",
                id: "code",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editPromo.value.code]
              ]),
              createVNode("label", {
                for: "type",
                class: "block mb-2 text-white"
              }, "Тип"),
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => editPromo.value.type = $event,
                id: "type",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, [
                createVNode("option", { value: "bonus_balance" }, "Бонусный баланс"),
                createVNode("option", { value: "deposit_bonus" }, "Бонус на депозит")
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, editPromo.value.type]
              ]),
              createVNode("label", {
                for: "value",
                class: "block mb-2 text-white"
              }, "Значение"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editPromo.value.value = $event,
                type: "number",
                step: "0.01",
                id: "value",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editPromo.value.value]
              ]),
              createVNode("label", {
                for: "max_uses",
                class: "block mb-2 text-white"
              }, "Максимум использований"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editPromo.value.max_uses = $event,
                type: "number",
                id: "max_uses",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editPromo.value.max_uses]
              ]),
              createVNode("label", {
                for: "used",
                class: "block mb-2 text-white"
              }, "Использовано"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editPromo.value.used = $event,
                type: "number",
                id: "used",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editPromo.value.used]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showDeleteModal.value,
        title: "Удаление промокода",
        confirmText: "Удалить",
        onClose: closeModal,
        onConfirm: deletePromo
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-white"${_scopeId}> Вы уверены, что хотите удалить промокод <b${_scopeId}>${ssrInterpolate(editPromo.value.code)}</b>? </div>`);
          } else {
            return [
              createVNode("div", { class: "text-white" }, [
                createTextVNode(" Вы уверены, что хотите удалить промокод "),
                createVNode("b", null, toDisplayString(editPromo.value.code), 1),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/promocode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
