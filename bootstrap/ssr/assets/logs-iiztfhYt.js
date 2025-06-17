import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { ref, computed, useSSRContext } from "vue";
import "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./Dashboard-fXrpRFWF.js";
import "@heroicons/vue/24/outline";
const __default__ = {
  layout: _sfc_main$1
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "logs",
  __ssrInlineRender: true,
  props: {
    logs: Object,
    logStatistics: Object,
    filters: Object
  },
  setup(__props) {
    const props = __props;
    const filters = ref({
      steamid: props.filters.steamid || "",
      type: props.filters.type || "",
      sort_by: props.filters.sort_by || "created_at",
      sort_direction: props.filters.sort_direction || "desc"
    });
    const formatPrice = (value) => {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB"
      }).format(value || 0);
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getLogTypeName = (type) => {
      const typeNames = {
        "buy_log": "Покупки",
        "buy_log_new": "Корзина",
        "payment_statistic": "Пополнения",
        "other_log": "Плагин",
        "promo_log": "Промокод"
      };
      return typeNames[type] || type;
    };
    const processedPaginationLinks = computed(() => {
      if (!props.logs.links) return [];
      return props.logs.links.map((link) => {
        if (!link.url) return link;
        const url = new URL(link.url);
        if (filters.value.steamid) {
          url.searchParams.set("steamid", filters.value.steamid);
        }
        if (filters.value.type) {
          url.searchParams.set("type", filters.value.type);
        }
        if (filters.value.sort_by) {
          url.searchParams.set("sort_by", filters.value.sort_by);
        }
        if (filters.value.sort_direction) {
          url.searchParams.set("sort_direction", filters.value.sort_direction);
        }
        return {
          ...link,
          url: url.toString()
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold text-white mb-4">Логи операций</h1><div class="mb-4 flex justify-between items-center space-x-4"><div class="relative w-1/3"><input${ssrRenderAttr("value", filters.value.steamid)} type="text" placeholder="Поиск по SteamID / Name..." class="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></div><select class="bg-gray-700 text-white p-2 rounded-md"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "") : ssrLooseEqual(filters.value.type, "")) ? " selected" : ""}>Все типы логов</option><option value="buy_log"${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "buy_log") : ssrLooseEqual(filters.value.type, "buy_log")) ? " selected" : ""}>Покупки</option><option value="buy_log_new"${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "buy_log_new") : ssrLooseEqual(filters.value.type, "buy_log_new")) ? " selected" : ""}>Корзина</option><option value="payment_statistic"${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "payment_statistic") : ssrLooseEqual(filters.value.type, "payment_statistic")) ? " selected" : ""}>Пополнения</option><option value="other_log"${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "other_log") : ssrLooseEqual(filters.value.type, "other_log")) ? " selected" : ""}>Плагин</option><option value="promo_log"${ssrIncludeBooleanAttr(Array.isArray(filters.value.type) ? ssrLooseContain(filters.value.type, "promo_log") : ssrLooseEqual(filters.value.type, "promo_log")) ? " selected" : ""}>Промокоды</option></select><select class="bg-gray-700 text-white p-2 rounded-md"><option value="desc"${ssrIncludeBooleanAttr(Array.isArray(filters.value.sort_direction) ? ssrLooseContain(filters.value.sort_direction, "desc") : ssrLooseEqual(filters.value.sort_direction, "desc")) ? " selected" : ""}>По убыванию</option><option value="asc"${ssrIncludeBooleanAttr(Array.isArray(filters.value.sort_direction) ? ssrLooseContain(filters.value.sort_direction, "asc") : ssrLooseEqual(filters.value.sort_direction, "asc")) ? " selected" : ""}>По возрастанию</option></select></div><div class="grid grid-cols-3 gap-4 mb-4"><!--[-->`);
      ssrRenderList(__props.logStatistics, (stats, type) => {
        _push(`<div class="bg-gray-800 p-4 rounded-md text-white"><h3 class="text-lg font-semibold mb-2">${ssrInterpolate(getLogTypeName(type))}</h3><p>Записей: ${ssrInterpolate(stats.total_count)}</p><p>Сумма: ${ssrInterpolate(formatPrice(stats.total_amount))}</p></div>`);
      });
      _push(`<!--]--></div><div class="bg-gray-800 p-4 rounded-md"><table class="w-full table-auto text-white"><thead><tr><th class="px-4 py-2 text-left">ID</th><th class="px-4 py-2 text-left">Тип операции</th><th class="px-4 py-2 text-left">Игровой ник</th><th class="px-4 py-2 text-left">SteamID</th><th class="px-4 py-2 text-left">Название</th><th class="px-4 py-2 text-left">Сумма</th><th class="px-4 py-2 text-left">Дата создания</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.logs.data, (log) => {
        _push(`<tr class="border-t border-gray-700 hover:bg-gray-700 transition"><td class="px-4 py-2">${ssrInterpolate(log.id)}</td><td class="px-4 py-2">${ssrInterpolate(getLogTypeName(log.log_type))}</td><td class="px-4 py-2">${ssrInterpolate(log.name)}</td><td class="px-4 py-2">${ssrInterpolate(log.steamid)}</td><td class="px-4 py-2">`);
        if (log.log_type !== "other_log") {
          _push(`<!--[-->${ssrInterpolate(log.item_name)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (log.log_type === "other_log" && log.message) {
          _push(`<!--[-->${ssrInterpolate(log.message)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="px-4 py-2">${ssrInterpolate(formatPrice(log.price))}</td><td class="px-4 py-2">${ssrInterpolate(formatDate(log.created_at))}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-center items-center space-x-2"><!--[-->`);
      ssrRenderList(processedPaginationLinks.value, (link) => {
        _push(`<a${ssrRenderAttr("href", link.url)} class="${ssrRenderClass([[
          "px-4 py-2 rounded-md",
          link.active ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500",
          !link.url && "cursor-not-allowed opacity-50"
        ], "transition-all duration-200"])}">${link.label ?? ""}</a>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/logs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
