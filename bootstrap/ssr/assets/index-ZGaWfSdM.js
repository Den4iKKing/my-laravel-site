import { ref, onMounted, computed, useSSRContext, watch, onUnmounted, mergeProps, h, createVNode, resolveDynamicComponent, withCtx, createBlock, createCommentVNode, openBlock, createTextVNode, Fragment, renderList, toDisplayString, resolveComponent } from "vue";
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttrs, ssrRenderVNode, ssrRenderSlot } from "vue/server-renderer";
import axios from "axios";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { useI18n } from "vue-i18n";
import { usePage } from "@inertiajs/vue3";
const _sfc_main$a = {
  __name: "Toast",
  __ssrInlineRender: true,
  props: {
    title: String,
    message: String,
    status: {
      type: String,
      default: "info"
    },
    duration: {
      type: Number,
      default: 3e3
    },
    zIndex: {
      type: Number,
      default: 9999
    }
  },
  setup(__props) {
    const props = __props;
    const visible = ref(true);
    const timer = ref(null);
    onMounted(() => {
      timer.value = setTimeout(() => visible.value = false, props.duration);
    });
    const statusClass = computed(() => {
      return {
        success: "bg-darkgreen-100/60 text-emerald-50 border-emerald-500",
        error: "bg-darkred-200/60 text-wht-100 border-rose-500",
        warning: "bg-amber-900/80 text-amber-50 border-amber-500",
        info: "bg-indigo-900/80 text-indigo-50 border-indigo-500"
      }[props.status] || "bg-gray-900/80 text-gray-50 border-gray-500";
    });
    const iconBgClass = computed(() => {
      return {
        success: "bg-emerald-500/30",
        error: "bg-rose-500/30",
        warning: "bg-amber-500/30",
        info: "bg-indigo-500/30"
      }[props.status] || "bg-gray-500/30";
    });
    const icon = computed(() => {
      return {
        success: "✓",
        error: "×",
        warning: "!",
        info: "i"
      }[props.status] || "i";
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (visible.value) {
          _push2(`<div class="${ssrRenderClass([["notify", statusClass.value], "fixed top-5 right-5 p-4 rounded-lg shadow-xl flex items-center space-x-4 backdrop-blur-sm border border-opacity-20 z-50 max-w-md"])}" data-v-9ef83aed><div class="${ssrRenderClass([["icon-container", iconBgClass.value], "p-3 rounded-full flex items-center justify-center"])}" data-v-9ef83aed><span class="text-xl" data-v-9ef83aed>${ssrInterpolate(icon.value)}</span></div><div class="flex-1" data-v-9ef83aed><h3 class="font-semibold text-base" data-v-9ef83aed>${ssrInterpolate(__props.title)}</h3><p class="text-sm opacity-90" data-v-9ef83aed>${ssrInterpolate(__props.message)}</p></div><button class="text-sm opacity-70 hover:opacity-100 transition-opacity" data-v-9ef83aed><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-9ef83aed><line x1="18" y1="6" x2="6" y2="18" data-v-9ef83aed></line><line x1="6" y1="6" x2="18" y2="18" data-v-9ef83aed></line></svg></button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Toast.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const Notify = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-9ef83aed"]]);
const _sfc_main$9 = {
  __name: "PaymentModal",
  __ssrInlineRender: true,
  props: {
    isVisible: Boolean
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const cooldown = ref(false);
    const lockScroll = () => {
      document.body.style.overflow = "hidden";
    };
    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
    };
    const paymentMethods = [
      { name: "СБП #1", hiddenName: "antilopay", additional: "card", fee: "5%", icon: "/images/payments/sbp.jpg", minAmount: 50 },
      { name: "БАНКОВСКИЕ КАРТЫ №1", hiddenName: "antilopay", additional: "card", fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50 },
      { name: "СБП #2", hiddenName: "morune", additional: "sbp", fee: "5%", icon: "/images/payments/sbp.jpg", minAmount: 50 },
      { name: "БАНКОВСКИЕ КАРТЫ №2", hiddenName: "morune", additional: "card", fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50 },
      { name: "Криптовалюта", hiddenName: "crypto", additional: "card", fee: "5%", icon: "/images/payments/crypto.png", minAmount: 50 },
      { name: "Другое #1", hiddenName: "cent", additional: "card", fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50 },
      { name: "Другое #2", hiddenName: "freekassa", additional: "card", fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50 }
    ];
    const selectedMethod = ref(null);
    const amount = ref(100);
    const formattedAmount = computed({
      get() {
        return amount.value.toString().replace(/\.0+$/, "");
      },
      set(value) {
        amount.value = parseFloat(value) || 0;
      }
    });
    const promoCode = ref("");
    const notify = ref(null);
    const selectedBonus = ref(null);
    const calculatedBonusAmount = ref(0);
    computed(() => {
      const baseAmount = parseFloat(amount.value) || 0;
      return baseAmount + calculatedBonusAmount.value;
    });
    const isActiveBonus = (bonus) => {
      if (!selectedBonus.value) return false;
      return parseFloat(bonus.threshold) === parseFloat(selectedBonus.value.threshold);
    };
    const calculateBonus = () => {
      if (!selectedBonus.value || !amount.value) {
        calculatedBonusAmount.value = 0;
        return;
      }
      const currentAmount = parseFloat(amount.value);
      const bonusThreshold = parseFloat(selectedBonus.value.threshold);
      const bonusPercent = parseFloat(selectedBonus.value.percent);
      if (currentAmount >= bonusThreshold) {
        calculatedBonusAmount.value = currentAmount * (bonusPercent / 100);
      } else {
        calculatedBonusAmount.value = 0;
      }
    };
    const showNotify = (title, message, status) => {
      notify.value = { title, message, status };
      setTimeout(() => notify.value = null, 3e3);
    };
    const formatNumber = (num) => {
      return Math.floor(num).toString();
    };
    const autoSelectBonus = () => {
      const depositAmount = parseFloat(amount.value || 0);
      if (depositAmount < parseFloat(bonusTiers.value[0].threshold)) {
        selectedBonus.value = null;
        calculatedBonusAmount.value = 0;
        return;
      }
      let highestBonusTier = null;
      for (const tier of bonusTiers.value) {
        if (depositAmount >= parseFloat(tier.threshold)) {
          if (!highestBonusTier || parseFloat(tier.threshold) > parseFloat(highestBonusTier.threshold)) {
            highestBonusTier = tier;
          }
        }
      }
      if (highestBonusTier) {
        selectedBonus.value = highestBonusTier;
        calculateBonus();
      }
    };
    const handleAmountChange = () => {
      const depositAmount = Math.floor(parseFloat(amount.value || 0));
      if (depositAmount < parseFloat(bonusTiers.value[0].threshold)) {
        selectedBonus.value = null;
        calculatedBonusAmount.value = 0;
      } else {
        autoSelectBonus();
        calculateBonus();
      }
    };
    const bonusTiers = ref([]);
    onMounted(async () => {
      try {
        const response = await axios.get("/api/payment-bonuses");
        bonusTiers.value = response.data;
        if (bonusTiers.value.length > 0) {
          const smallestBonus = [...bonusTiers.value].sort(
            (a, b) => parseFloat(a.threshold) - parseFloat(b.threshold)
          )[0];
          selectedBonus.value = smallestBonus;
          amount.value = String(smallestBonus.threshold);
          calculateBonus();
        }
      } catch (error) {
        console.error("Ошибка при загрузке бонусов:", error);
        showNotify("Ошибка", "Не удалось загрузить бонусы", "error");
      }
      watch(amount, () => {
        handleAmountChange();
      });
      watch(
        () => props.isVisible,
        (newValue) => {
          if (newValue) {
            lockScroll();
          } else {
            unlockScroll();
          }
        },
        { immediate: true }
      );
    });
    onUnmounted(() => {
      unlockScroll();
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isVisible) {
          _push2(`<div class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4" data-v-01ec1082>`);
          if (__props.isVisible) {
            _push2(`<div style="${ssrRenderStyle({ "max-height": "100%", "overflow": "auto" })}" class="bg-gray-900/90 text-white w-full max-w-3xl rounded-xl p-6 relative shadow-2xl border border-gray-800" data-v-01ec1082><div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700" data-v-01ec1082><div class="flex items-center space-x-3" data-v-01ec1082><div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600" data-v-01ec1082><rect x="2" y="5" width="20" height="14" rx="2" data-v-01ec1082></rect><line x1="2" y1="10" x2="22" y2="10" data-v-01ec1082></line></svg></div><h2 class="text-2xl font-bold text-gray-900 dark:text-white" data-v-01ec1082>Выберите способ оплаты</h2></div><button class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-01ec1082><line x1="18" y1="6" x2="6" y2="18" data-v-01ec1082></line><line x1="6" y1="6" x2="18" y2="18" data-v-01ec1082></line></svg></button></div><div class="p-6 space-y-8" data-v-01ec1082><div data-v-01ec1082><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-v-01ec1082>Способы оплаты</h3><div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-v-01ec1082><!--[-->`);
            ssrRenderList(paymentMethods, (method) => {
              var _a, _b;
              _push2(`<div class="${ssrRenderClass([
                "group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg",
                ((_a = selectedMethod.value) == null ? void 0 : _a.name) === method.name ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600"
              ])}" data-v-01ec1082>`);
              if (((_b = selectedMethod.value) == null ? void 0 : _b.name) === method.name) {
                _push2(`<div class="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white" data-v-01ec1082><polyline points="20 6 9 17 4 12" data-v-01ec1082></polyline></svg></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex flex-col items-center text-center space-y-3" data-v-01ec1082><div class="" data-v-01ec1082><img${ssrRenderAttr("src", method.icon)} alt="" class="w-16 h-16 object-contain" data-v-01ec1082></div><div data-v-01ec1082><span class="font-semibold text-gray-900 dark:text-white block" data-v-01ec1082>${ssrInterpolate(method.name)}</span><span class="text-sm text-gray-500 dark:text-gray-400" data-v-01ec1082>от ${ssrInterpolate(method.minAmount)}₽</span></div></div></div>`);
            });
            _push2(`<!--]--></div></div><div data-v-01ec1082><label class="block text-lg font-semibold text-gray-900 dark:text-white mb-4" data-v-01ec1082> Сумма пополнения </label><div class="relative" data-v-01ec1082><div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium" data-v-01ec1082> ₽ </div><input type="number"${ssrRenderAttr("value", formattedAmount.value)} class="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none" placeholder="1000" step="any" data-v-01ec1082></div></div><div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800" data-v-01ec1082><h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600 mr-2" data-v-01ec1082><polygon points="12 2 15.09 8.26 22 9 17 14.74 18.18 21.02 12 17.77 5.82 21.02 7 14.74 2 9 8.91 8.26 12 2" data-v-01ec1082></polygon></svg> Получите бонус </h3><div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6" data-v-01ec1082><!--[-->`);
            ssrRenderList(bonusTiers.value, (bonus) => {
              _push2(`<div class="${ssrRenderClass([
                "relative p-4 rounded-xl text-center cursor-pointer transition-all duration-300",
                isActiveBonus(bonus) ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105 transform" : selectedBonus.value && parseFloat(bonus.threshold) < parseFloat(selectedBonus.value.threshold) ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700" : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              ])}" data-v-01ec1082><div class="flex flex-col items-center space-y-1" data-v-01ec1082><span class="${ssrRenderClass([isActiveBonus(bonus) ? "text-white" : "text-indigo-600 dark:text-indigo-400", "text-2xl font-bold"])}" data-v-01ec1082> +${ssrInterpolate(parseFloat(bonus.percent).toFixed(0))}% </span><span class="${ssrRenderClass([isActiveBonus(bonus) ? "text-indigo-100" : "text-gray-500 dark:text-gray-400", "text-xs"])}" data-v-01ec1082> от ${ssrInterpolate(formatNumber(bonus.threshold))}₽ </span></div>`);
              if (selectedBonus.value && parseFloat(bonus.threshold) < parseFloat(selectedBonus.value.threshold)) {
                _push2(`<div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white" data-v-01ec1082><polyline points="20 6 9 17 4 12" data-v-01ec1082></polyline></svg></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            if (selectedBonus.value && calculatedBonusAmount.value > 0) {
              _push2(`<div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700" data-v-01ec1082><div class="flex justify-between items-center" data-v-01ec1082><span class="text-gray-600 dark:text-gray-400 font-medium" data-v-01ec1082>К зачислению:</span><div class="flex items-center space-x-2" data-v-01ec1082><span class="text-lg font-semibold text-gray-900 dark:text-white" data-v-01ec1082>${ssrInterpolate(formattedAmount.value)}₽</span><span class="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium" data-v-01ec1082> +${ssrInterpolate(formatNumber(calculatedBonusAmount.value))}₽ </span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button${ssrIncludeBooleanAttr(cooldown.value) ? " disabled" : ""} class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-01ec1082><rect x="2" y="5" width="20" height="14" rx="2" data-v-01ec1082></rect><line x1="2" y1="10" x2="22" y2="10" data-v-01ec1082></line></svg><span data-v-01ec1082>${ssrInterpolate(cooldown.value ? "Обработка..." : "Пополнить баланс")}</span></button><div class="border-t border-gray-200 dark:border-gray-700 pt-6" data-v-01ec1082><label class="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center" data-v-01ec1082><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600 mr-2" data-v-01ec1082><path d="M21 12c0 1-2 3-2 3l-6-3 6-3s2 2 2 3" data-v-01ec1082></path><path d="M3 12l6-3-6-3c-1 1-1 5 0 6" data-v-01ec1082></path><path d="M9 9v6" data-v-01ec1082></path><path d="M15 9v6" data-v-01ec1082></path></svg> Активировать промокод </label><div class="flex space-x-3" data-v-01ec1082><input type="text"${ssrRenderAttr("value", promoCode.value)} class="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none" placeholder="Введите промокод" data-v-01ec1082><button${ssrIncludeBooleanAttr(cooldown.value || !promoCode.value.trim()) ? " disabled" : ""} class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed" data-v-01ec1082> Применить </button></div></div></div>`);
            if (notify.value) {
              _push2(ssrRenderComponent(Notify, {
                title: notify.value.title,
                message: notify.value.message,
                status: notify.value.status
              }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/PaymentModal.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const Modal = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-01ec1082"]]);
const _sfc_main$8 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  props: ["auth"],
  setup(__props) {
    const isModalVisible = ref(false);
    const isMobileMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const userMenuRef = ref(null);
    const balance = ref(null);
    const menuItems = [
      {
        label: "Telegram",
        link: "https://t.me/",
        image: "https://img.icons8.com/nolan/64/telegram-app.png"
      },
      {
        label: "Discord",
        link: "https://discord.gg",
        image: "https://img.icons8.com/nolan/64/discord-logo.png"
      },
      {
        label: "VK",
        link: "https://vk.com/",
        image: "https://img.icons8.com/nolan/64/vk-com.png"
      }
    ];
    const fetchBalance = async () => {
      var _a;
      if (!((_a = __props.auth) == null ? void 0 : _a.user)) return;
      try {
        const response = await axios.get("/api/user/balance");
        balance.value = response.data.balance;
      } catch (error) {
        console.error("Ошибка загрузки баланса:", error);
      }
    };
    const closeModal = () => {
      isModalVisible.value = false;
      document.body.style.overflow = "";
    };
    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        isUserMenuOpen.value = false;
      }
    };
    let intervalId = null;
    onMounted(() => {
      fetchBalance();
      intervalId = setInterval(fetchBalance, 1e5);
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "bg-gray-900 border-b border-gray-700 sticky top-0 z-50" }, _attrs))} data-v-373c1b08><div class="max-w-6xl mx-auto px-4" style="${ssrRenderStyle({ "max-width": "1800px" })}" data-v-373c1b08><div class="flex items-center justify-between h-16" data-v-373c1b08><div class="flex items-center" data-v-373c1b08><div class="flex items-center space-x-1" data-v-373c1b08><span class="text-2xl font-bold text-indigo-400" data-v-373c1b08>JDONATE</span><span class="text-2xl font-bold text-white" data-v-373c1b08>RUST</span></div></div><div class="hidden md:flex items-center space-x-8" data-v-373c1b08><div class="flex items-center space-x-6" data-v-373c1b08><!--[-->`);
      ssrRenderList(menuItems, (item, index2) => {
        _push(`<a${ssrRenderAttr("href", item.link)} target="_blank" class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group" data-v-373c1b08><img${ssrRenderAttr("src", item.image)} alt="icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" data-v-373c1b08><span class="font-medium" data-v-373c1b08>${ssrInterpolate(item.label)}</span></a>`);
      });
      _push(`<!--]--></div><div class="flex items-center space-x-4" data-v-373c1b08>`);
      if (__props.auth.user) {
        _push(`<div class="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200" data-v-373c1b08><span class="text-white font-semibold" data-v-373c1b08>${ssrInterpolate(balance.value || "0")}</span><img src="https://img.icons8.com/nolan/64/cheap-2.png" alt="Coin" class="w-5 h-5" data-v-373c1b08></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.auth.user) {
        _push(`<div class="relative" data-v-373c1b08><button class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-indigo-400 transition-colors duration-200" data-v-373c1b08><img${ssrRenderAttr("src", __props.auth.user.avatar)} alt="Avatar" class="w-full h-full object-cover" data-v-373c1b08></button>`);
        if (isUserMenuOpen.value) {
          _push(`<div class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2" data-v-373c1b08><a href="/logout" class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200" data-v-373c1b08> Выйти </a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200" data-v-373c1b08> Войти </button>`);
      }
      _push(`</div></div><button class="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200" data-v-373c1b08>`);
      if (!isMobileMenuOpen.value) {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-373c1b08><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-373c1b08></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-373c1b08><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-373c1b08></path></svg>`);
      }
      _push(`</button></div>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="md:hidden border-t border-gray-700 py-4" data-v-373c1b08><div class="space-y-4" data-v-373c1b08><div class="space-y-2" data-v-373c1b08><!--[-->`);
        ssrRenderList(menuItems, (item, index2) => {
          _push(`<a${ssrRenderAttr("href", item.link)} target="_blank" class="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200" data-v-373c1b08><img${ssrRenderAttr("src", item.image)} alt="icon" class="w-5 h-5" data-v-373c1b08><span class="font-medium" data-v-373c1b08>${ssrInterpolate(item.label)}</span></a>`);
        });
        _push(`<!--]--></div><div class="pt-4 border-t border-gray-700" data-v-373c1b08>`);
        if (__props.auth.user) {
          _push(`<div class="space-y-3" data-v-373c1b08><div class="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg cursor-pointer" data-v-373c1b08><span class="text-white font-medium" data-v-373c1b08>Баланс</span><div class="flex items-center space-x-2" data-v-373c1b08><span class="text-white font-semibold" data-v-373c1b08>${ssrInterpolate(balance.value || "0")}</span><img src="https://img.icons8.com/nolan/64/cheap-2.png" alt="Coin" class="w-5 h-5" data-v-373c1b08></div></div><a href="/logout" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200" data-v-373c1b08> Выйти </a></div>`);
        } else {
          _push(`<button class="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200" data-v-373c1b08> Войти </button>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(Modal, {
        isVisible: isModalVisible.value,
        onClose: closeModal
      }, null, _parent));
      _push(`</nav>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Navbar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-373c1b08"]]);
const _sfc_main$7 = {
  __name: "Information",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const showModal = ref(false);
    const activeModal = ref(null);
    const modalTitles = {
      servers: "modals.servers",
      rules: "modals.rules",
      commands: "modals.commands",
      faq: "modals.faq"
    };
    const modalTitle = computed(() => {
      const key = modalTitles[activeModal.value];
      return key ? t(key) : "";
    });
    const modalIcon = computed(() => {
      switch (activeModal.value) {
        case "rules":
          return {
            svg: h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "rgb(168, 85, 247)",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [
              h("path", { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" }),
              h("path", { d: "m9 12 2 2 4-4" })
            ]),
            bgColor: "bg-purple-500/20",
            color: "rgb(168, 85, 247)"
          };
        case "commands":
          return {
            svg: h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "rgb(59, 130, 246)",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [
              h("polyline", { points: "9 10 4 15 9 20" }),
              h("path", { d: "M20 4v7a4 4 0 0 1-4 4H4" })
            ]),
            bgColor: "bg-blue-500/20",
            color: "rgb(59, 130, 246)"
          };
        case "faq":
          return {
            svg: h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "rgb(34, 197, 94)",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [
              h("circle", { cx: "12", cy: "12", r: "10" }),
              h("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
              h("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
            ]),
            bgColor: "bg-green-500/20",
            color: "rgb(34, 197, 94)"
          };
        default:
          return {};
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg mb-[15px] min-w-[21vw] max-w-[700px] max-h-[320px] min-h-[200px]" }, _attrs))}><h3 class="text-xl font-bold mb-6 flex items-center" style="${ssrRenderStyle({ "margin-bottom": "15px" })}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg> Информация </h3><div class="grid grid-cols-2 gap-4 mb-6"><div class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"><div class="flex items-center justify-center mb-2"><div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(168, 85, 247)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg></div></div><p class="text-center font-bold">Правила </p></div><div class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"><div class="flex items-center justify-center mb-2"><div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(99, 102, 241)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div></div><p class="text-center font-bold">Сервера</p></div><div class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"><div class="flex items-center justify-center mb-2"><div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(59, 130, 246)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg></div></div><p class="text-center font-bold">Команды</p></div><div class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"><div class="flex items-center justify-center mb-2"><div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(34, 197, 94)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div></div><p class="text-center font-bold">FAQ</p></div></div>`);
      if (showModal.value) {
        _push(`<div class="fixed inset-0 z-50 overflow-y-auto"><div class="flex items-center justify-center min-h-screen p-4"><div class="fixed inset-0 bg-black/70 transition-opacity"></div><div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full z-10 relative transform transistion-all" style="${ssrRenderStyle({ "min-width": "200px", "max-width": "1000px" })}"><div class="flex justify-between items-center mb-6"><h3 class="text-xl font-bold text-white flex items-center"><div class="${ssrRenderClass([modalIcon.value.bgColor, "mr-3 p-2 rounded-lg"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(modalIcon.value.svg), {
          class: "w-5 h-5",
          stroke: modalIcon.value.color
        }, null), _parent);
        _push(`</div> ${ssrInterpolate(modalTitle.value)}</h3><button class="text-gray-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>`);
        if (activeModal.value === "rules") {
          _push(`<div class="space-y-4"><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-indigo-400 font-bold mb-2">📌 Общие правила</h4><p class="text-gray-300 text-sm">1. Уважай других игроков, адекватное поведение — это основа комфорта для всех.</p><p class="text-gray-300 text-sm">2. Запрещены токсичность, оскорбления, травля и провокации.</p><p class="text-gray-300 text-sm">3. Запрещено использование читов, макросов и стороннего ПО.</p></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-indigo-400 font-bold mb-2">⚔️ PvP и грабеж</h4><p class="text-gray-300 text-sm">4. PvP разрешён на всей карте, кроме зон с меткой &quot;No PvP&quot;.</p><p class="text-gray-300 text-sm">5. Грабеж разрешён, но грифинг без цели (вандализм) — запрещён.</p><p class="text-gray-300 text-sm">6. Запрещено кемперство у спавна более 10 минут.</p><p class="text-gray-300 text-sm">7. Использование багов в рейде карается баном.</p><p class="text-gray-300 text-sm">8. Запрещены ловушки возле телепортов и ивентов.</p><p class="text-gray-300 text-sm">9. Подлог под админов или ложные жалобы = блокировка.</p><p class="text-gray-300 text-sm">10. Рейды вне вайпа запрещены, если нет разрешения админа.</p></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-indigo-400 font-bold mb-2">🏡 Постройки</h4><p class="text-gray-300 text-sm">11. Запрещено строить вблизи чужих баз (минимум 20 фундаментов).</p><p class="text-gray-300 text-sm">12. Запрещены базы в текстурах или багнутых местах.</p><p class="text-gray-300 text-sm">13. Лагометы и строения, сильно нагружающие сервер — будут удалены.</p><p class="text-gray-300 text-sm">14. Не мешай дороге и ивент-локациям своими постройками.</p><p class="text-gray-300 text-sm">15. Админы имеют право снести базу без возврата, если она нарушает правила.</p></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-indigo-400 font-bold mb-2">📣 Коммуникация</h4><p class="text-gray-300 text-sm">16. Запрещён спам и флуд в чате, голосом — тоже.</p><p class="text-gray-300 text-sm">17. Реклама других серверов, дискордов — бан навсегда.</p><p class="text-gray-300 text-sm">18. Никнейм, аватар или описание с матом/пропагандой — будет изменено или игрок получит бан.</p><p class="text-gray-300 text-sm">19. Админ — не твой слуга. Обращайся с уважением.</p></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-indigo-400 font-bold mb-2">👮 Администрация</h4><p class="text-gray-300 text-sm">20. Администрация не вмешивается в игровой процесс без причины.</p><p class="text-gray-300 text-sm">21. Решение админа — окончательное. Обжаловать можно через Discord.</p><p class="text-gray-300 text-sm">22. Поддержка работает в адекватное время суток :)</p><p class="text-gray-300 text-sm">23. Обход блокировки — перманентный бан.</p><p class="text-gray-300 text-sm">24. Обман администрации = бан без шансов на разбан.</p><p class="text-gray-300 text-sm">25. Мы за честную игру. Не нравится? Rust — не для тебя 😘</p><p class="text-gray-300 text-sm">26. Обновления правил могут быть без предварительного уведомления.</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeModal.value === "commands") {
          _push(`<div class="space-y-4"><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><h4 class="text-blue-400 font-bold mb-3">Команды</h4><div class="mb-2 last:mb-0"><div class="flex items-center"><span class="text-white font-mono bg-gray-700 px-2 py-1 rounded text-sm">/store</span><span class="text-gray-400 text-sm ml-3">открыть магазин</span></div></div><div class="mb-2 last:mb-0"><div class="flex items-center"><span class="text-white font-mono bg-gray-700 px-2 py-1 rounded text-sm">/store</span><span class="text-gray-400 text-sm ml-3">открыть магазин</span></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeModal.value === "faq") {
          _push(`<div class="space-y-4"><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Что это за проект?</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Это приватный проект, где можно играть на честных условиях с минимальной модерацией. </div></details></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Нужен ли вайп?</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Вайпы проходят раз в месяц или по мере необходимости, но всё по-человечески 🫶 </div></details></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Какие правила?</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Не быть токсиком, не абьюзить баги, и просто играть честно. Ну, и без читов конечно. </div></details></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Где задать вопрос или пожаловаться?</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Напиши в <a href="https://t.me/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Telegram</a> или в <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">VK</a> — ответим. </div></details></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Есть ли донат?</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Есть. Но он максимально лайтовый и никак не даёт прям супер-преимуществ. </div></details></div><div class="p-4 bg-black/20 rounded-xl border border-gray-700"><details class="group"><summary class="flex justify-between items-center cursor-pointer list-none"><h4 class="text-indigo-400 font-bold">Контакты</h4><div class="text-gray-400 transition-transform duration-300 group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></summary><div class="pt-3 text-gray-300 text-sm"> Telegram: <a href="https://t.me/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://t.me/</a><br> Discord: <a href="https://dsc.gg/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://dsc.gg/</a><br> VK: <a href="https://vk.com/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://vk.com/</a></div></details></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeModal.value === "servers") {
          _push(`<div class="space-y-4"><section class="p-4 bg-black/25 rounded-lg border border-gray-600"><h4 class="text-cyan-400 font-semibold mb-2">Наши игровые сервера</h4><article class="mb-3 p-3 bg-gray-800/60 rounded-md"><p class="text-gray-300 text-sm"> RustWorld Prime #1 [ x2 Рейты | SOLO | Телепорт | Киты | RPG | Уровни ] Карта: Procedural </p><p class="text-gray-400 text-sm mt-1">ip: play.rustworld.ru</p></article></section></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-6 flex justify-end" style="${ssrRenderStyle({ "display": "none" })}"><button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-sm flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Закрыть </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Information.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "Categories",
  __ssrInlineRender: true,
  props: ["categories", "onSearch"],
  emits: ["update:searchQuery", "reset"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchQuery = ref("");
    const activeCategory = ref(null);
    watch(searchQuery, (newQuery) => {
      props.onSearch(newQuery, activeCategory.value);
      emit("update:searchQuery", newQuery);
    });
    const sanitizeSvg = (svg) => {
      if (typeof svg === "string") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const svgElement = doc.documentElement;
        svgElement.setAttribute("height", "20px");
        return svgElement.outerHTML;
      }
      return svg;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "bg-gray-900/90 text-white p-6 rounded-t-xl border border-gray-800 shadow-lg",
        style: { "border-bottom": "none" }
      }, _attrs))}><h2 class="text-xl font-bold mb-6 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Магазин </h2><div class="mb-6 relative"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="text" id="product-search" name="product-search" placeholder="Поиск по товарам..." class="w-full px-4 py-3 pl-12 bg-gray-800/80 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-300 outline-none" style="${ssrRenderStyle({ "box-shadow": "rgba(255, 255, 255, 0.13) 0px 0px 0px 1px", "border": "none" })}">`);
      if (searchQuery.value) {
        _push(`<button class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-6"><h3 class="text-sm font-medium text-gray-400 mb-3 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Категории товаров </h3></div>`);
      if (__props.categories && __props.categories.length > 0) {
        _push(`<div class="flex flex-wrap gap-3"><button class="${ssrRenderClass([!activeCategory.value ? "bg-[#6366f1] border border-gray-700 text-gray-200" : "bg-gray-800/70 hover:bg-[#6366f1] border border-gray-700 text-gray-200", "flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"])}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> Все товары </button><!--[-->`);
        ssrRenderList(__props.categories, (category) => {
          _push(`<button class="${ssrRenderClass([category.id === activeCategory.value ? "bg-[#6366f1] border border-gray-700 text-gray-200" : "bg-gray-800/70 hover:bg-[#6366f1] border border-gray-700 text-gray-200", "flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"])}">`);
          if (category.icon) {
            _push(`<div style="${ssrRenderStyle({ "height": "20px" })}" class="${ssrRenderClass([category.id === activeCategory.value ? "text-white" : "text-gray-400", "w-5 h-5 mr-2 flex-shrink-0"])}">${sanitizeSvg(category.icon) ?? ""}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(category.name)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="animate-pulse"><div class="flex flex-wrap gap-3"><!--[-->`);
        ssrRenderList(5, (n) => {
          _push(`<div class="bg-gray-800/70 rounded-lg h-10 w-32 border border-gray-700"></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Categories.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    isOpen: Boolean,
    title: { type: String, default: "Подтвердите действие" },
    confirmText: { type: String, default: "Подтвердить" }
  },
  emits: ["close", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modalBackdrop = ref(null);
    ref(null);
    const onCancel = () => emit("close");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    const disableScroll = () => {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    };
    const enableScroll = () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
    watch(
      () => props.isOpen,
      (newValue) => {
        if (newValue) {
          disableScroll();
        } else {
          enableScroll();
        }
      },
      { immediate: true }
    );
    onMounted(() => {
      window.addEventListener("keydown", onKeyDown);
    });
    onUnmounted(() => {
      window.removeEventListener("keydown", onKeyDown);
      enableScroll();
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto",
          ref_key: "modalBackdrop",
          ref: modalBackdrop
        }, _attrs))} data-v-4ede6b05><div class="bg-gray-800 p-6 rounded-lg shadow-lg relative mt-5 mb-5" style="${ssrRenderStyle({ "border-radius": "20px", "max-width": "400px", "min-width": "200px", "max-height": "90vh", "overflow-y": "auto" })}" data-v-4ede6b05><h3 class="text-xl font-semibold text-white mb-4" style="${ssrRenderStyle({ "text-align": "center", "height": "30px", "margin-top": "-12px", "padding-bottom": "40px" })}" data-v-4ede6b05>${ssrInterpolate(__props.title)}</h3><div class="text-white" data-v-4ede6b05>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Modal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const MainModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-4ede6b05"]]);
const _sfc_main$4 = {
  __name: "NotifyStack",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const notifications = ref([]);
    const statusClasses = {
      success: "bg-darkgreen-500/60 text-emerald-50 border-emerald-500",
      error: "bg-darkred-200/60 text-wht-100 border-rose-500",
      warning: "bg-amber-900/80 text-amber-50 border-amber-500",
      info: "bg-indigo-900/80 text-indigo-50 border-indigo-500"
    };
    const iconBgClasses = {
      success: "bg-emerald-500/30",
      error: "bg-rose-500/30",
      warning: "bg-amber-500/30",
      info: "bg-indigo-500/30"
    };
    const icons = {
      success: "✓",
      error: "×",
      warning: "!",
      info: "i"
    };
    const addNotification = (title, message, status, duration = 3e3) => {
      if (notifications.value.length >= 3) {
        notifications.value.shift();
      }
      const id = Date.now();
      notifications.value.push({ id, title, message, status });
      setTimeout(() => {
        close(id);
      }, duration);
    };
    const close = (id) => {
      const index2 = notifications.value.findIndex((n) => n.id === id);
      if (index2 !== -1) {
        notifications.value.splice(index2, 1);
      }
    };
    __expose({
      addNotification
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed top-5 right-5 space-y-2 z-50" data-v-6c4eaf53><div${ssrRenderAttrs({ name: "notify-slide" })} data-v-6c4eaf53>`);
        ssrRenderList(notifications.value, (notification, index2) => {
          _push2(`<div class="${ssrRenderClass([["notify", statusClasses[notification.status]], "p-4 rounded-lg shadow-xl flex items-center space-x-4 backdrop-blur-sm border border-opacity-20 max-w-md"])}" style="${ssrRenderStyle({ marginTop: `${index2 * 0.5}rem` })}" data-v-6c4eaf53><div class="${ssrRenderClass([["icon-container", iconBgClasses[notification.status]], "p-3 rounded-full flex items-center justify-center"])}" data-v-6c4eaf53><span class="text-xl" data-v-6c4eaf53>${ssrInterpolate(icons[notification.status])}</span></div><div class="flex-1" data-v-6c4eaf53><h3 class="font-semibold text-base" data-v-6c4eaf53>${ssrInterpolate(notification.title)}</h3><p class="text-sm opacity-90" data-v-6c4eaf53>${ssrInterpolate(notification.message)}</p></div><button class="text-sm opacity-70 hover:opacity-100 transition-opacity" data-v-6c4eaf53><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-6c4eaf53><line x1="18" y1="6" x2="6" y2="18" data-v-6c4eaf53></line><line x1="6" y1="6" x2="18" y2="18" data-v-6c4eaf53></line></svg></button></div>`);
        });
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/NotifyStack.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const NotifyStack = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-6c4eaf53"]]);
const _sfc_main$3 = {
  __name: "Products",
  __ssrInlineRender: true,
  props: {
    products: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    searchQuery: {
      type: String,
      required: true
    },
    activeCategoryId: {
      type: [String, Number],
      required: false
    },
    activeServerId: {
      type: [String, Number],
      required: false
    },
    auth: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const notify = ref(null);
    const cooldown = ref(false);
    const showModal = ref(false);
    const modalTitle = ref("");
    const modalContent = ref("");
    const modalImage = ref("");
    const selectedProduct = ref(null);
    const totalPrice = computed(() => {
      if (!selectedProduct.value) return 0;
      return (selectedProduct.value.price * quantity.value).toFixed(0);
    });
    const totalOriginalPrice = computed(() => {
      if (!selectedProduct.value || !selectedProduct.value.sale) return 0;
      return (selectedProduct.value.original_price * quantity.value).toFixed(0);
    });
    const filteredProducts = computed(() => {
      const query = props.searchQuery.toLowerCase();
      return props.products.filter((product) => {
        var _a;
        const matchesSearch = (_a = product.name) == null ? void 0 : _a.toLowerCase().includes(query);
        const matchesCategory = props.activeCategoryId ? product.category_id === props.activeCategoryId : true;
        const matchesServer = props.activeServerId ? product.server_id === props.activeServerId : true;
        return matchesSearch && matchesCategory && matchesServer;
      });
    });
    const parsedAtr = computed(() => {
      if (selectedProduct.value && selectedProduct.value.atr) {
        try {
          return JSON.parse(selectedProduct.value.atr);
        } catch (e) {
          console.error("Error parsing atr:", e);
          return [];
        }
      } else {
        return [];
      }
    });
    const getProductAmount = (product) => {
      if (!product.atr) return 0;
      try {
        const atrItems = JSON.parse(product.atr);
        if (Array.isArray(atrItems) && atrItems.length > 0) {
          if (atrItems.length > 1) return 0;
          return atrItems[0].amount || 0;
        }
        return 0;
      } catch (e) {
        console.error("Ошибка при парсинге atr:", e);
        return 0;
      }
    };
    function getProductAtrType(product) {
      try {
        if (product.atr) {
          const atrsArray = JSON.parse(product.atr);
          if (atrsArray.length > 0 && atrsArray[0].type) {
            return atrsArray[0].type;
          }
        }
        return null;
      } catch (e) {
        console.error("Ошибка при парсинге product.atrs:", e);
        return null;
      }
    }
    const showNotify = (title, message, status) => {
      var _a;
      (_a = notifyStack.value) == null ? void 0 : _a.addNotification(title, message, status, 3e3);
    };
    const purchaseItem = async (product) => {
      var _a;
      if (!((_a = props.auth) == null ? void 0 : _a.user)) {
        console.warn("Не авторизован");
        showNotify("Ошибка", "Войдите в аккаунт, чтобы купить товар", "error");
        return;
      }
      if (cooldown.value) {
        showNotify("Ошибка", "Подождите перед следующей покупкой", "error");
        return;
      }
      const basePrice = product.original_price;
      const discount = product.sale && product.sale > 0 ? product.sale / 100 : 0;
      const finalPrice = basePrice * (1 - discount);
      const totalCost = Math.round(finalPrice * quantity.value);
      if (props.auth.user.balance < totalCost) {
        showNotify("Ошибка", "Недостаточно средств", "error");
        return;
      }
      cooldown.value = true;
      setTimeout(() => cooldown.value = false, 300);
      try {
        const response = await fetch(`/shop/buy/${product.id}?quantity=${quantity.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
          }
        });
        if (response.status === 200) {
          await response.json();
          showNotify("Успех", "Товар куплен", "success");
        } else {
          throw new Error();
        }
      } catch (error) {
        showNotify("Ошибка", "Недостаточно средств", "error");
      }
    };
    const quantity = ref(1);
    const displayedAmount = computed(() => {
      if (!selectedProduct.value || !parsedAtr.value.length) return quantity.value;
      const items = parsedAtr.value.filter((i) => i.type === "item");
      if (items.length !== 1) {
        return quantity.value;
      }
      return items[0].amount * quantity.value;
    });
    const updateQuantity = (amount) => {
      quantity.value = Math.max(1, quantity.value + amount);
    };
    const notifyStack = ref(null);
    const handleMouseDown = (event) => {
      if (event.target === event.currentTarget) {
        showModal.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(NotifyStack, {
        ref_key: "notifyStack",
        ref: notifyStack
      }, null, _parent));
      if (notify.value) {
        _push(ssrRenderComponent(Notify, {
          title: notify.value.title,
          message: notify.value.message,
          status: notify.value.status
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-900/90 p-6 rounded-b-xl shadow-lg border border-gray-800" style="${ssrRenderStyle({ "margin-bottom": "5px", "border-top": "none", "position": "relative", "padding-top": "3px" })}">`);
      if (__props.loading) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5"><!--[-->`);
        ssrRenderList(12, (n) => {
          _push(`<div class="bg-gray-800/70 p-4 rounded-xl animate-pulse border border-gray-700"><div class="w-full h-32 bg-gray-700 rounded-lg mb-3"></div><div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div><div class="h-3 bg-gray-700 rounded w-1/2"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5"><!--[-->`);
        ssrRenderList(filteredProducts.value, (product) => {
          _push(`<div class="${ssrRenderClass([
            "relative bg-gray-800/70 hover:bg-[#2a2a2ae6] p-5 rounded-2xl text-white cursor-pointer transition-all duration-500 ease-in-out shadow-md hover:shadow-indigo-glow flex flex-col items-center hover:scale-105",
            `class-custom-item-${product.id}`
          ])}" style="${ssrRenderStyle([getProductAtrType(product) === "blueprint" ? {
            backgroundImage: `url(https://static.wikia.nocookie.net/play-rust/images/b/ba/Building_Plan_icon.png)`,
            backgroundSize: "160px 160px",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            position: "relative"
          } : {}, { "transition": "all 0.5s ease-in-out", "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }])}">`);
          if (product.sale) {
            _push(`<div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)", "background-size": "200% 200%", "animation": "gradientMove 6s ease infinite" })}"> -${ssrInterpolate(product.sale)}% </div>`);
          } else {
            _push(`<!---->`);
          }
          if (getProductAmount(product) > 1) {
            _push(`<div class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #6a5acd, #00c3ff)", "background-size": "200% 200%", "animation": "gradientMove 6s ease infinite", "text-shadow": "0 0 6px rgba(0,0,0,0.7)" })}"> x${ssrInterpolate(getProductAmount(product))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center justify-center rounded-xl p-3 mb-4 w-full h-36"><img${ssrRenderAttr("src", product.image)} alt="product" class="max-h-full object-contain transition-transform duration-500 group-hover:scale-110" style="${ssrRenderStyle({ "transform": "scale(1.3)" })}"></div><h3 class="text-center font-semibold text-base line-clamp-2 mb-2 px-2" style="${ssrRenderStyle({ "color": "#e0e7ff" })}">${ssrInterpolate(product.name)}</h3><div class="flex items-center gap-3">`);
          if (product.sale > 1) {
            _push(`<p class="text-sm font-semibold line-through text-indigo-300 bg-indigo-700/40 px-3 py-1 rounded-lg select-none">${ssrInterpolate(product.price)} ₽ </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-lg font-bold text-indigo-100 bg-indigo-900/80 px-4 py-1 rounded-lg">${ssrInterpolate(product.sale > 1 ? Math.round(product.price * (1 - product.sale / 100)) : product.price)} ₽ </p></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`<footer class="text-gray-400 text-center py-4 text-sm w-full mt-auto relative z-10" style="${ssrRenderStyle({ "margin-bottom": "-20px", "animation": "fade-in 5s forwards" })}"> Все покупки носят виртуальный характер и не подлежат возврату </footer></div>`);
      _push(ssrRenderComponent(MainModal, {
        onMousedown: handleMouseDown,
        isOpen: showModal.value,
        title: modalTitle.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="absolute top-4 right-4 text-white"${_scopeId}>✕</button><div class="text-center mb-4"${_scopeId}>`);
            if (modalImage.value) {
              _push2(`<img style="${ssrRenderStyle({ "width": "250px", "height": "250px" })}"${ssrRenderAttr("src", modalImage.value)} alt="Product Image" class="w-50 h-50 object-contain mx-auto mb-3"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (!modalContent.value.includes("/empty")) {
              _push2(`<div class="text-white text-sm prose prose-invert max-w-none" style="${ssrRenderStyle({ "border-radius": "10px", "padding": "20px", "background-color": "rgb(107 107 107 / 10%)" })}"${_scopeId}>${modalContent.value ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (parsedAtr.value.length > 1) {
              _push2(`<div class="mb-4 border-t border-b border-gray-700 py-4"${_scopeId}><h3 class="text-lg font-semibold text-white mb-3 flex items-center"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"${_scopeId}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"${_scopeId}></path></svg> В составе </h3><div class="grid grid-cols-2 gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(parsedAtr.value, (item) => {
                _push2(`<div class="relative bg-gray-800 p-3 rounded-lg flex items-center backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-colors"${_scopeId}><div class="p-2 rounded-lg mr-3"${_scopeId}><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-10 h-10 object-contain"${_scopeId}></div><span class="text-sm font-semibold line-clamp-2"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                if (item.type === "blueprint") {
                  _push2(`<img src="/blueprint_icon.png" alt="blueprint" class="absolute top-1 right-1 w-6 h-6 z-50 drop-shadow-lg"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border border-indigo-400"${_scopeId}> x${ssrInterpolate(item.amount)}</span></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700" style="${ssrRenderStyle({ "border-radius": "10px", "background-color": "rgba(107, 107, 107, 0.1)", "margin-top": "10px" })}"${_scopeId}><h3 class="text-lg font-semibold text-white mb-3 flex items-center"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"${_scopeId}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"${_scopeId}></path><line x1="3" y1="6" x2="21" y2="6"${_scopeId}></line><path d="M16 10a4 4 0 0 1-8 0"${_scopeId}></path></svg> Количество </h3><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700"${_scopeId}><button class="text-white px-3 py-2 transition-all duration-200 focus:outline-none" style="${ssrRenderStyle({ "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" })}"${ssrIncludeBooleanAttr(quantity.value <= 1) ? " disabled" : ""}${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><line x1="5" y1="12" x2="19" y2="12"${_scopeId}></line></svg></button><div class="w-16 h-10 flex justify-center items-center bg-gray-600 rounded-lg text-white font-bold text-lg" style="${ssrRenderStyle({ "height": "36px", "border-radius": "0px" })}"${_scopeId}>${ssrInterpolate(displayedAmount.value)}</div><button class="text-white px-3 py-2 transition-all duration-200" style="${ssrRenderStyle({ "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" })}"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><line x1="12" y1="5" x2="12" y2="19"${_scopeId}></line><line x1="5" y1="12" x2="19" y2="12"${_scopeId}></line></svg></button></div><div class="text-right animate-fade-in"${_scopeId}>`);
            if (selectedProduct.value && selectedProduct.value.sale) {
              _push2(`<p class="text-sm text-gray-400 line-through"${_scopeId}>${ssrInterpolate(totalOriginalPrice.value)} ₽ </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xl font-bold text-white transition-all duration-300 transform scale-100"${_scopeId}>${ssrInterpolate(totalPrice.value)} ₽ </p></div></div></div><div class="mt-6 p-4 bg-gray-600 rounded-lg border border-indigo-600/50 backdrop-blur-sm shadow-lg" style="${ssrRenderStyle({ "margin-top": "10px", "padding": "15px", "background-color": "rgba(107, 107, 107, 0.1)" })}"${_scopeId}><div class="flex items-center"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/80 mr-3"${_scopeId}><circle cx="12" cy="12" r="10"${_scopeId}></circle><line x1="12" y1="16" x2="12" y2="12"${_scopeId}></line><line x1="12" y1="8" x2="12.01" y2="8"${_scopeId}></line></svg><p class="text-white/80 text-sm" style="${ssrRenderStyle({ "font-size": "9.2pt", "margin": "-2px -6px -4px" })}"${_scopeId}> Используйте /store для получения предмета на сервере </p></div></div><div class="mt-4 flex justify-between"${_scopeId}><button class="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-lg"${_scopeId}> Отмена </button><button class="px-5 py-2 text-white rounded-lg transition-colors shadow-lg flex items-center" style="${ssrRenderStyle({ "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" })}"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"${_scopeId}><circle cx="9" cy="21" r="1"${_scopeId}></circle><circle cx="20" cy="21" r="1"${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"${_scopeId}></path></svg> Приобрести </button></div>`);
          } else {
            return [
              createVNode("button", {
                onClick: ($event) => showModal.value = false,
                class: "absolute top-4 right-4 text-white"
              }, "✕", 8, ["onClick"]),
              createVNode("div", { class: "text-center mb-4" }, [
                modalImage.value ? (openBlock(), createBlock("img", {
                  key: 0,
                  style: { "width": "250px", "height": "250px" },
                  src: modalImage.value,
                  alt: "Product Image",
                  class: "w-50 h-50 object-contain mx-auto mb-3"
                }, null, 8, ["src"])) : createCommentVNode("", true)
              ]),
              !modalContent.value.includes("/empty") ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-white text-sm prose prose-invert max-w-none",
                style: { "border-radius": "10px", "padding": "20px", "background-color": "rgb(107 107 107 / 10%)" },
                innerHTML: modalContent.value
              }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
              parsedAtr.value.length > 1 ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mb-4 border-t border-b border-gray-700 py-4"
              }, [
                createVNode("h3", { class: "text-lg font-semibold text-white mb-3 flex items-center" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    class: "mr-2"
                  }, [
                    createVNode("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" })
                  ])),
                  createTextVNode(" В составе ")
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(parsedAtr.value, (item) => {
                    return openBlock(), createBlock("div", {
                      key: item.name,
                      class: "relative bg-gray-800 p-3 rounded-lg flex items-center backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-colors"
                    }, [
                      createVNode("div", { class: "p-2 rounded-lg mr-3" }, [
                        createVNode("img", {
                          src: item.image,
                          alt: item.name,
                          class: "w-10 h-10 object-contain"
                        }, null, 8, ["src", "alt"])
                      ]),
                      createVNode("span", { class: "text-sm font-semibold line-clamp-2" }, toDisplayString(item.name), 1),
                      item.type === "blueprint" ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: "/blueprint_icon.png",
                        alt: "blueprint",
                        class: "absolute top-1 right-1 w-6 h-6 z-50 drop-shadow-lg"
                      })) : createCommentVNode("", true),
                      createVNode("span", { class: "absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border border-indigo-400" }, " x" + toDisplayString(item.amount), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", {
                class: "mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700",
                style: { "border-radius": "10px", "background-color": "rgba(107, 107, 107, 0.1)", "margin-top": "10px" }
              }, [
                createVNode("h3", { class: "text-lg font-semibold text-white mb-3 flex items-center" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    class: "mr-2"
                  }, [
                    createVNode("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                    createVNode("line", {
                      x1: "3",
                      y1: "6",
                      x2: "21",
                      y2: "6"
                    }),
                    createVNode("path", { d: "M16 10a4 4 0 0 1-8 0" })
                  ])),
                  createTextVNode(" Количество ")
                ]),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700" }, [
                    createVNode("button", {
                      onClick: ($event) => updateQuantity(-1),
                      class: "text-white px-3 py-2 transition-all duration-200 focus:outline-none",
                      style: { "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" },
                      disabled: quantity.value <= 1
                    }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createVNode("line", {
                          x1: "5",
                          y1: "12",
                          x2: "19",
                          y2: "12"
                        })
                      ]))
                    ], 8, ["onClick", "disabled"]),
                    createVNode("div", {
                      class: "w-16 h-10 flex justify-center items-center bg-gray-600 rounded-lg text-white font-bold text-lg",
                      style: { "height": "36px", "border-radius": "0px" }
                    }, toDisplayString(displayedAmount.value), 1),
                    createVNode("button", {
                      onClick: ($event) => updateQuantity(1),
                      class: "text-white px-3 py-2 transition-all duration-200",
                      style: { "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" }
                    }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createVNode("line", {
                          x1: "12",
                          y1: "5",
                          x2: "12",
                          y2: "19"
                        }),
                        createVNode("line", {
                          x1: "5",
                          y1: "12",
                          x2: "19",
                          y2: "12"
                        })
                      ]))
                    ], 8, ["onClick"])
                  ]),
                  createVNode("div", { class: "text-right animate-fade-in" }, [
                    selectedProduct.value && selectedProduct.value.sale ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-gray-400 line-through"
                    }, toDisplayString(totalOriginalPrice.value) + " ₽ ", 1)) : createCommentVNode("", true),
                    createVNode("p", { class: "text-xl font-bold text-white transition-all duration-300 transform scale-100" }, toDisplayString(totalPrice.value) + " ₽ ", 1)
                  ])
                ])
              ]),
              createVNode("div", {
                class: "mt-6 p-4 bg-gray-600 rounded-lg border border-indigo-600/50 backdrop-blur-sm shadow-lg",
                style: { "margin-top": "10px", "padding": "15px", "background-color": "rgba(107, 107, 107, 0.1)" }
              }, [
                createVNode("div", { class: "flex items-center" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    class: "text-white/80 mr-3"
                  }, [
                    createVNode("circle", {
                      cx: "12",
                      cy: "12",
                      r: "10"
                    }),
                    createVNode("line", {
                      x1: "12",
                      y1: "16",
                      x2: "12",
                      y2: "12"
                    }),
                    createVNode("line", {
                      x1: "12",
                      y1: "8",
                      x2: "12.01",
                      y2: "8"
                    })
                  ])),
                  createVNode("p", {
                    class: "text-white/80 text-sm",
                    style: { "font-size": "9.2pt", "margin": "-2px -6px -4px" }
                  }, " Используйте /store для получения предмета на сервере ")
                ])
              ]),
              createVNode("div", { class: "mt-4 flex justify-between" }, [
                createVNode("button", {
                  onClick: ($event) => showModal.value = false,
                  class: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-lg"
                }, " Отмена ", 8, ["onClick"]),
                createVNode("button", {
                  onClick: ($event) => purchaseItem(selectedProduct.value),
                  class: "px-5 py-2 text-white rounded-lg transition-colors shadow-lg flex items-center",
                  style: { "background": "linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1)", "background-size": "300% 300%" }
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    class: "mr-2"
                  }, [
                    createVNode("circle", {
                      cx: "9",
                      cy: "21",
                      r: "1"
                    }),
                    createVNode("circle", {
                      cx: "20",
                      cy: "21",
                      r: "1"
                    }),
                    createVNode("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
                  ])),
                  createTextVNode(" Приобрести ")
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Products.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Monitoring",
  __ssrInlineRender: true,
  props: {
    selectedServerId: {
      type: [Number, String, null],
      default: 1
    }
  },
  emits: ["server-selected"],
  setup(__props, { emit: __emit }) {
    const { t, locale } = useI18n();
    const servers = ref([]);
    const hoveredServer = ref(null);
    const sortedServers = computed(() => {
      return servers.value.sort((a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      });
    });
    const totalOnline = computed(() => {
      return servers.value.reduce((sum, server) => sum + (server.online || 0), 0);
    });
    const totalOnlinePlusTwoConditional = computed(() => {
      let total = 0;
      servers.value.forEach((server) => {
        total += server.status === "Доступен" ? (server.online || 0) + 2 : server.online || 0;
      });
      return total;
    });
    const totalSlots = computed(() => {
      return servers.value.reduce((sum, server) => sum + (server.slots || 0), 0);
    });
    const totalJoining = computed(() => {
      return servers.value.reduce((sum, server) => sum + (server.joining || 0), 0);
    });
    const totalQueue = computed(() => {
      return servers.value.reduce((sum, server) => sum + (server.queue || 0), 0);
    });
    const getServerConnectString = (server) => {
      if (server.ip && server.port) {
        return `${server.ip}:${server.port}`;
      }
      return "Unknown Server";
    };
    const fetchServers = async () => {
      try {
        const response = await axios.get("/api/servers");
        servers.value = response.data;
      } catch (error) {
        console.error("Ошибка загрузки данных серверов:", error);
        servers.value = [];
      }
    };
    onMounted(() => {
      fetchServers();
      setInterval(fetchServers, 3e5);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg" }, _attrs))}><h2 class="text-xl font-bold mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> ${ssrInterpolate(_ctx.$t("monitoring_servers"))}</h2>`);
      if (servers.value && servers.value.length > 0) {
        _push(`<div class="space-y-6"><div class="space-y-3"><!--[-->`);
        ssrRenderList(sortedServers.value, (server) => {
          _push(`<div class="${ssrRenderClass([
            "flex justify-between items-center p-4 rounded-xl transition-all duration-300 cursor-pointer",
            "bg-black/20 border border-gray-700",
            { "border-[#6366f1] active-shadow": __props.selectedServerId === server.id },
            { "transform hover:scale-105": hoveredServer.value === server.id }
          ])}" style="${ssrRenderStyle({ "padding": "10px", "min-width": "335px", "max-width": "900px" })}"><div class="flex items-center space-x-3"><div class="${ssrRenderClass([
            "w-10 h-10 rounded-lg flex items-center justify-center",
            (server.status === "Доступен" ? server.online + 2 : server.online) > 0 ? "bg-green-500/20" : "bg-green-500/20"
          ])}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", (server.status === "Доступен" ? server.online + 2 : server.online) > 0 ? "rgb(34, 197, 94)" : "rgb(34, 197, 94)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div><div><p class="text-sm font-bold">${ssrInterpolate(server.name)}</p><div class="flex items-center mt-1"><div class="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden mr-2" style="${ssrRenderStyle({ "width": "114px" })}"><div style="${ssrRenderStyle(`width: ${(server.status === "Доступен" ? server.online + 2 : server.online) / server.slots * 100}%`)}" class="${ssrRenderClass([
            "h-full absolute left-0 top-0 z-10",
            (server.status === "Доступен" ? server.online + 2 : server.online) / server.slots > 0.8 ? "bg-red-500" : (server.status === "Доступен" ? server.online + 2 : server.online) / server.slots > 0.5 ? "bg-yellow-500" : "bg-green-500"
          ])}"></div>`);
          if (server.joining > 0) {
            _push(`<div style="${ssrRenderStyle(`width: ${server.joining / server.slots * 100}%; left: ${(server.status === "Доступен" ? server.online + 2 : server.online) / server.slots * 100}%`)}" class="h-full rounded-r-full absolute top-0 z-20 bg-amber-500"></div>`);
          } else {
            _push(`<!---->`);
          }
          if (server.queue > 0) {
            _push(`<div style="${ssrRenderStyle(`width: ${server.queue / server.slots * 100}%; left: ${((server.status === "Доступен" ? server.online + 2 : server.online) + server.joining) / server.slots * 100}%`)}" class="h-full rounded-full absolute top-0 z-30 bg-amber-500"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-xs text-gray-400">${ssrInterpolate(server.status === "Доступен" ? server.online + 2 : server.online)} / ${ssrInterpolate(server.slots)} `);
          if (server.joining > 0) {
            _push(`<span class="text-amber-500"> +${ssrInterpolate(server.joining)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (server.queue > 0) {
            _push(`<span class="text-purple-400"> (${ssrInterpolate(server.queue)} ${ssrInterpolate(_ctx.$t("in_queue"))})</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><div class="flex items-center mt-1 space-x-2"><p class="text-xs text-gray-400" style="${ssrRenderStyle({ "letter-spacing": "0.06rem", "font-size": "13px" })}"><span class="text-indigo-400">connect</span> ${ssrInterpolate(getServerConnectString(server))}</p></div></div></div><div class="flex items-center space-x-3">`);
          if (server.ping > 0) {
            _push(`<div class="text-xs text-gray-400">${ssrInterpolate(server.ping)}ms </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="${ssrRenderClass([
            "text-xs font-bold px-3 py-1 rounded-full",
            server.status === "Доступен" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          ])}">${ssrInterpolate(_ctx.$t(server.status === "Доступен" ? "server_available" : "server_notavailable"))}</div></div></div>`);
        });
        _push(`<!--]--></div><div class="space-y-3">`);
        if (totalOnline.value > 0) {
          _push(`<div class="flex justify-between items-center p-2 rounded-xl bg-gray-800/50 border border-gray-700"><span class="text-sm font-medium px-2">${ssrInterpolate(_ctx.$t("all_servers"))}</span><div class="flex items-center"><div class="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden mr-2"><div style="${ssrRenderStyle(`width: ${totalOnlinePlusTwoConditional.value / totalSlots.value * 100}%`)}" class="${ssrRenderClass([
            "h-full absolute left-0 top-0 z-10",
            totalOnlinePlusTwoConditional.value / totalSlots.value > 0.8 ? "bg-red-500" : totalOnlinePlusTwoConditional.value / totalSlots.value > 0.5 ? "bg-yellow-500" : "bg-green-500"
          ])}"></div>`);
          if (totalQueue.value > 0) {
            _push(`<div style="${ssrRenderStyle(`width: ${totalQueue.value / totalSlots.value * 100}%; left: ${(totalOnline.value + totalJoining.value + 2) / totalSlots.value * 100}%`)}" class="h-full rounded-r-full absolute top-0 z-20 bg-amber-500"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="text-xs text-gray-400">${ssrInterpolate(totalOnlinePlusTwoConditional.value)} / ${ssrInterpolate(totalSlots.value)} `);
          if (totalJoining.value > 0) {
            _push(`<span class="text-amber-500"> +${ssrInterpolate(totalJoining.value)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/Monitoring.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "BonusInfo",
  __ssrInlineRender: true,
  setup(__props) {
    const bonuses = ref([]);
    async function fetchBonuses() {
      try {
        const res = await fetch("/api/payment-bonuses");
        const data = await res.json();
        bonuses.value = data.map((item) => ({
          amount: Number(item.threshold),
          bonus: Number(item.percent)
        })).sort((a, b) => b.amount - a.amount);
      } catch (e) {
        console.error("Ошибка загрузки бонусов:", e);
      }
    }
    onMounted(() => {
      fetchBonuses();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg mt-5" }, _attrs))}><h2 class="text-xl font-semibold mb-4">🎁 Бонусы при пополнении</h2><div class="space-y-3"><!--[-->`);
      ssrRenderList(bonuses.value, (item, index2) => {
        _push(`<div class="flex justify-between items-center bg-black/20 rounded-lg px-4 py-3 border border-white/10"><div><p class="text-sm text-white/70">Пополнение от</p><p class="text-lg font-bold">${ssrInterpolate(item.amount.toLocaleString())} ₽</p></div><div class="bg-green-500/10 text-green-400 font-semibold text-sm px-3 py-1 rounded-lg"> +${ssrInterpolate(item.bonus)}% </div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/User/BonusInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  props: ["auth"],
  setup(__props) {
    const isMobile = ref(false);
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };
    onMounted(() => {
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", checkIfMobile);
    });
    const servers = ref([]);
    const categories = ref([]);
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const activeCategoryId = ref(null);
    const activeServerId = ref(1);
    ref(0.7);
    const handleServerSelection = (serverId) => {
      console.log("Выбран сервер с ID:", serverId);
      activeServerId.value = serverId;
      const selectedServer = servers.value.find((server) => server.id === serverId);
      if (selectedServer) {
        console.log("Выбранный сервер:", selectedServer.name);
      }
    };
    const handleSearch = (query, categoryId, serverId) => {
      searchQuery.value = query;
      activeCategoryId.value = categoryId;
      if (serverId !== void 0) {
        activeServerId.value = serverId;
      }
    };
    onMounted(async () => {
      try {
        const response = await axios.get("/api/shop-data");
        servers.value = response.data.servers;
        categories.value = response.data.categories;
        products.value = response.data.shop_items;
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        loading.value = false;
      }
    });
    const authError = ref("");
    const page = usePage();
    const showError = ref(false);
    onMounted(() => {
      var _a;
      console.log("error mes sec load. DONE");
      const urlParams = new URLSearchParams(window.location.search);
      const err = urlParams.get("auth_error") || ((_a = page.props.flash) == null ? void 0 : _a.auth_error);
      if (err) {
        authError.value = err;
        showError.value = true;
        if (urlParams.has("auth_error")) {
          urlParams.delete("auth_error");
          const newUrl = window.location.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
          window.history.replaceState({}, "", newUrl);
        }
        setTimeout(() => {
          showError.value = false;
        }, 3e3);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Slider = resolveComponent("Slider");
      _push(`<!--[--><div class="background-image" data-v-6058f81a></div><div class="flex bg-gray-900 bg-opacity-50 min-h-screen h-full w-full relative z-10 flex-col" data-v-6058f81a><h1 class="sr-only" data-v-6058f81a>Сервера Rust</h1><div class="flex-1" data-v-6058f81a>`);
      _push(ssrRenderComponent(Navbar, { auth: __props.auth }, null, _parent));
      _push(`<div class="${ssrRenderClass([{ "auth-error--visible": showError.value }, "auth-error"])}" data-v-6058f81a>${ssrInterpolate(authError.value)}</div><div class="container mx-auto mt-4 content-container" data-v-6058f81a><div class="flex flex-col md:flex-row gap-4 justify-center rela-test" data-v-6058f81a><div class="hidden md:block" data-v-6058f81a>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        servers: servers.value,
        selectedServerId: activeServerId.value,
        onServerSelected: handleServerSelection
      }, null, _parent));
      _push(`</div><div class="w-full max-w-4xl" data-v-6058f81a>`);
      _push(ssrRenderComponent(_component_Slider, null, null, _parent));
      _push(`<div class="md:hidden w-full mb-4" data-v-6058f81a>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        servers: servers.value,
        selectedServerId: activeServerId.value,
        onServerSelected: handleServerSelection
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        categories: categories.value,
        servers: servers.value,
        onSearch: handleSearch
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        auth: __props.auth,
        products: products.value,
        loading: loading.value,
        searchQuery: searchQuery.value,
        activeCategoryId: activeCategoryId.value,
        activeServerId: activeServerId.value
      }, null, _parent));
      _push(`</div><div class="hidden md:block" data-v-6058f81a>`);
      _push(ssrRenderComponent(_sfc_main$7, { servers: servers.value }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
      if (isMobile.value) {
        _push(`<div class="w-full mb-4" data-v-6058f81a>`);
        _push(ssrRenderComponent(_sfc_main$7, { servers: servers.value }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6058f81a"]]);
export {
  index as default
};
