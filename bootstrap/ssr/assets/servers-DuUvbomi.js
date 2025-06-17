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
  __name: "servers",
  __ssrInlineRender: true,
  props: {
    servers: Object,
    filters: Object
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search || "");
    const editServer = ref({ name: "", ip: "", zid: "", game_port: "", query_port: "", visible: true });
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
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
            onSuccess: closeModal
          }
        );
      } else {
        router.post(
          route("servers.store"),
          editServer.value,
          {
            headers: { "X-CSRF-TOKEN": csrfToken },
            onSuccess: closeModal
          }
        );
      }
    };
    const deleteServer = () => {
      router.delete(
        route("servers.destroy", editServer.value.id),
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Сервера</h1><div class="mb-4 flex justify-between items-center"><div class="relative w-1/3"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по названию или IP..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></div><button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"> Создать </button></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">ID</th><th class="px-4 py-2 text-left">Имя</th><th class="px-4 py-2 text-left">IP</th><th class="px-4 py-2 text-left">Game Port</th><th class="px-4 py-2 text-left">Query Port</th><th class="px-4 py-2 text-left">Действия</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.servers.data, (server) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition"><td class="px-4 py-2">${ssrInterpolate(server.id)}</td><td class="px-4 py-2">${ssrInterpolate(server.name)}</td><td class="px-4 py-2">${ssrInterpolate(server.ip)}</td><td class="px-4 py-2">${ssrInterpolate(server.game_port)}</td><td class="px-4 py-2">${ssrInterpolate(server.query_port)}</td><td class="px-4 py-2 flex space-x-2"><button class="text-blue-400 hover:text-blue-300"> Редактировать </button><button class="text-red-400 hover:text-red-300"> Удалить </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(__props.servers.links, (link) => {
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
        title: editServer.value.id ? "Редактирование сервера" : "Создание сервера",
        confirmText: "Сохранить",
        onClose: closeModal,
        onConfirm: saveChanges
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label for="name" class="block mb-2 text-white"${_scopeId}>Имя</label><input${ssrRenderAttr("value", editServer.value.name)} type="text" id="name" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="ip" class="block mb-2 text-white"${_scopeId}>IP</label><input${ssrRenderAttr("value", editServer.value.ip)} type="text" id="ip" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="game_port" class="block mb-2 text-white"${_scopeId}>Game Port</label><input${ssrRenderAttr("value", editServer.value.game_port)} type="number" id="game_port" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="query_port" class="block mb-2 text-white"${_scopeId}>Query Port</label><input${ssrRenderAttr("value", editServer.value.query_port)} type="number" id="query_port" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="zid" class="block mb-2 text-white"${_scopeId}>ZID</label><input${ssrRenderAttr("value", editServer.value.zid)} type="number" id="zid" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><label for="visible" class="block mb-2 text-white"${_scopeId}>Видимость</label><select id="visible" class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"${_scopeId}><option${ssrRenderAttr("value", true)}${ssrIncludeBooleanAttr(Array.isArray(editServer.value.visible) ? ssrLooseContain(editServer.value.visible, true) : ssrLooseEqual(editServer.value.visible, true)) ? " selected" : ""}${_scopeId}>Видимый</option><option${ssrRenderAttr("value", false)}${ssrIncludeBooleanAttr(Array.isArray(editServer.value.visible) ? ssrLooseContain(editServer.value.visible, false) : ssrLooseEqual(editServer.value.visible, false)) ? " selected" : ""}${_scopeId}>Скрытый</option></select>`);
          } else {
            return [
              createVNode("label", {
                for: "name",
                class: "block mb-2 text-white"
              }, "Имя"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editServer.value.name = $event,
                type: "text",
                id: "name",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editServer.value.name]
              ]),
              createVNode("label", {
                for: "ip",
                class: "block mb-2 text-white"
              }, "IP"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editServer.value.ip = $event,
                type: "text",
                id: "ip",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editServer.value.ip]
              ]),
              createVNode("label", {
                for: "game_port",
                class: "block mb-2 text-white"
              }, "Game Port"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editServer.value.game_port = $event,
                type: "number",
                id: "game_port",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editServer.value.game_port]
              ]),
              createVNode("label", {
                for: "query_port",
                class: "block mb-2 text-white"
              }, "Query Port"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editServer.value.query_port = $event,
                type: "number",
                id: "query_port",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editServer.value.query_port]
              ]),
              createVNode("label", {
                for: "zid",
                class: "block mb-2 text-white"
              }, "ZID"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => editServer.value.zid = $event,
                type: "number",
                id: "zid",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, editServer.value.zid]
              ]),
              createVNode("label", {
                for: "visible",
                class: "block mb-2 text-white"
              }, "Видимость"),
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => editServer.value.visible = $event,
                id: "visible",
                class: "w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none"
              }, [
                createVNode("option", { value: true }, "Видимый"),
                createVNode("option", { value: false }, "Скрытый")
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, editServer.value.visible]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showDeleteModal.value,
        title: "Удаление сервера",
        confirmText: "Удалить",
        onClose: closeModal,
        onConfirm: deleteServer
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-white"${_scopeId}> Вы уверены, что хотите удалить сервер <b${_scopeId}>${ssrInterpolate(editServer.value.name)}</b>? </div>`);
          } else {
            return [
              createVNode("div", { class: "text-white" }, [
                createTextVNode(" Вы уверены, что хотите удалить сервер "),
                createVNode("b", null, toDisplayString(editServer.value.name), 1),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/servers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
