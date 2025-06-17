<script setup>
import { ref, onMounted } from 'vue'

const bonuses = ref([])

async function fetchBonuses() {
    try {
        const res = await fetch('/api/payment-bonuses')
        const data = await res.json()

        bonuses.value = data.map(item => ({
            amount: Number(item.threshold),
            bonus: Number(item.percent),
        })).sort((a, b) => b.amount - a.amount)
    } catch (e) {
        console.error('Ошибка загрузки бонусов:', e)
    }
}

onMounted(() => {
    fetchBonuses()
})
</script>

<template>
    <div class="bg-gray-900/90 p-6 rounded-xl text-white w-full border border-gray-800 shadow-lg mt-5">
        <h2 class="text-xl font-semibold mb-4">🎁 Бонусы при пополнении</h2>
        <div class="space-y-3">
            <div
                v-for="(item, index) in bonuses"
                :key="index"
                class="flex justify-between items-center bg-black/20 rounded-lg px-4 py-3 border border-white/10"
            >
                <div>
                    <p class="text-sm text-white/70">Пополнение от</p>
                    <p class="text-lg font-bold">{{ item.amount.toLocaleString() }} ₽</p>
                </div>
                <div class="bg-green-500/10 text-green-400 font-semibold text-sm px-3 py-1 rounded-lg">
                    +{{ item.bonus }}%
                </div>
            </div>
        </div>
    </div>
</template>
