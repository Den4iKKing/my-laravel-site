<script setup>
import {computed, ref} from "vue";
import axios from "axios";
import MainModal from "@/Components/User/Modal.vue";
import Notify from "@/Components/User/Toast.vue";
import NotifyStack from "@/Components/User/NotifyStack.vue";

const props = defineProps({
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
});

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
        const matchesSearch =
            product.name?.toLowerCase().includes(query);

        const matchesCategory = props.activeCategoryId
            ? product.category_id === props.activeCategoryId
            : true;

        const matchesServer = props.activeServerId
            ? product.server_id === props.activeServerId
            : true;

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
            if (atrItems.length > 1) return 0; // вот тут твоя проверочка
            return atrItems[0].amount || 0;
        }

        return 0;
    } catch (e) {
        console.error('Ошибка при парсинге atr:', e);
        return 0;
    }
};



const openModal = async (productId) => {
    try {
        quantity.value = 1;
        const response = await axios.get(`/api/shop-item/${productId}`);
        selectedProduct.value = response.data;

        modalTitle.value =  selectedProduct.value.name;
        modalImage.value = selectedProduct.value.image;
        modalContent.value = selectedProduct.value.about;

        showModal.value = true;
    } catch (error) {
        console.error("Error fetching product info:", error);
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
        console.error('Ошибка при парсинге product.atrs:', e);
        return null;
    }
}

const incrementQuantity = () => {
    quantity.value += 1;
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
};

const handleQuantityInput = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
        quantity.value = value;
    } else {
        quantity.value = 1;
    }
};

const showNotify = (title, message, status) => {
    notifyStack.value?.addNotification(title, message, status, 3000);
};

const purchaseItem = async (product) => {
    if (!props.auth?.user) {
        console.warn('Не авторизован');
        showNotify('Ошибка', 'Войдите в аккаунт, чтобы купить товар', 'error');
        return;
    }

    
    if (cooldown.value) {
        showNotify('Ошибка', 'Подождите перед следующей покупкой', 'error');
        return;
    }

    const basePrice = product.original_price;
    const discount = product.sale && product.sale > 0 ? product.sale / 100 : 0;
    const finalPrice = basePrice * (1 - discount);
    const totalCost = Math.round(finalPrice * quantity.value);

    if (props.auth.user.balance < totalCost) {
        showNotify('Ошибка', 'Недостаточно средств', 'error');
        return;
    }

    cooldown.value = true;
    setTimeout(() => (cooldown.value = false), 300);

    try {
        const response = await fetch(`/shop/buy/${product.id}?quantity=${quantity.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
        });

        if (response.status === 200) {
            await response.json();
            showNotify('Успех', 'Товар куплен', 'success');
        } else {
            throw new Error();
        }
    } catch (error) {
        showNotify('Ошибка', 'Недостаточно средств', 'error');
    }
};



const quantity = ref(1);

const displayedAmount = computed(() => {
    if (!selectedProduct.value || !parsedAtr.value.length) return quantity.value;

    const items = parsedAtr.value.filter(i => i.type === "item");

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
</script>

<template>
    <NotifyStack ref="notifyStack"/>
    <Notify
        v-if="notify"
        :title="notify.title"
        :message="notify.message"
        :status="notify.status"
    />
    <div class="bg-gray-900/90 p-6 rounded-b-xl shadow-lg border border-gray-800"
         style="margin-bottom: 5px; border-top: none; position: relative; padding-top: 3px;">

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
            <div v-for="n in 12" :key="n" class="bg-gray-800/70 p-4 rounded-xl animate-pulse border border-gray-700">
                <div class="w-full h-32 bg-gray-700 rounded-lg mb-3"></div>
                <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
          <div
              v-for="product in filteredProducts"
              :key="product.id"
              :class="[
  'relative bg-gray-800/70 hover:bg-[#2a2a2ae6] p-5 rounded-2xl text-white cursor-pointer transition-all duration-500 ease-in-out shadow-md hover:shadow-indigo-glow flex flex-col items-center hover:scale-105',
  `class-custom-item-${product.id}`
]"
              @click="openModal(product.id)"
              :style="getProductAtrType(product) === 'blueprint' ? {
  backgroundImage: `url(https://static.wikia.nocookie.net/play-rust/images/b/ba/Building_Plan_icon.png)`,
  backgroundSize: '160px 160px',
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  position: 'relative'
} : {}"
              style="transition: all 0.5s ease-in-out; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
              @mouseenter="$event.target.style.boxShadow = '0 20px 40px -12px rgba(99, 102, 241, 0.4), 0 12px 25px -8px rgba(139, 92, 246, 0.3), 0 8px 16px -4px rgba(168, 85, 247, 0.2)'"
              @mouseleave="$event.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'"
          >
            <div
                v-if="product.sale"
                class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7); background-size: 200% 200%; animation: gradientMove 6s ease infinite;"
            >
              -{{ product.sale }}%
            </div>

            <div
                v-if="getProductAmount(product) > 1"
                class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                style="background: linear-gradient(135deg, #6a5acd, #00c3ff); background-size: 200% 200%; animation: gradientMove 6s ease infinite; text-shadow: 0 0 6px rgba(0,0,0,0.7);"
            >
              x{{ getProductAmount(product) }}
            </div>

            <div class="flex items-center justify-center rounded-xl p-3 mb-4 w-full h-36">
              <img
                  :src="product.image"
                  alt="product"
                  class="max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  style="transform: scale(1.3);"
              />
            </div>

            <h3
                class="text-center font-semibold text-base line-clamp-2 mb-2 px-2"
                style="color: #e0e7ff;"
            >
              {{ product.name }}
            </h3>

            <div class="flex items-center gap-3">
              <p
                  v-if="product.sale > 1"
                  class="text-sm font-semibold line-through text-indigo-300 bg-indigo-700/40 px-3 py-1 rounded-lg select-none"
              >
                {{ product.price }} ₽
              </p>
              <p
                  class="text-lg font-bold text-indigo-100 bg-indigo-900/80 px-4 py-1 rounded-lg"
              >
                {{ product.sale > 1 ? Math.round(product.price * (1 - product.sale / 100)) : product.price }} ₽
              </p>
            </div>
          </div>
        </div>
        <footer class="text-gray-400 text-center py-4 text-sm w-full mt-auto relative z-10" style="margin-bottom: -20px; animation: fade-in 5s forwards;">
            Все покупки носят виртуальный характер и не подлежат возврату
        </footer>
    </div>

    <MainModal
        @mousedown.self="handleMouseDown"
        :isOpen="showModal"
        :title="modalTitle"
    >
        <button @click="showModal = false" class="absolute top-4 right-4 text-white">✕</button>

        <div class="text-center mb-4">
            <img
                style="width: 250px; height: 250px"
                v-if="modalImage"
                :src="modalImage"
                alt="Product Image"
                class="w-50 h-50 object-contain mx-auto mb-3"
            />
        </div>
        <div
            v-if="!modalContent.includes('/empty')"
            class="text-white text-sm prose prose-invert max-w-none"
            style="border-radius: 10px; padding: 20px; background-color: rgb(107 107 107 / 10%);"
            v-html="modalContent">
        </div>
        <div v-if="parsedAtr.length > 1" class="mb-4 border-t border-b border-gray-700 py-4">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path
                        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                В составе
            </h3>
            <div class="grid grid-cols-2 gap-3">
                <div
                    v-for="item in parsedAtr"
                    :key="item.name"
                    class="relative bg-gray-800 p-3 rounded-lg flex items-center backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-colors"
                >
                    <div class="p-2 rounded-lg mr-3">
                        <img :src="item.image" :alt="item.name" class="w-10 h-10 object-contain"/>
                    </div>
                    <span class="text-sm font-semibold line-clamp-2">{{ item.name }}</span>

                    <img
                        v-if="item.type === 'blueprint'"
                        src="/blueprint_icon.png"
                        alt="blueprint"
                        class="absolute top-1 right-1 w-6 h-6 z-50 drop-shadow-lg"
                    />

                    <span
                        class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border border-indigo-400"
                    >
        x{{ item.amount }}
      </span>
                </div>
            </div>
        </div>

        <div class="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
             style="border-radius: 10px; background-color: rgba(107, 107, 107, 0.1); margin-top: 10px;">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Количество
            </h3>

            <div class="flex items-center justify-between">
                <div class="flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <button
                        @click="updateQuantity(-1)"
                        class="text-white px-3 py-2 transition-all duration-200 focus:outline-none"
                        style="background: linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1); background-size: 300% 300%;"
                        :disabled="quantity <= 1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>

                    <div class="w-16 h-10 flex justify-center items-center bg-gray-600 rounded-lg text-white font-bold text-lg"
                         style="height: 36px; border-radius: 0px">
                        {{ displayedAmount }}
                    </div>

                    <button
                        @click="updateQuantity(1)"
                        class="text-white px-3 py-2 transition-all duration-200"
                        style="background: linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1); background-size: 300% 300%;"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>


                <div class="text-right animate-fade-in">
                    <p v-if="selectedProduct && selectedProduct.sale" class="text-sm text-gray-400 line-through">
                        {{ totalOriginalPrice }} ₽
                    </p>
                    <p class="text-xl font-bold text-white transition-all duration-300 transform scale-100">
                        {{ totalPrice }} ₽
                    </p>
                </div>
            </div>

        </div>
        <div class="mt-6 p-4 bg-gray-600 rounded-lg border border-indigo-600/50 backdrop-blur-sm shadow-lg"
             style="margin-top: 10px; padding: 15px; background-color: rgba(107, 107, 107, 0.1);">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-white/80 mr-3">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p class="text-white/80 text-sm" style="font-size: 9.2pt; margin: -2px -6px -4px;">
                  Используйте /store для получения предмета на сервере
                </p>
            </div>
        </div>
        <div class="mt-4 flex justify-between">
            <button
                @click="showModal = false"
                class="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-lg"
            >
                Отмена
            </button>
            <button
                @click="purchaseItem(selectedProduct)"
                class="px-5 py-2 text-white rounded-lg transition-colors shadow-lg flex items-center"
                style="background: linear-gradient(-45deg, #6366f1, #8b5cf6, #a855f7, #6366f1); background-size: 300% 300%;"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Приобрести
            </button>
        </div>


    </MainModal>
</template>

<style>
.modal-fade-enter-active .prose {
    overflow-y: auto;
    scrollbar-width: none;
}

.modal-fade-enter-active .prose::-webkit-scrollbar {
    display: none;
}

*::-webkit-scrollbar {
    width: 0 !important;
    display: none !important;
}

* {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

.modal-container {
    overflow-y: auto;
    scrollbar-width: none;
}

.modal-container::-webkit-scrollbar {
    display: none;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
