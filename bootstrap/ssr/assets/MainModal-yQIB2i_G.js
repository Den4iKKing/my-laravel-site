import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "MainModal",
  __ssrInlineRender: true,
  props: {
    isOpen: Boolean,
    title: { type: String, default: "Подтвердите действие" },
    confirmText: { type: String, default: "Подтвердить" }
  },
  emits: ["close", "confirm"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" }, _attrs))} data-v-0fcb0448><div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[95vh] overflow-auto relative" data-v-0fcb0448><h3 class="text-xl font-semibold text-white mb-4" data-v-0fcb0448>${ssrInterpolate(__props.title)}</h3><div class="text-white" data-v-0fcb0448>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div><div class="mt-4 flex justify-end space-x-2" data-v-0fcb0448><button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500" data-v-0fcb0448> Отмена </button><button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500" data-v-0fcb0448>${ssrInterpolate(__props.confirmText)}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dashboard/MainModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReusableModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0fcb0448"]]);
export {
  ReusableModal as R
};
