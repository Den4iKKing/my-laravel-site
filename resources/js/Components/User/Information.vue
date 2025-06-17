<template>
    <div
        class="bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg mb-[15px] min-w-[21vw] max-w-[700px] max-h-[320px] min-h-[200px]">

        <h3 class="text-xl font-bold mb-6 flex items-center" style="margin-bottom: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            Информация

        </h3>

        <div class="grid grid-cols-2 gap-4 mb-6">
            <div
                @click="openModal('rules')"
                class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
                <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="rgb(168, 85, 247)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="m9 12 2 2 4-4"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-center font-bold">Правила
                </p>
            </div>
            <div
                @click="openModal('servers')"
                class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
                <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="rgb(99, 102, 241)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-center font-bold">Сервера</p>
            </div>
            <div
                @click="openModal('commands')"
                class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
                <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="rgb(59, 130, 246)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 10 4 15 9 20"></polyline>
                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-center font-bold">Команды</p>
            </div>

            <div
                @click="openModal('faq')"
                class="bg-black/20 border border-gray-700 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
                <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="rgb(34, 197, 94)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                </div>
                <p class="text-center font-bold">FAQ</p>
            </div>
        </div>
        <transition name="modal-fade">

            <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="fixed inset-0 bg-black/70 transition-opacity" @click="closeModal"></div>

                    <div
                        class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full z-10 relative transform transistion-all"
                        style="min-width: 200px; max-width: 1000px;">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-white flex items-center">
                                <div class="mr-3 p-2 rounded-lg" :class="modalIcon.bgColor">
                                    <component :is="modalIcon.svg" class="w-5 h-5"
                                               :stroke="modalIcon.color"></component>
                                </div>
                                {{ modalTitle }}
                            </h3>
                            <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>


                        <div v-if="activeModal === 'rules'" class="space-y-4">
                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-indigo-400 font-bold mb-2">📌 Общие правила</h4>
                                <p class="text-gray-300 text-sm">1. Уважай других игроков, адекватное поведение — это основа комфорта для всех.</p>
                                <p class="text-gray-300 text-sm">2. Запрещены токсичность, оскорбления, травля и провокации.</p>
                                <p class="text-gray-300 text-sm">3. Запрещено использование читов, макросов и стороннего ПО.</p>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-indigo-400 font-bold mb-2">⚔️ PvP и грабеж</h4>
                                <p class="text-gray-300 text-sm">4. PvP разрешён на всей карте, кроме зон с меткой "No PvP".</p>
                                <p class="text-gray-300 text-sm">5. Грабеж разрешён, но грифинг без цели (вандализм) — запрещён.</p>
                                <p class="text-gray-300 text-sm">6. Запрещено кемперство у спавна более 10 минут.</p>
                                <p class="text-gray-300 text-sm">7. Использование багов в рейде карается баном.</p>
                                <p class="text-gray-300 text-sm">8. Запрещены ловушки возле телепортов и ивентов.</p>
                                <p class="text-gray-300 text-sm">9. Подлог под админов или ложные жалобы = блокировка.</p>
                                <p class="text-gray-300 text-sm">10. Рейды вне вайпа запрещены, если нет разрешения админа.</p>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-indigo-400 font-bold mb-2">🏡 Постройки</h4>
                                <p class="text-gray-300 text-sm">11. Запрещено строить вблизи чужих баз (минимум 20 фундаментов).</p>
                                <p class="text-gray-300 text-sm">12. Запрещены базы в текстурах или багнутых местах.</p>
                                <p class="text-gray-300 text-sm">13. Лагометы и строения, сильно нагружающие сервер — будут удалены.</p>
                                <p class="text-gray-300 text-sm">14. Не мешай дороге и ивент-локациям своими постройками.</p>
                                <p class="text-gray-300 text-sm">15. Админы имеют право снести базу без возврата, если она нарушает правила.</p>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-indigo-400 font-bold mb-2">📣 Коммуникация</h4>
                                <p class="text-gray-300 text-sm">16. Запрещён спам и флуд в чате, голосом — тоже.</p>
                                <p class="text-gray-300 text-sm">17. Реклама других серверов, дискордов — бан навсегда.</p>
                                <p class="text-gray-300 text-sm">18. Никнейм, аватар или описание с матом/пропагандой — будет изменено или игрок получит бан.</p>
                                <p class="text-gray-300 text-sm">19. Админ — не твой слуга. Обращайся с уважением.</p>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-indigo-400 font-bold mb-2">👮 Администрация</h4>
                                <p class="text-gray-300 text-sm">20. Администрация не вмешивается в игровой процесс без причины.</p>
                                <p class="text-gray-300 text-sm">21. Решение админа — окончательное. Обжаловать можно через Discord.</p>
                                <p class="text-gray-300 text-sm">22. Поддержка работает в адекватное время суток :)</p>
                                <p class="text-gray-300 text-sm">23. Обход блокировки — перманентный бан.</p>
                                <p class="text-gray-300 text-sm">24. Обман администрации = бан без шансов на разбан.</p>
                                <p class="text-gray-300 text-sm">25. Мы за честную игру. Не нравится? Rust — не для тебя 😘</p>
                                <p class="text-gray-300 text-sm">26. Обновления правил могут быть без предварительного уведомления.</p>
                            </div>
                        </div>


                        <div v-if="activeModal === 'commands'" class="space-y-4">
                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <h4 class="text-blue-400 font-bold mb-3">Команды</h4>


                                <div class="mb-2 last:mb-0">
                                    <div class="flex items-center">
                                        <span
                                            class="text-white font-mono bg-gray-700 px-2 py-1 rounded text-sm">/store</span>
                                        <span class="text-gray-400 text-sm ml-3">открыть магазин</span>
                                    </div>
                                </div>

                                <div class="mb-2 last:mb-0">
                                    <div class="flex items-center">
                                        <span
                                            class="text-white font-mono bg-gray-700 px-2 py-1 rounded text-sm">/store</span>
                                        <span class="text-gray-400 text-sm ml-3">открыть магазин</span>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div v-if="activeModal === 'faq'" class="space-y-4">
                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Что это за проект?</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Это приватный проект, где можно играть на честных условиях с минимальной модерацией.
                                    </div>
                                </details>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Нужен ли вайп?</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Вайпы проходят раз в месяц или по мере необходимости, но всё по-человечески 🫶
                                    </div>
                                </details>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Какие правила?</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Не быть токсиком, не абьюзить баги, и просто играть честно. Ну, и без читов конечно.
                                    </div>
                                </details>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Где задать вопрос или пожаловаться?</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Напиши в <a href="https://t.me/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Telegram</a>
                                        или в <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">VK</a> — ответим.
                                    </div>
                                </details>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Есть ли донат?</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Есть. Но он максимально лайтовый и никак не даёт прям супер-преимуществ.
                                    </div>
                                </details>
                            </div>

                            <div class="p-4 bg-black/20 rounded-xl border border-gray-700">
                                <details class="group">
                                    <summary class="flex justify-between items-center cursor-pointer list-none">
                                        <h4 class="text-indigo-400 font-bold">Контакты</h4>
                                        <div class="text-gray-400 transition-transform duration-300 group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </summary>
                                    <div class="pt-3 text-gray-300 text-sm">
                                        Telegram: <a href="https://t.me/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://t.me/</a><br>
                                        Discord: <a href="https://dsc.gg/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://dsc.gg/</a><br>
                                        VK: <a href="https://vk.com/bloodyrust" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">https://vk.com/</a>
                                    </div>
                                </details>
                            </div>
                        </div>


                      <div v-if="activeModal === 'servers'" class="space-y-4">
                        <section class="p-4 bg-black/25 rounded-lg border border-gray-600">
                          <h4 class="text-cyan-400 font-semibold mb-2">Наши игровые сервера</h4>
                          <article class="mb-3 p-3 bg-gray-800/60 rounded-md">
                            <p class="text-gray-300 text-sm">
                              RustWorld Prime #1 [ x2 Рейты | SOLO | Телепорт | Киты | RPG | Уровни ]
                              Карта: Procedural
                            </p>
                            <p class="text-gray-400 text-sm mt-1">ip: play.rustworld.ru</p>
                          </article>
                        </section>
                      </div>

                      <div class="mt-6 flex justify-end" style="display: none;">
                            <button @click="closeModal"
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round" class="mr-2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import {ref, computed, onMounted, h} from "vue";
import axios from "axios";
import {useI18n} from 'vue-i18n'

const {t, locale} = useI18n()
const showModal = ref(false);
const activeModal = ref(null);


const openModal = (modalType) => {
    activeModal.value = modalType;
    showModal.value = true;
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    showModal.value = false;
    document.body.style.overflow = '';
};

const modalTitles = {
    servers: 'modals.servers',
    rules: 'modals.rules',
    commands: 'modals.commands',
    faq: 'modals.faq',
};

const modalTitle = computed(() => {
    const key = modalTitles[activeModal.value];
    return key ? t(key) : '';
});

const modalIcon = computed(() => {
    switch (activeModal.value) {
        case 'rules':
            return {
                svg: h('svg', {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'rgb(168, 85, 247)',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }, [
                    h('path', {d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'}),
                    h('path', {d: 'm9 12 2 2 4-4'})
                ]),
                bgColor: 'bg-purple-500/20',
                color: 'rgb(168, 85, 247)'
            };
        case 'commands':
            return {
                svg: h('svg', {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'rgb(59, 130, 246)',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }, [
                    h('polyline', {points: '9 10 4 15 9 20'}),
                    h('path', {d: 'M20 4v7a4 4 0 0 1-4 4H4'})
                ]),
                bgColor: 'bg-blue-500/20',
                color: 'rgb(59, 130, 246)'
            };
        case 'faq':
            return {
                svg: h('svg', {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'rgb(34, 197, 94)',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }, [
                    h('circle', {cx: '12', cy: '12', r: '10'}),
                    h('path', {d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'}),
                    h('line', {x1: '12', y1: '17', x2: '12.01', y2: '17'})
                ]),
                bgColor: 'bg-green-500/20',
                color: 'rgb(34, 197, 94)'
            };
        default:
            return {};
    }
});

</script>
<style>
.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}
</style>
