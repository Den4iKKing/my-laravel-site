<template>
    <div class="bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg">
        <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            {{ $t('monitoring_servers') }}
        </h2>

        <div v-if="servers && servers.length > 0" class="space-y-6">
            <div class="space-y-3">
              <div v-for="server in sortedServers"
                   @click="selectServer(server)"
                   :key="server.id"
                   :class="[
        'flex justify-between items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
        'bg-black/20 border border-gray-700',
        {'border-[#6366f1] active-shadow': selectedServerId === server.id},
        {'transform hover:scale-105': hoveredServer === server.id}
     ]"
                   style="padding: 10px; min-width: 335px; max-width: 900px;"
                   @mouseenter="hoveredServer = server.id"
                   @mouseleave="hoveredServer = null">
                <div class="flex items-center space-x-3">
                  <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            (server.status === 'Доступен' ? server.online + 2 : server.online) > 0
                ? 'bg-green-500/20'
                : 'bg-green-500/20'
        ]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 :stroke="(server.status === 'Доступен' ? server.online + 2 : server.online) > 0 ? 'rgb(34, 197, 94)' : 'rgb(34, 197, 94)'"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold">{{ server.name }}</p>
                            <div class="flex items-center mt-1">
                                <div class="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden mr-2" style="width: 114px;">
                                    <div
                                        :style="`width: ${((server.status === 'Доступен' ? server.online + 2 : server.online) / server.slots) * 100}%`"
                                        :class="[
                        'h-full absolute left-0 top-0 z-10',
                        (server.status === 'Доступен' ? server.online + 2 : server.online) / server.slots > 0.8 ? 'bg-red-500' :
                        (server.status === 'Доступен' ? server.online + 2 : server.online) / server.slots > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                      ]"
                                    ></div>
                                    <div
                                        v-if="server.joining > 0"
                                        :style="`width: ${(server.joining / server.slots) * 100}%; left: ${((server.status === 'Доступен' ? server.online + 2 : server.online) / server.slots) * 100}%`"
                                        class="h-full rounded-r-full absolute top-0 z-20 bg-amber-500"
                                    ></div>
                                    <div
                                        v-if="server.queue > 0"
                                        :style="`width: ${(server.queue / server.slots) * 100}%; left: ${((server.status === 'Доступен' ? server.online + 2 : server.online) + server.joining) / server.slots * 100}%`"
                                        class="h-full rounded-full absolute top-0 z-30 bg-amber-500"
                                    ></div>
                                </div>
                                <p class="text-xs text-gray-400">
                                    {{ server.status === 'Доступен' ? server.online + 2 : server.online }} / {{ server.slots }}
                                    <span v-if="server.joining > 0" class="text-amber-500"> +{{ server.joining }}</span>
                                    <span v-if="server.queue > 0" class="text-purple-400"> ({{ server.queue }} {{ $t('in_queue') }})</span>
                                </p>
                            </div>
                            <div class="flex items-center mt-1 space-x-2">
                                <p class="text-xs text-gray-400" style="letter-spacing: 0.06rem; font-size: 13px;">
                                    <span class="text-indigo-400">connect</span> {{ getServerConnectString(server) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div v-if="server.ping > 0" class="text-xs text-gray-400">
                            {{ server.ping }}ms
                        </div>
                        <div
                            :class="[
    'text-xs font-bold px-3 py-1 rounded-full',
    server.status === 'Доступен'
      ? 'bg-green-500/20 text-green-400'
      : 'bg-red-500/20 text-red-400'
  ]"
                        >
                            {{ $t(server.status === 'Доступен' ? 'server_available' : 'server_notavailable') }}
                        </div>
<!--                        <div v-if="selectedServerId === server.id" class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>-->
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <div v-if="totalOnline > 0" class="flex justify-between items-center p-2 rounded-xl bg-gray-800/50 border border-gray-700">
                    <span class="text-sm font-medium px-2">{{ $t('all_servers') }}</span>
                    <div class="flex items-center">
                        <div class="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                            <div
                                :style="`width: ${((totalOnlinePlusTwoConditional) / totalSlots) * 100}%`"
                                :class="[
          'h-full absolute left-0 top-0 z-10',
          (totalOnlinePlusTwoConditional) / totalSlots > 0.8 ? 'bg-red-500' :
          (totalOnlinePlusTwoConditional) / totalSlots > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
        ]"
                            ></div>
                            <div
                                v-if="totalQueue > 0"
                                :style="`width: ${(totalQueue / totalSlots) * 100}%; left: ${((totalOnline + totalJoining + 2) / totalSlots) * 100}%`"
                                class="h-full rounded-r-full absolute top-0 z-20 bg-amber-500"
                            ></div>
                        </div>
                        <span class="text-xs text-gray-400">{{ totalOnlinePlusTwoConditional }} / {{ totalSlots }}
      <span v-if="totalJoining > 0" class="text-amber-500"> +{{ totalJoining }}</span>
    </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n'

const {t, locale} = useI18n()
import {ref, computed, onMounted} from "vue";
import axios from "axios";

const servers = ref([]);
const hoveredServer = ref(null);

const props = defineProps({
    selectedServerId: {
        type: [Number, String, null],
        default: 1
    }
});

const emit = defineEmits(["server-selected"]);

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
    servers.value.forEach(server => {
        total += (server.status === 'Доступен' ? (server.online || 0) + 2 : (server.online || 0));
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

const selectServer = (server) => {
    console.log('Сервер выбран:', server.id, server.name);
    emit("server-selected", server.id);
};

const getServerConnectString = (server) => {
    if (server.ip && server.port) {
        return `${server.ip}:${server.port}`;
    }
    return 'Unknown Server';
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
    setInterval(fetchServers, 300000);
});
</script>

<style>
.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}
.active-server-bg{
  background-color: #2051002b;
}
.default-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.active-shadow {
  box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.4),
  0 12px 25px -8px rgba(139, 92, 246, 0.3),
  0 8px 16px -4px rgba(168, 85, 247, 0.2);
  transition: box-shadow 0.3s ease;
}
</style>
