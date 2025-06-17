import { ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { Squares2X2Icon, UserGroupIcon, GiftIcon, SparklesIcon, CubeIcon, ChevronDownIcon, TagIcon, FolderIcon, ServerIcon } from "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const isActive = (route) => window.location.pathname === route;
    const isShopDropdownOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex bg-gray-900 min-h-screen font-sans" }, _attrs))}><div class="w-64 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg p-6 flex flex-col"><div class="mb-4"><span class="text-gray-400 text-xs font-medium uppercase tracking-wider">Управление</span></div><nav class="space-y-1 flex-1">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin",
        class: ["flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60", { "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400": isActive("/admin") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Squares2X2Icon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Статистика</span>`);
          } else {
            return [
              createVNode(unref(Squares2X2Icon), { class: "w-5 h-5 mr-3 flex-shrink-0" }),
              createVNode("span", null, "Статистика")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/users",
        class: ["flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60", { "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400": isActive("/admin/users") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(UserGroupIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Пользователи</span>`);
          } else {
            return [
              createVNode(unref(UserGroupIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }),
              createVNode("span", null, "Пользователи")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/promocodes",
        class: ["flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60", { "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400": isActive("/admin/promocodes") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(GiftIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Промокоды</span>`);
          } else {
            return [
              createVNode(unref(GiftIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }),
              createVNode("span", null, "Промокоды")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/logs",
        class: ["flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60", { "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400": isActive("/logs") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(GiftIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>История</span>`);
          } else {
            return [
              createVNode(unref(GiftIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }),
              createVNode("span", null, "История")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/payment_bonuses",
        class: ["flex items-center text-gray-300 hover:text-white p-3 rounded-md ease-in-out hover:bg-gray-700/60", { "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400": isActive("/admin/payment_bonuses") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SparklesIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Бонусы</span>`);
          } else {
            return [
              createVNode(unref(SparklesIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }),
              createVNode("span", null, "Бонусы")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="py-2"><div class="h-px w-full bg-gray-700/50"></div></div><div><div class="${ssrRenderClass([{ "bg-blue-600/10 text-blue-300": isShopDropdownOpen.value }, "flex items-center justify-between text-gray-300 hover:text-white p-3 rounded-md cursor-pointer ease-in-out hover:bg-gray-700/60"])}"><div class="flex items-center">`);
      _push(ssrRenderComponent(unref(CubeIcon), { class: "w-5 h-5 mr-3 flex-shrink-0" }, null, _parent));
      _push(`<span>Магазин</span></div>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), {
        class: [{ "rotate-180": isShopDropdownOpen.value }, "w-5 h-5 transition-transform duration-300"]
      }, null, _parent));
      _push(`</div><div style="${ssrRenderStyle(isShopDropdownOpen.value ? null : { display: "none" })}" class="overflow-hidden transition-all duration-300 mt-1"><div class="pl-4 space-y-1 border-l border-gray-700 ml-3">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/shop",
        class: ["flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none", { "text-blue-400": isActive("/admin/shop") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TagIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Предметы</span>`);
          } else {
            return [
              createVNode(unref(TagIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }),
              createVNode("span", null, "Предметы")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/shop/categories",
        class: ["flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none", { "text-blue-400": isActive("/admin/shop/categories") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(FolderIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Категории</span>`);
          } else {
            return [
              createVNode(unref(FolderIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }),
              createVNode("span", null, "Категории")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/servers",
        class: ["flex items-center text-gray-300 hover:text-white p-2 pl-4 rounded-md text-sm ease-in-out hover:bg-gray-700/40 focus:outline-none", { "text-blue-400": isActive("/admin/servers") }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ServerIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Сервера</span>`);
          } else {
            return [
              createVNode(unref(ServerIcon), { class: "w-4 h-4 mr-2 flex-shrink-0" }),
              createVNode("span", null, "Сервера")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></nav><div class="mt-6 p-3 bg-gray-800/60 rounded-lg"><div class="flex items-center"><div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium"> A </div><div class="ml-3"><p class="text-white text-sm font-medium">Администратор</p><p class="text-gray-400 text-xs">Онлайн</p></div></div></div></div><div class="flex-1 overflow-hidden"><div class="p-6 overflow-auto max-h-[calc(107vh-64px)]">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
