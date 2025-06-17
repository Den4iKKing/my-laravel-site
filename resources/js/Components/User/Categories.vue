<template>
    <div class="bg-gray-900/90 text-white p-6 rounded-t-xl border border-gray-800 shadow-lg"
         style="border-bottom: none;">
        <h2 class="text-xl font-bold mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Магазин
        </h2>

        <div class="mb-6 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <input
                v-model="searchQuery"
                type="text"
                id="product-search"
                name="product-search"
                placeholder="Поиск по товарам..."
                class="w-full px-4 py-3 pl-12 bg-gray-800/80 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-300 outline-none"
                style="box-shadow: rgba(255, 255, 255, 0.13) 0px 0px 0px 1px; border: none;"
            />
            <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-400 mb-3 flex items-center">
                <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="mr-2">
                    <polygon  points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Категории товаров
            </h3>
        </div>
        <div class="flex flex-wrap gap-3"
             v-if="categories && categories.length > 0">
            <button
                class="flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                :class="!activeCategory
                    ? 'bg-[#6366f1] border border-gray-700 text-gray-200'
                    : 'bg-gray-800/70 hover:bg-[#6366f1] border border-gray-700 text-gray-200'"
                @click="showAll"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                Все товары
            </button>
            <button
                v-for="category in categories"
                :key="category.id"
                class="flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                :class="category.id === activeCategory
                    ? 'bg-[#6366f1] border border-gray-700 text-gray-200'
                    : 'bg-gray-800/70 hover:bg-[#6366f1] border border-gray-700 text-gray-200'"
                @click="setActiveCategory(category)"
            >
                <div v-if="category.icon"
                     v-html="sanitizeSvg(category.icon)"
                     class="w-5 h-5 mr-2 flex-shrink-0" style="height: 20px"
                     :class="category.id === activeCategory ? 'text-white' : 'text-gray-400'"
                ></div>
                <span>{{ category.name }}</span>
            </button>
        </div>

        <div v-else class="animate-pulse">
            <div class="flex flex-wrap gap-3">
                <div v-for="n in 5" :key="n" class="bg-gray-800/70 rounded-lg h-10 w-32 border border-gray-700"></div>
            </div>
        </div>

    </div>
</template>

<script setup>
import {ref, watch, computed} from "vue";

const props = defineProps(["categories", "onSearch"]);
const emit = defineEmits(["update:searchQuery", "reset"]);

const searchQuery = ref("");
const activeCategory = ref(null);

const showAll = () => {
    activeCategory.value = null;
    props.onSearch(searchQuery.value, null);
};

const setActiveCategory = (selectedCategory) => {
    activeCategory.value = selectedCategory.id;
    props.onSearch(searchQuery.value, selectedCategory.id);
};

const clearSearch = () => {
    searchQuery.value = "";
    props.onSearch("", activeCategory.value);
    emit("update:searchQuery", "");
};

const resetFilters = () => {
    searchQuery.value = "";
    activeCategory.value = null;
    props.onSearch("", null);
    emit("reset");
};

watch(searchQuery, (newQuery) => {
    props.onSearch(newQuery, activeCategory.value);
    emit("update:searchQuery", newQuery);
});

const sanitizeSvg = (svg) => {
    if (typeof svg === 'string') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = doc.documentElement;

        svgElement.setAttribute('height', '20px');

        return svgElement.outerHTML;
    }
    return svg;
};
</script>
