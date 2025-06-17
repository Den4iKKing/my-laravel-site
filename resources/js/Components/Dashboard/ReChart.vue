<template>
  <div class="server-revenue-chart">
    <h2 class="text-xl font-bold mb-4">Прибыльность серверов</h2>
    <div v-if="loading" class="text-center py-8">Загрузка данных...</div>
    <div v-else-if="error" class="text-red-500 py-4">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- График общей выручки -->
      <div class="p-4 border rounded">
        <h3 class="text-lg font-semibold mb-2 text-white">Общая выручка по серверам</h3>
        <apexchart
            type="bar"
            height="350"
            :options="revenueChartOptions"
            :series="[{ name: 'Выручка', data: revenueData }]"
        />
      </div>

      <!-- График количества покупок -->
      <div class="p-4 border rounded">
        <h3 class="text-lg font-semibold mb-2 text-white">Количество покупок по серверам</h3>
        <apexchart
            type="bar"
            height="350"
            :options="purchasesChartOptions"
            :series="[{ name: 'Покупки', data: purchasesData }]"
        />
      </div>

      <!-- График средней цены покупки -->
      <div class="p-4 border rounded">
        <h3 class="text-lg font-semibold mb-2 text-white">Средняя цена покупки</h3>
        <apexchart
            type="bar"
            height="350"
            :options="avgPriceChartOptions"
            :series="[{ name: 'Средняя цена', data: avgPriceData }]"
        />
      </div>

      <!-- Круговая диаграмма распределения выручки -->
      <div class="p-4 border rounded">
        <h3 class="text-lg font-semibold mb-2 text-white">Распределение выручки</h3>
        <apexchart
            type="pie"
            height="350"
            :options="pieChartOptions"
            :series="revenueData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: 'ServerRevenueChart',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    period: {
      type: String,
      default: '30d'
    }
  },
  setup(props) {
    const serversData = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // Данные для графиков
    const servers = computed(() => serversData.value.map(item => item.server));
    const revenueData = computed(() => serversData.value.map(item => Math.round(parseFloat(item.total_revenue))));
    const purchasesData = computed(() => serversData.value.map(item => parseInt(item.total_purchases)));
    const avgPriceData = computed(() => serversData.value.map(item => Math.round(parseFloat(item.average_price))));


    // Опции для графика выручки
    const revenueChartOptions = computed(() => ({
      chart: {
        id: 'server-revenue',
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: 'Сервера' }
      },
      yaxis: {
        title: { text: 'Выручка' }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: 'Выручка по серверам',
        align: 'center'
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: '#000'
        },
        theme: 'dark'
      },
      colors: ['#2E93fA']
    }));
    const purchasesChartOptions = computed(() => ({
      chart: {
        id: 'server-purchases',
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: 'Сервера' }
      },
      yaxis: {
        title: { text: 'Кол-во покупок' }
      },
      dataLabels: {
        enabled: true
      },
      title: {
        text: 'Количество покупок по серверам',
        align: 'center'
      },
      colors: ['#66DA26'],
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(0)}`;
          }
        },
        style: {
          color: '#000'
        },
        theme: 'dark'
      }
    }));

    const avgPriceChartOptions = computed(() => ({
      chart: {
        id: 'avg-price',
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: 'Сервера' }
      },
      yaxis: {
        title: { text: 'Средняя цена' }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(2);
        }
      },
      title: {
        text: 'Средняя цена покупки по серверам',
        align: 'center'
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: '#000'
        },
        theme: 'dark'
      },
      colors: ['#FF4560']
    }));

// Опции для круговой диаграммы
    const pieChartOptions = computed(() => ({
      chart: {
        id: 'revenue-distribution',
        toolbar: { show: true }
      },
      labels: servers.value,
      title: {
        text: 'Распределение выручки по серверам',
        align: 'center'
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: '#000'
        },
        theme: 'dark'
      },
      legend: {
        position: 'bottom'
      }
    }));



    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`/api/stats/server-revenue?period=${props.period}`);
        if (response.data.success) {
          serversData.value = response.data.data;
        } else {
          error.value = 'Ошибка при получении данных';
        }
      } catch (err) {
        error.value = `Произошла ошибка: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };
    watch(() => props.period, () => {
      fetchData();
    });
    onMounted(() => {
      fetchData();
    });


    return {
      loading,
      error,
      servers,
      revenueData,
      purchasesData,
      avgPriceData,
      revenueChartOptions,
      purchasesChartOptions,
      avgPriceChartOptions,
      pieChartOptions,
    };
  }
});
</script>