<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div
                v-if="isVisible"
                @mousedown.self="handleMouseDown"
                class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
            >
                <transition name="modal-slide">
                    <div
                        v-if="isVisible"
                        style="max-height: 100%; overflow: auto;"
                        class="bg-gray-900/90 text-white w-full max-w-3xl rounded-xl p-6 relative shadow-2xl border border-gray-800"
                    >
                        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                         class="text-indigo-600">
                                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                        <line x1="2" y1="10" x2="22" y2="10"></line>
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Выберите способ оплаты</h2>
                            </div>

                            <button
                                @click="close"
                                class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="p-6 space-y-8">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Способы оплаты</h3>
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div
                                        v-for="method in paymentMethods"
                                        :key="method.name"
                                        @click="selectMethod(method)"
                                        :class="[
                        'group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg',
                        selectedMethod?.name === method.name
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600'
                      ]"
                                    >
                                        <div v-if="selectedMethod?.name === method.name"
                                             class="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                                                 class="text-white">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>

                                        <div class="flex flex-col items-center text-center space-y-3">
                                            <div class="">
                                                <img :src="method.icon" alt="" class="w-16 h-16 object-contain"/>
                                            </div>
                                            <div>
                                                <span class="font-semibold text-gray-900 dark:text-white block">{{ method.name }}</span>
                                                <span class="text-sm text-gray-500 dark:text-gray-400">от {{ method.minAmount }}₽</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Сумма пополнения
                                </label>
                                <div class="relative">
                                    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                                        ₽
                                    </div>
                                    <input
                                        type="number"
                                        v-model="formattedAmount"
                                        class="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                                        placeholder="1000"
                                        @input="calculateBonus"
                                        step="any"
                                    />
                                </div>
                            </div>

                            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                         class="text-indigo-600 mr-2">
                                        <polygon points="12 2 15.09 8.26 22 9 17 14.74 18.18 21.02 12 17.77 5.82 21.02 7 14.74 2 9 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    Получите бонус
                                </h3>

                                <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                    <div
                                        v-for="bonus in bonusTiers"
                                        :key="bonus.threshold"
                                        @click="selectBonus(bonus)"
                                        :class="[
                        'relative p-4 rounded-xl text-center cursor-pointer transition-all duration-300',
                        isActiveBonus(bonus)
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105 transform'
                          : selectedBonus && parseFloat(bonus.threshold) < parseFloat(selectedBonus.threshold)
                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      ]"
                                    >
                                        <div class="flex flex-col items-center space-y-1">
                      <span class="text-2xl font-bold" :class="isActiveBonus(bonus) ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'">
                        +{{ parseFloat(bonus.percent).toFixed(0) }}%
                      </span>
                                            <span class="text-xs" :class="isActiveBonus(bonus) ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'">
                        от {{ formatNumber(bonus.threshold) }}₽
                      </span>
                                        </div>

                                        <div v-if="selectedBonus && parseFloat(bonus.threshold) < parseFloat(selectedBonus.threshold)"
                                             class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                                                 class="text-white">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="selectedBonus && calculatedBonusAmount > 0"
                                     class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600 dark:text-gray-400 font-medium">К зачислению:</span>
                                        <div class="flex items-center space-x-2">
                                            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formattedAmount }}₽</span>
                                            <span class="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        +{{ formatNumber(calculatedBonusAmount) }}₽
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                @click="processPayment"
                                :disabled="cooldown"
                                class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                    <line x1="2" y1="10" x2="22" y2="10"></line>
                                </svg>
                                <span>{{ cooldown ? 'Обработка...' : 'Пополнить баланс' }}</span>
                            </button>

                            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                         class="text-indigo-600 mr-2">
                                        <path d="M21 12c0 1-2 3-2 3l-6-3 6-3s2 2 2 3"></path>
                                        <path d="M3 12l6-3-6-3c-1 1-1 5 0 6"></path>
                                        <path d="M9 9v6"></path>
                                        <path d="M15 9v6"></path>
                                    </svg>
                                    Активировать промокод
                                </label>
                                <div class="flex space-x-3">
                                    <input
                                        type="text"
                                        v-model="promoCode"
                                        class="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                                        placeholder="Введите промокод"
                                    />
                                    <button
                                        @click="activatePromoCode"
                                        :disabled="cooldown || !promoCode.trim()"
                                        class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                    >
                                        Применить
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Notify
                            v-if="notify"
                            :title="notify.title"
                            :message="notify.message"
                            :status="notify.status"
                        />
                    </div>
                </transition>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from "vue";
import axios from "axios";
import Notify from "@/Components/User/Toast.vue";

const props = defineProps({
    isVisible: Boolean,
});

const emit = defineEmits(["close"]);
const cooldown = ref(false);

const close = () => {
    unlockScroll();
    emit("close");
};

const lockScroll = () => {
    document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
    document.documentElement.style.overflow = '';
};

const paymentMethods = [
    {name: "СБП #1", hiddenName: "antilopay", additional: 'card', fee: "5%", icon: "/images/payments/sbp.jpg", minAmount: 50},
    {name: "БАНКОВСКИЕ КАРТЫ №1", hiddenName: "antilopay", additional: 'card', fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50},
    {name: "СБП #2", hiddenName: "morune", additional: 'sbp', fee: "5%", icon: "/images/payments/sbp.jpg", minAmount: 50},
    {name: "БАНКОВСКИЕ КАРТЫ №2", hiddenName: "morune", additional: 'card', fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50},
    {name: "Криптовалюта", hiddenName: "crypto", additional: 'card', fee: "5%", icon: "/images/payments/crypto.png", minAmount: 50},
    {name: "Другое #1", hiddenName: "cent", additional: 'card', fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50},
    {name: "Другое #2", hiddenName: "freekassa", additional: 'card', fee: "5%", icon: "/images/payments/cards.jpg", minAmount: 50},

];

const selectedMethod = ref(null);
const amount = ref(100);

const formattedAmount = computed({
    get() {
        return amount.value.toString().replace(/\.0+$/, '');
    },
    set(value) {
        amount.value = parseFloat(value) || 0;
    }
});

const promoCode = ref("");
const notify = ref(null);
const selectedBonus = ref(null);
const calculatedBonusAmount = ref(0);

const totalAmount = computed(() => {
    const baseAmount = parseFloat(amount.value) || 0;
    return baseAmount + calculatedBonusAmount.value;
});

const selectMethod = (method) => {
    selectedMethod.value = method;
};

const selectBonus = (bonus) => {
    if (cooldown.value) return;
    cooldown.value = true;
    setTimeout(() => (cooldown.value = false), 500);

    selectedBonus.value = bonus;
    amount.value = String(bonus.threshold);
    calculateBonus();
};

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

const processPayment = async () => {
    if (cooldown.value) return;
    cooldown.value = true;
    setTimeout(() => (cooldown.value = false), 2000);

    if (!selectedMethod.value) {
        showNotify("Ошибка", "Выберите способ оплаты", "error");
        return;
    }

    if (!amount.value || parseFloat(amount.value) <= 0) {
        showNotify("Ошибка", "Введите корректную сумму", "error");
        return;
    }

    if (parseFloat(amount.value) < selectedMethod.value.minAmount) {
        showNotify(
            "Ошибка",
            `Минимальная сумма для ${selectedMethod.value.name}: ${selectedMethod.value.minAmount}₽`,
            "error"
        );
        return;
    }

    if (selectedBonus.value && parseFloat(amount.value) < parseFloat(selectedBonus.value.threshold)) {
        showNotify(
            "Ошибка",
            `Для получения бонуса ${selectedBonus.value.percent}% минимальная сумма: ${selectedBonus.value.threshold}₽`,
            "error"
        );
        return;
    }

    try {
        const hiddenName = selectedMethod.value.hiddenName;

      const paymentRoute = hiddenName.startsWith("morune")
          ? "/payment/morune/redirect"
          : hiddenName === "antilopay"
              ? "/payment/antilopay/redirect"
              : hiddenName === "crypto"
                  ? "/payment/crypto/redirect"
                  : hiddenName === "cent"
                      ? "/payment/cent/redirect"
                      : hiddenName === "freekassa"
                          ? "/payment/freekassa/redirect"
                             : "/payment/default/redirect";

        const response = await axios.post(paymentRoute, {
            amount: Number(amount.value),
            method_name: selectedMethod.value.name,
             additional_method : selectedMethod.value.additional,
            hiddenName,
        });

        const url = response.data?.redirectUrl || response.data?.payment_url;

        if (url) {
            window.open(url, "_blank");
        } else {
            showNotify("Ошибка", "Ошибка при создании платежа", "error");
        }
    } catch (error) {
        console.error('Ошибка при создании платежа:', error);
        if (error.response) {
            showNotify("Ошибка", "Ошибка при создании платежа", "error");
        } else {
            showNotify("Ошибка", "Ошибка сети, проверьте подключение", "error");
        }
    }
};

const activatePromoCode = async () => {
    if (cooldown.value) return;
    cooldown.value = true;
    setTimeout(() => (cooldown.value = false), 2000);

    if (!promoCode.value.trim()) {
        showNotify("Ошибка", "Введите промокод", "error");
        return;
    }

    try {
        const response = await axios.post("/promo/activate", {code: promoCode.value});

        if (response.status === 200) {
            showNotify("Успех", "Промокод успешно активирован!", "success");
        }
    } catch (error) {
        if (error.response) {
            const {status} = error.response;

            if (status === 400) {
                showNotify("Ошибка", "Неверный промокод", "error");
            } else if (status === 429) {
                showNotify("Ошибка", "Слишком много попыток", "error");
            } else {
                showNotify("Ошибка", "Ошибка сервера", "error");
            }
        } else {
            showNotify("Ошибка", "Ошибка сети", "error");
        }
    }

    promoCode.value = "";
};

const showNotify = (title, message, status) => {
    notify.value = {title, message, status};
    setTimeout(() => (notify.value = null), 3000);
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

const handleMouseDown = (event) => {
    if (event.target === event.currentTarget) {
        close();
    }
};

onMounted(async () => {
    try {
        const response = await axios.get('/api/payment-bonuses');
        bonusTiers.value = response.data;
        if (bonusTiers.value.length > 0) {
            const smallestBonus = [...bonusTiers.value].sort((a, b) =>
                parseFloat(a.threshold) - parseFloat(b.threshold)
            )[0];

            selectedBonus.value = smallestBonus;
            amount.value = String(smallestBonus.threshold);
            calculateBonus();
        }
    } catch (error) {
        console.error('Ошибка при загрузке бонусов:', error);
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
        {immediate: true}
    );
});

onUnmounted(() => {
    unlockScroll();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active {
    animation: modalSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
    animation: modalSlide 0.3s ease-in reverse;
}

@keyframes modalSlide {
    from {
        transform: translateY(30px) scale(0.95);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #4f46e5;
}
</style>
