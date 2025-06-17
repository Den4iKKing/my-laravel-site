<template>
<!--  <div class="top-items-chart">-->
<!--    <h2 class="text-xl font-bold mb-4">Топ покупаемые предметы (за все время)</h2>-->
<!--    <div v-if="loading" class="text-center py-8">Загрузка данных...</div>-->
<!--    <div v-else-if="error" class="text-red-500 py-4">{{ error }}</div>-->
<!--    <div v-else class="chart-container">-->
<!--      <apexchart-->
<!--          type="bar"-->
<!--          height="350"-->
<!--          :options="chartOptions"-->
<!--          :series="chartSeries"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: 'TopItemsChart',
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
    const itemsData = ref({});
    const loading = ref(true);
    const error = ref(null);

    // Подготовка данных для графика в едином формате
    const chartData = computed(() => {
      const items = [];
      const counts = [];
      const revenues = [];
      const colors = [];

      // Обрабатываем все сервера
      Object.keys(itemsData.value).forEach(server => {
        const serverItems = itemsData.value[server];

        serverItems.forEach(item => {
          // Формируем название с сервером
          const itemName = `${item.item} (${server})`;
          items.push(itemName);
          counts.push(item.purchase_count);
          revenues.push(item.total_revenue);

          // Генерируем цвет в зависимости от сервера
          const serverColors = {
            'pve': '#8B5CF6',  // Фиолетовый как на скриншоте
            'pvp': '#3B82F6',  // Синий
            'tp': '#10B981',   // Зеленый
            'sky': '#F59E0B',  // Оранжевый
            'anarchy': '#EF4444' // Красный
          };

          colors.push(serverColors[server] || '#8B5CF6');
        });
      });

      return { items, counts, revenues, colors };
    });

    // Серии данных для графика
    const chartSeries = computed(() => {
      return [{
        name: 'Количество покупок',
        data: chartData.value.counts
      }];
    });

    // Настройки графика
    const chartOptions = computed(() => {
      return {
        chart: {
          id: 'top-items',
          toolbar: {
            show: true
          },
          background: '#18181b', // Темный фон как на скриншоте
          foreColor: '#d1d5db'   // Светлый текст для темного фона
        },
        plotOptions: {
          bar: {
            distributed: true,   // Разные цвета для каждого столбца
            columnWidth: '60%',  // Ширина столбцов
            dataLabels: {
              position: 'top'
            }
          }
        },
        colors: chartData.value.colors,
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val + ' ';
          },
          style: {
            colors: ['#f8fafc']
          },
          offsetY: -20
        },
        xaxis: {
          categories: chartData.value.items,
          labels: {
            style: {
              colors: '#d1d5db'
            },
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true
          }
        },
        yaxis: {
          title: {
            text: 'Количество',
            style: {
              color: '#d1d5db'
            }
          },
          labels: {
            formatter: function(val) {
              return val + ' ₽';
            }
          }
        },
        grid: {
          borderColor: '#2d3748'
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: function(val) {
              return `${val} ₽`;
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`/api/stats/top-items?period=${props.period}`);
        if (response.data.success) {
          itemsData.value = response.data.data;
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
      chartOptions,
      chartSeries,
    };
  }
});
</script>

<style scoped>
.top-items-chart {
  background-color: #18181b;
  color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.chart-container {
  margin-top: 1rem;
}
</style>