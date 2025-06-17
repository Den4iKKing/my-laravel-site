<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
        Статистика сервера
      </h1>
      <div class="flex space-x-2">
        <div class="bg-gray-800 rounded-lg p-1 mr-2">
          <button
              @click="changePeriod('1d')"
              :class="period === '1d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            1д
          </button>
          <button
              @click="changePeriod('7d')"
              :class="period === '7d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            7д
          </button>
          <button
              @click="changePeriod('14d')"
              :class="period === '14d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            14д
          </button>
          <button
              @click="changePeriod('30d')"
              :class="period === '30d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            30д
          </button>
          <button
              @click="changePeriod('year')"
              :class="period === 'year' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            Год
          </button>
          <button
              @click="changePeriod('all')"
              :class="period === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            Все время
          </button>
        </div>
        <div class="bg-gray-800 rounded-lg p-1">
          <button
              @click="changeGroupBy('month')"
              :class="groupBy === 'month' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            По месяцам
          </button>
          <button
              @click="changeGroupBy('day')"
              :class="groupBy === 'day' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
          >
            По дням
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-6">
      <div
          class="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500 shadow-lg transform hover:scale-105 transition-transform">
        <h3 class="text-gray-400 mb-1 text-sm">Всего платежей</h3>
        <div class="text-2xl font-bold">{{ totalPayments }} ₽</div>
        <div class="text-sm text-gray-400 mt-1">{{ getPeriodLabel() }}</div>
      </div>
      <div
          class="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500 shadow-lg transform hover:scale-105 transition-transform">
        <h3 class="text-gray-400 mb-1 text-sm">Уникальных пользователей</h3>
        <div class="text-2xl font-bold">{{ uniqueUsers }}</div>
        <div class="text-sm text-gray-400 mt-1">{{ getPeriodLabel() }}</div>
      </div>
      <div
          class="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 shadow-lg transform hover:scale-105 transition-transform">
        <h3 class="text-gray-400 mb-1 text-sm">Средний платеж</h3>
        <div class="text-2xl font-bold">{{ averagePurchaseAmount }} ₽</div>
        <div class="text-sm text-gray-400 mt-1">{{ getPeriodLabel() }}</div>
      </div>
      <div
          class="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500 shadow-lg transform hover:scale-105 transition-transform">
        <h3 class="text-gray-400 mb-1 text-sm">Топ сервер</h3>
        <div class="text-2xl font-bold">{{ topServerR?.server_name || 'N/A' }}</div>
        <div class="text-sm text-gray-400 mt-1">{{ topServerR?.total_revenue || 0 }} ₽</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 class="text-lg mb-4 font-bold">Статистика покупок </h2>
        <div class="h-80">
          <apexchart
              type="area"
              height="100%"
              :options="purchasesChartOptions"
              :series="purchasesChartSeries"
          ></apexchart>
        </div>
      </div>

      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 class="text-lg mb-4 font-bold">Статистика платежей </h2>
        <div class="h-80">
          <apexchart
              type="area"
              height="100%"
              :options="paymentsChartOptions"
              :series="paymentsChartSeries"
          ></apexchart>
        </div>
      </div>
    </div>

    <!-- Payment Methods Chart -->
    <div class="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <h2 class="text-lg mb-4 font-bold">Платежные способы </h2>
      <div class="h-80">
        <apexchart
            type="line"
            height="100%"
            :options="methodsChartOptions"
            :series="methodsChartSeries"
        ></apexchart>
      </div>
    </div>

    <!-- Прибыльность серверов -->
<!--    <div class="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">-->
<!--      <testChart  :period="period" />-->
<!--    </div>-->
<!--    <div class="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">-->
<!--      <TestChart2  :period="period" />-->
<!--    </div>-->



<!--    &lt;!&ndash; Топ покупаемых предметов &ndash;&gt;-->
<!--    <div class="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">-->
<!--      <h2 class="text-lg mb-4 font-bold">Топ покупаемые предметы </h2>-->
<!--      <div class="h-96">-->
<!--        <apexchart-->
<!--            type="bar"-->
<!--            height="100%"-->
<!--            :options="itemsChartOptions"-->
<!--            :series="itemsChartSeries"-->
<!--        ></apexchart>-->
<!--      </div>-->
<!--    </div>-->

    <div class="grid grid-cols-2 gap-4">
      <!-- Топ предметы -->
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 class="text-lg mb-4 font-bold">Топ предметы</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
            <tr>
              <th class="text-left py-2 px-4 border-b border-gray-700">Название</th>
              <th class="text-left py-2 px-4 border-b border-gray-700">Сумма</th>
              <th class="text-left py-2 px-4 border-b border-gray-700">Кол-во продаж</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in topItems" :key="index"
                class="hover:bg-gray-700 cursor-pointer">
              <td class="py-2 px-4 border-b border-gray-700">{{ item.item_name }}</td>
              <td class="py-2 px-4 border-b border-gray-700">{{ parseFloat(item.total_amount).toFixed(2) }} ₽</td>
              <td class="py-2 px-4 border-b border-gray-700">{{ item.count }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 class="text-lg mb-4 font-bold">Топ донатеров</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
            <tr>
              <th class="text-left py-2 px-4 border-b border-gray-700">Игрок</th>
              <th class="text-left py-2 px-4 border-b border-gray-700">Сумма</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in topDons" :key="index"
                class="hover:bg-gray-700 cursor-pointer">
              <td class="py-2 px-4 border-b border-gray-700">{{ item.steamid }}</td>
              <td class="py-2 px-4 border-b border-gray-700">{{ (item.total) }} ₽</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-if="showItemModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Детали предмета: {{ selectedItem.item_name }}</h3>
          <button @click="showItemModal = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div class="mb-4">
          <h4 class="text-lg font-bold mb-2">Серверы, где покупают</h4>
          <div class="h-64">
            <apexchart
                type="bar"
                height="100%"
                :options="itemServersChartOptions"
                :series="itemServersChartSeries"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для деталей сервера -->
    <div v-if="showServerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Детали сервера: {{ selectedServer.server_name }}</h3>
          <button @click="showServerModal = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div class="mb-4">
          <h4 class="text-lg font-bold mb-2">Топ предметы на сервере</h4>
          <div class="h-64">
            <apexchart
                type="bar"
                height="100%"
                :options="serverItemsChartOptions"
                :series="serverItemsChartSeries"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed, onMounted} from "vue";
import axios from "axios";
import Dashboard from "@/Layouts/Dashboard.vue";
import VueApexCharts from "vue3-apexcharts";
import {defineComponent} from "vue";
import TestChart from "@/Components/Dashboard/TestChart.vue";
import TestChart2 from "@/Components/Dashboard/ReChart.vue";
import { format } from "date-fns";
import { ru } from "date-fns/locale"
export default defineComponent({
  name: "StatisticsDashboard",
  components: {
    apexchart: VueApexCharts,
    testChart: TestChart,
    TestChart2: TestChart2,

  },
  layout: Dashboard,

  setup() {
    const groupBy = ref("day");
    const period = ref("30d");
    const showItemModal = ref(false);
    const showServerModal = ref(false);
    const selectedItem = ref({});
    const selectedServer = ref({});
    const itemServersChartSeries = ref([]);
    const serverItemsChartSeries = ref([]);
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return format(date, "dd MMM", { locale: ru });
    };
    const statsData = ref({
      purchases: [],
      payments: [],
      top_donators: [],
      top_items: [],
      top_server: [],

      top_servers: [],
      payment_methods: [],
      summary: {
        total_purchases: 0,
        total_purchases_amount: "0",
        total_payments: 0,
        total_payments_amount: "0",
        unique_users: 0,
        average_purchase_amount: 0
      }
    });

    const getPeriodLabel = () => {
      switch (period.value) {
        case '1d':
          return 'за 1 день';
        case '7d':
          return 'за 7 дней';
        case '14d':
          return 'за 14 дней';
        case '30d':
          return 'за 30 дней';
        case 'year':
          return 'за год';
        case 'all':
          return 'за все время';
        default:
          return `за ${groupBy.value === 'month' ? 'месяц' : 'день'}`;
      }
    };

    const totalPayments = computed(() => {
      return parseFloat(statsData.value.summary.total_payments_amount || 0).toFixed(2);
    });

    const uniqueUsers = computed(() => {
      return statsData.value.summary.unique_users;
    });

    const averagePurchaseAmount = computed(() => {
      return parseFloat(statsData.value.summary.average_purchase_amount || 0).toFixed(2);
    });

    const topServer = computed(() => {
      if (!statsData.value.top_servers || statsData.value.top_servers.length === 0) {
        return {name: 'N/A', amount: 0};
      }
      const server = statsData.value.top_servers[0];
      return {
        name: server.server_name,
        amount: parseFloat(server.total_amount || 0).toFixed(2)
      };
    });

    const topItems = computed(() => {
      return statsData.value.top_items || [];
    });

    const topServers = computed(() => {
      return statsData.value.top_servers || [];
    });

    const purchasesChartOptions = ref({
      chart: {
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        background: 'transparent',
      },
      colors: ['#facc15'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
          format: 'dd MMM yyyy', // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), 'dd MMM', { locale: ru });
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        title: {
          text: 'Дата',
          style: {
            color: '#9ca3af',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: (value) => `${value} ₽`,
        },
        title: {
          text: 'Сумма покупок',
          style: {
            color: '#9ca3af',
          },
        },
      },
    });
    const purchasesChartSeries = ref([
      {
        name: 'Покупки',
        data: [],
      },
    ]);

    const paymentsChartOptions = ref({
      chart: {
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        background: 'transparent',
      },
      colors: ['#10b981'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
          format: 'dd MMM yyyy', // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`,
        },
      },
      xaxis: {
        type: 'datetime', // Указываем, что это даты
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), 'dd MMM', { locale: ru });
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        title: {
          text: 'Дата',
          style: {
            color: '#9ca3af',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: (value) => `${value} ₽`,
        },
        title: {
          text: 'Сумма платежей',
          style: {
            color: '#9ca3af',
          },
        },
      },
    });
    const paymentsChartSeries = ref([
      {
        name: 'Платежи',
        data: [],
      },
    ]);

    const methodsChartOptions = ref({
      chart: {
        type: 'line',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        background: 'transparent',
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
          format: 'dd MMM yyyy', // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), 'dd MMM', { locale: ru });
          },
        },
        title: {
          text: 'Дата',
          style: {
            color: '#9ca3af',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: (value) => `${value} ₽`,
        },
        title: {
          text: 'Сумма по методам платежей',
          style: {
            color: '#9ca3af',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#9ca3af',
        },
      },
    });
    const methodsChartSeries = ref([]);

    const serversChartOptions = ref({
      chart: {
        type: 'bar',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        background: 'transparent',
      },
      colors: ['#3b82f6'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 6,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val} ₽`,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value) => `${value} ₽`,
        },
        z: {
          formatter: (value) => `${value} продаж`,
          title: 'Продажи:',
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#9ca3af',
          },
          rotate: -45,
          rotateAlways: true,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
          },
          formatter: (value) => `${value} ₽`,
        },
      },
    });

    const serversChartSeries = ref([]);

    const itemsChartOptions = ref({
      ...serversChartOptions.value,
      colors: ['#8b5cf6'],
    });

    const itemsChartSeries = ref([]);

    const itemServersChartOptions = ref({
      ...serversChartOptions.value,
      colors: ['#ec4899'],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#9ca3af',
          },
          rotate: -45,
          rotateAlways: true,
        },
      },
    });

    const serverItemsChartOptions = ref({
      ...serversChartOptions.value,
      colors: ['#f59e0b'],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#9ca3af',
          },
          rotate: -45,
          rotateAlways: true,
        },
      },
    });
    const topDons = ref([]);
    const topServerR = ref([]);

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/statistics?period=${period.value}&group_by=${groupBy.value}`);
        statsData.value = response.data;

        topDons.value.splice(
            0,
            topDons.value.length,
            ...(statsData.value.top_donators?.map(donator => ({
              ...donator,
              total: Number(donator.total)
            })) || [])
        );
        topServerR.value = response.data.top_server;
        console.log(topServerR.value);

        updateCharts();
      } catch (error) {
        console.error("Ошибка получения данных:", error);
        alert('Ошибка при загрузке данных статистики');
      }
    };

    console.log(topDons.value);
    console.log(statsData.value);

    const updateCharts = () => {
      purchasesChartOptions.value.xaxis.categories = statsData.value.purchases.map(item =>
          new Date(item.date).getTime()
      );
      purchasesChartSeries.value[0].data = statsData.value.purchases.map(item => ({
        x: new Date(item.date).getTime(),
        y: parseFloat(item.total_amount || 0)
      }));

      const payments = Array.isArray(statsData.value.payments)
          ? statsData.value.payments
          : (statsData.value.payments?.all_payments || []);

      paymentsChartOptions.value.xaxis.categories = payments.map(item => {
        return new Date(item.date).getTime();
      });

      paymentsChartSeries.value[0].data = payments.map(item => ({
        x: new Date(item.date).getTime(),
        y: parseFloat(item.total_amount || 0)
      }));


      const paymentMethods = statsData.value.payments?.payment_methods || statsData.value.payment_methods || [];

      if (paymentMethods.length > 0) {
        const uniqueDates = [...new Set(payments.map(item => formatDate(item.date)))];
        const uniqueMethods = [...new Set(paymentMethods.map(item => item.method))];

        methodsChartOptions.value.xaxis.categories = uniqueDates;

        methodsChartOptions.value.xaxis.categories = uniqueDates;

        methodsChartSeries.value = uniqueMethods.map(method => {
          const methodData = payments.map(paymentItem => {
            const matchingMethod = paymentMethods.find(
                item => item.method === method && item.date === paymentItem.date
            );
            return {
              x: new Date(paymentItem.date).getTime(),
              y: matchingMethod ? parseFloat(matchingMethod.total_amount || 0) : 0
            };
          });

          return {
            name: method.charAt(0).toUpperCase() + method.slice(1),
            data: methodData
          };
        });
      } else {
        methodsChartOptions.value.xaxis.categories = payments.map(item => item.date);
        methodsChartSeries.value = [{
          name: 'Все платежи',
          data: payments.map(item => parseFloat(item.total_amount || 0))
        }];
      }

      const topServers = statsData.value.top_servers || [];
      if (topServers.length > 0) {
        const serverNames = topServers.map(server => String(server.server_name));
        const serverAmounts = topServers.map(server => parseFloat(server.total_amount || 0));

        serversChartOptions.value = {
          ...serversChartOptions.value,
          xaxis: {
            ...serversChartOptions.value.xaxis,
            categories: serverNames,
            labels: {
              ...serversChartOptions.value.xaxis.labels,
              formatter: function(val) {
                return String(val);
              }
            }
          }
        };

        serversChartSeries.value = [{
          name: 'Прибыль',
          data: serverAmounts
        }];

        const topItems = statsData.value.top_items || [];
        if (topItems.length > 0) {
          const itemNames = topItems.map(item => String(item.item_name));
          const itemAmounts = topItems.map(item => parseFloat(item.total_amount || 0));

          itemsChartOptions.value = {
            ...itemsChartOptions.value,
            xaxis: {
              ...itemsChartOptions.value.xaxis,
              categories: itemNames,
              labels: {
                ...itemsChartOptions.value.xaxis.labels,
                formatter: function(val) {
                  return String(val);
                }
              }
            }
          };

          itemsChartSeries.value = [{
            name: 'Прибыль',
            data: itemAmounts
          }];
        }
      }
    };
    const changeGroupBy = (newGroupBy) => {
      groupBy.value = newGroupBy;
      fetchData();
    };

    const changePeriod = (newPeriod) => {
      period.value = newPeriod;
      fetchData();
    };

    const showItemDetails = async (item) => {
      selectedItem.value = item;
      showItemModal.value = true;

      try {
        const response = await axios.get(`/api/statistics/item/${item.item_id}?period=${period.value}&group_by=${groupBy.value}`);
        const data = response.data;

        const topServers = data.top_servers || [];
        if (topServers.length > 0) {
          itemServersChartOptions.value.xaxis.categories = topServers.map(server => server.server_name);
          itemServersChartSeries.value = [
            {
              name: 'Прибыль',
              data: topServers.map(server => parseFloat(server.total_amount || 0))
            }
          ];
        }
      } catch (error) {
        console.error("Ошибка получения данных о предмете:", error);
      }
    };

    const showServerDetails = async (server) => {
      selectedServer.value = server;
      showServerModal.value = true;

      try {
        const response = await axios.get(`/api/statistics/server/${server.server_id}?period=${period.value}&group_by=${groupBy.value}`);
        const data = response.data;

        const topItems = data.top_items || [];
        if (topItems.length > 0) {
          serverItemsChartOptions.value.xaxis.categories = topItems.map(item => item.item_name);
          serverItemsChartSeries.value = [
            {
              name: 'Прибыль',
              data: topItems.map(item => parseFloat(item.total_amount || 0))
            }
          ];
        }
      } catch (error) {
        console.error("Ошибка получения данных о сервере:", error);
      }
    };

    onMounted(fetchData);

    return {
      groupBy,
      period,
      changeGroupBy,
      changePeriod,
      getPeriodLabel,
      purchasesChartOptions,
      purchasesChartSeries,
      paymentsChartOptions,
      paymentsChartSeries,
      methodsChartOptions,
      methodsChartSeries,
      serversChartOptions,
      serversChartSeries,
      itemsChartOptions,
      topServerR,
      itemsChartSeries,
      totalPayments,
      uniqueUsers,
      averagePurchaseAmount,
      topDons,
      topServer,
      topItems,
      topServers,
      showItemModal,
      showServerModal,
      selectedItem,
      selectedServer,
      showItemDetails,
      showServerDetails,
      itemServersChartOptions,
      itemServersChartSeries,
      serverItemsChartOptions,
      serverItemsChartSeries
    };
  },
});
</script>

<style scoped>
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-yellow-400 {
  --tw-gradient-from: #facc15;
  --tw-gradient-to: rgba(250, 204, 21, 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-yellow-600 {
  --tw-gradient-to: #ca8a04;
}
</style>
