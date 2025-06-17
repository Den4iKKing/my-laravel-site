import { ref, unref, withCtx, createVNode, withDirectives, vModelText, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./Dashboard-fXrpRFWF.js";
import { Link, router } from "@inertiajs/vue3";
import { R as ReusableModal } from "./MainModal-yQIB2i_G.js";
import "@heroicons/vue/24/outline";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const __default__ = {
  layout: _sfc_main$1
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "bonuses",
  __ssrInlineRender: true,
  props: {
    bonuses: Object,
    filters: Object
  },
  setup(__props) {
    var _a, _b;
    const props = __props;
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const editBonus = ref({ min_amount: "", bonus_percent: "" });
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const closeModal = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
    };
    const csrfToken = (_b = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _b.getAttribute("content");
    const saveChanges = () => {
      if (editBonus.value.id) {
        router.put(
          `/admin/payment_bonuses/${editBonus.value.id}`,
          editBonus.value,
          {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: closeModal
          }
        );
      } else {
        router.post(
          "/admin/payment_bonuses",
          editBonus.value,
          {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: closeModal
          }
        );
      }
    };
    const deleteBonus = () => {
      router.delete(
        `/admin/payment_bonuses/${editBonus.value.id}`,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Настройки бонусов</h1><div class="mb-4 flex justify-between items-center"><div class="relative w-1/3"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по минимальной сумме..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></div><button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"> Создать </button></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">Мин. сумма</th><th class="px-4 py-2 text-left">Процент бонуса</th><th class="px-4 py-2 text-left">Действия</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.bonuses.data, (bonus) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition"><td class="px-4 py-2">${ssrInterpolate(bonus.min_amount)}</td><td class="px-4 py-2">${ssrInterpolate(bonus.bonus_percent)}%</td><td class="px-4 py-2 flex space-x-2"><button class="text-blue-400 hover:text-blue-300"> Редактировать </button><button class="text-red-400 hover:text-red-300"> Удалить </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(__props.bonuses.links, (link) => {
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
        "is-open": showEditModal.value,
        title: editBonus.value.id ? "Редактирование бонуса" : "Создание бонуса",
        "confirm-text": "Сохранить",
        onClose: closeModal,
        onConfirm: saveChanges
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label for="min_amount" class="block mb-2 text-white"${_scopeId}>Минимальная сумма</label><input${ssrRenderAttr("value", editBonus.value.min_amount)} type="number" id="min_amount" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="bonus_percent" class="block mb-2 text-white"${_scopeId}>Процент бонуса</label><input${ssrRenderAttr("value", editBonus.value.bonus_percent)} type="number" id="bonus_percent" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}>`);
          } else {
            return [
              createVNode("label", {
                for: "min_amount",
                class: "block mb-2 text-white"
              }, "Минимальная сумма"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editBonus.value.min_amount = $event,
                type: "number",
                id: "min_amount",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editBonus.value.min_amount]
              ]),
              createVNode("label", {
                for: "bonus_percent",
                class: "block mb-2 text-white"
              }, "Процент бонуса"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editBonus.value.bonus_percent = $event,
                type: "number",
                id: "bonus_percent",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editBonus.value.bonus_percent]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        "is-open": showDeleteModal.value,
        title: "Удаление бонуса",
        "confirm-text": "Удалить",
        onClose: closeModal,
        onConfirm: deleteBonus
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-white"${_scopeId}> Вы уверены, что хотите удалить бонус с минимальной суммой <b${_scopeId}>${ssrInterpolate(editBonus.value.min_amount)}</b>? </div>`);
          } else {
            return [
              createVNode("div", { class: "text-white" }, [
                createTextVNode(" Вы уверены, что хотите удалить бонус с минимальной суммой "),
                createVNode("b", null, toDisplayString(editBonus.value.min_amount), 1),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/bonuses.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
