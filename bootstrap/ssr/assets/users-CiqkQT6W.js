import { ref, unref, withCtx, createVNode, withDirectives, vModelText, vModelSelect, createBlock, openBlock, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { R as ReusableModal } from "./MainModal-yQIB2i_G.js";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import { _ as _sfc_main$1 } from "./Dashboard-fXrpRFWF.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const __default__ = {
  layout: _sfc_main$1
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "users",
  __ssrInlineRender: true,
  props: {
    users: Object,
    filters: Object
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search || "");
    const editUser = ref({});
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const showPurchaseHistoryModal = ref(false);
    const showCartModal = ref(false);
    const purchaseHistory = ref([]);
    const userCart = ref(null);
    const isLoadingHistory = ref(false);
    const isLoadingCart = ref(false);
    ref([]);
    const selectedServer = ref(null);
    const loadUserCart = async () => {
      if (!selectedServer.value) return;
      isLoadingCart.value = true;
      try {
        const response = await axios.get(route("users.cart", {
          user: editUser.value.id,
          server: 1
        }));
        userCart.value = response.data.cart;
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
        userCart.value = { items: [] };
      } finally {
        isLoadingCart.value = false;
      }
    };
    const removeFromCart = async (cartItemId) => {
      if (!confirm("Вы уверены, что хотите удалить этот предмет из корзины?")) return;
      try {
        await axios.delete(route("users.cart.remove", {
          user: editUser.value.id,
          server: 1,
          item: cartItemId
        }));
        await loadUserCart();
      } catch (error) {
        console.error("Ошибка при удалении предмета из корзины:", error);
      }
    };
    const closeModal = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
      showPurchaseHistoryModal.value = false;
      showCartModal.value = false;
      purchaseHistory.value = [];
      userCart.value = null;
    };
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    const saveChanges = () => {
      router.put(
        route("users.update", editUser.value.id),
        editUser.value,
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    const deleteUser = () => {
      router.delete(
        route("users.destroy", editUser.value.id),
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          onSuccess: closeModal
        }
      );
    };
    const roleBadgeClass = (role) => {
      switch (role) {
        case "Admin":
          return "bg-red-500 text-white";
        default:
          return "bg-green-500 text-white";
      }
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Пользователи</h1><div class="mb-4 flex justify-between items-center"><div class="relative w-1/3"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Поиск по Name..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute right-2 top-2 w-5 h-5 text-gray-400" }, null, _parent));
      _push(`</div></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">Игрок</th><th class="px-4 py-2 text-left">SteamID</th><th class="px-4 py-2 text-left">Баланс</th><th class="px-4 py-2 text-left">Группа</th><th class="px-4 py-2 text-left">Действия</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.users.data, (user) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"><td class="px-4 py-2 flex items-center"><img${ssrRenderAttr("src", user.avatar)} alt="avatar" class="w-8 h-8 rounded-full mr-3"><span>${ssrInterpolate(user.name)}</span></td><td class="px-4 py-2">${ssrInterpolate(user.steamid)}</td><td class="px-4 py-2">${ssrInterpolate(user.balance)} ₽</td><td class="px-4 py-2"><span class="${ssrRenderClass([roleBadgeClass(user.group), "inline-block px-3 py-1 rounded-full text-xs font-semibold"])}">${ssrInterpolate(user.group)}</span></td><td class="px-4 py-2 flex space-x-2"><button class="text-blue-400 hover:text-blue-300">Редактировать</button><button class="text-yellow-400 hover:text-yellow-300">История</button><button class="text-green-400 hover:text-green-300">Корзина</button><button class="text-red-400 hover:text-red-300">Удалить</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(__props.users.links, (link) => {
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
        title: "Редактирование пользователя",
        confirmText: "Сохранить",
        onClose: closeModal,
        onConfirm: saveChanges
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="text-white block mb-2"${_scopeId}>Баланс:</label><input${ssrRenderAttr("value", editUser.value.balance)} type="number" class="w-full p-2 rounded bg-gray-700 text-white"${_scopeId}></div><div${_scopeId}><label class="text-white block mb-2"${_scopeId}>Бонусный баланс:</label><input${ssrRenderAttr("value", editUser.value.bonus_balance)} type="number" class="w-full p-2 rounded bg-gray-700 text-white"${_scopeId}></div><div${_scopeId}><label class="text-white block mb-2"${_scopeId}>Группа:</label><select class="w-full p-2 rounded bg-gray-700 text-white"${_scopeId}><option value="user"${ssrIncludeBooleanAttr(Array.isArray(editUser.value.group) ? ssrLooseContain(editUser.value.group, "user") : ssrLooseEqual(editUser.value.group, "user")) ? " selected" : ""}${_scopeId}>Пользователь</option><option value="Admin"${ssrIncludeBooleanAttr(Array.isArray(editUser.value.group) ? ssrLooseContain(editUser.value.group, "Admin") : ssrLooseEqual(editUser.value.group, "Admin")) ? " selected" : ""}${_scopeId}>Администратор</option></select></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", null, [
                  createVNode("label", { class: "text-white block mb-2" }, "Баланс:"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => editUser.value.balance = $event,
                    type: "number",
                    class: "w-full p-2 rounded bg-gray-700 text-white"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, editUser.value.balance]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "text-white block mb-2" }, "Бонусный баланс:"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => editUser.value.bonus_balance = $event,
                    type: "number",
                    class: "w-full p-2 rounded bg-gray-700 text-white"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, editUser.value.bonus_balance]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "text-white block mb-2" }, "Группа:"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => editUser.value.group = $event,
                    class: "w-full p-2 rounded bg-gray-700 text-white"
                  }, [
                    createVNode("option", { value: "user" }, "Пользователь"),
                    createVNode("option", { value: "Admin" }, "Администратор")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, editUser.value.group]
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showPurchaseHistoryModal.value,
        title: "История покупок",
        confirmText: "Закрыть",
        onClose: closeModal,
        onConfirm: closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (purchaseHistory.value.length) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="max-h-96 overflow-y-auto"${_scopeId}><table class="w-full table-auto text-white"${_scopeId}><thead class="sticky top-0 bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-4 py-2 text-left"${_scopeId}>Предмет</th><th class="px-4 py-2 text-left"${_scopeId}>Цена</th><th class="px-4 py-2 text-left"${_scopeId}>Дата</th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(purchaseHistory.value, (purchase) => {
                _push2(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"${_scopeId}><td class="px-4 py-2"${_scopeId}>${ssrInterpolate(purchase.item_name)}</td><td class="px-4 py-2"${_scopeId}>${ssrInterpolate(purchase.price)} ₽</td><td class="px-4 py-2"${_scopeId}>${ssrInterpolate(formatDate(purchase.created_at))}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
              if (isLoadingHistory.value) {
                _push2(`<div class="flex justify-center py-4"${_scopeId}><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"${_scopeId}></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (isLoadingHistory.value) {
              _push2(`<div class="flex justify-center py-4"${_scopeId}><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"${_scopeId}></div></div>`);
            } else {
              _push2(`<div class="text-white text-center py-4"${_scopeId}> У пользователя нет истории покупок </div>`);
            }
          } else {
            return [
              purchaseHistory.value.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "max-h-96 overflow-y-auto" }, [
                  createVNode("table", { class: "w-full table-auto text-white" }, [
                    createVNode("thead", { class: "sticky top-0 bg-gray-800" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-4 py-2 text-left" }, "Предмет"),
                        createVNode("th", { class: "px-4 py-2 text-left" }, "Цена"),
                        createVNode("th", { class: "px-4 py-2 text-left" }, "Дата")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(purchaseHistory.value, (purchase) => {
                        return openBlock(), createBlock("tr", {
                          key: purchase.id,
                          class: "border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"
                        }, [
                          createVNode("td", { class: "px-4 py-2" }, toDisplayString(purchase.item_name), 1),
                          createVNode("td", { class: "px-4 py-2" }, toDisplayString(purchase.price) + " ₽", 1),
                          createVNode("td", { class: "px-4 py-2" }, toDisplayString(formatDate(purchase.created_at)), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ]),
                isLoadingHistory.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex justify-center py-4"
                }, [
                  createVNode("div", { class: "animate-spin rounded-full h-6 w-6 border-b-2 border-white" })
                ])) : createCommentVNode("", true)
              ])) : isLoadingHistory.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "flex justify-center py-4"
              }, [
                createVNode("div", { class: "animate-spin rounded-full h-6 w-6 border-b-2 border-white" })
              ])) : (openBlock(), createBlock("div", {
                key: 2,
                class: "text-white text-center py-4"
              }, " У пользователя нет истории покупок "))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showCartModal.value,
        title: "Корзина пользователя",
        confirmText: "Закрыть",
        onClose: closeModal,
        onConfirm: closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (userCart.value && userCart.value.items && userCart.value.items.length) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="max-h-96 overflow-y-auto"${_scopeId}><!--[-->`);
              ssrRenderList(userCart.value.items, (item) => {
                _push2(`<div class="bg-gray-700 p-3 rounded-md mb-3 flex justify-between items-center"${_scopeId}><div class="flex items-center"${_scopeId}>`);
                if (item.image) {
                  _push2(`<img${ssrRenderAttr("src", item.image)} alt="item" class="w-10 h-10 object-cover rounded mr-3"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div${_scopeId}><p class="text-white font-medium"${_scopeId}>${ssrInterpolate(item.name)}</p></div></div><button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200"${_scopeId}> Удалить </button></div>`);
              });
              _push2(`<!--]--></div>`);
              if (isLoadingCart.value) {
                _push2(`<div class="flex justify-center py-4"${_scopeId}><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"${_scopeId}></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (isLoadingCart.value) {
              _push2(`<div class="flex justify-center py-4"${_scopeId}><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"${_scopeId}></div></div>`);
            } else {
              _push2(`<div class="text-white text-center py-4"${_scopeId}> Корзина пользователя пуста </div>`);
            }
          } else {
            return [
              userCart.value && userCart.value.items && userCart.value.items.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "max-h-96 overflow-y-auto" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(userCart.value.items, (item) => {
                    return openBlock(), createBlock("div", {
                      key: item.shop_cart_id,
                      class: "bg-gray-700 p-3 rounded-md mb-3 flex justify-between items-center"
                    }, [
                      createVNode("div", { class: "flex items-center" }, [
                        item.image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: item.image,
                          alt: "item",
                          class: "w-10 h-10 object-cover rounded mr-3"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-white font-medium" }, toDisplayString(item.name), 1)
                        ])
                      ]),
                      createVNode("button", {
                        onClick: ($event) => removeFromCart(item.shop_cart_id),
                        class: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200"
                      }, " Удалить ", 8, ["onClick"])
                    ]);
                  }), 128))
                ]),
                isLoadingCart.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex justify-center py-4"
                }, [
                  createVNode("div", { class: "animate-spin rounded-full h-6 w-6 border-b-2 border-white" })
                ])) : createCommentVNode("", true)
              ])) : isLoadingCart.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "flex justify-center py-4"
              }, [
                createVNode("div", { class: "animate-spin rounded-full h-6 w-6 border-b-2 border-white" })
              ])) : (openBlock(), createBlock("div", {
                key: 2,
                class: "text-white text-center py-4"
              }, " Корзина пользователя пуста "))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReusableModal, {
        isOpen: showDeleteModal.value,
        title: "Удаление пользователя",
        confirmText: "Удалить",
        onClose: closeModal,
        onConfirm: deleteUser
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-white"${_scopeId}>Вы уверены, что хотите удалить пользователя &quot;${ssrInterpolate(editUser.value.name)}&quot;?</p>`);
          } else {
            return [
              createVNode("p", { class: "text-white" }, 'Вы уверены, что хотите удалить пользователя "' + toDisplayString(editUser.value.name) + '"?', 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
