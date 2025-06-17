import { defineComponent, ref, computed, watch, onMounted, useSSRContext, resolveComponent, mergeProps } from "vue";
import axios from "axios";
import { _ as _sfc_main$3 } from "./Dashboard-fXrpRFWF.js";
import VueApexCharts from "vue3-apexcharts";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "@inertiajs/vue3";
import "@heroicons/vue/24/outline";
const _sfc_main$2 = defineComponent({
  name: "TopItemsChart",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    period: {
      type: String,
      default: "30d"
    }
  },
  setup(props) {
    const itemsData = ref({});
    const loading = ref(true);
    const error = ref(null);
    const chartData = computed(() => {
      const items = [];
      const counts = [];
      const revenues = [];
      const colors = [];
      Object.keys(itemsData.value).forEach((server) => {
        const serverItems = itemsData.value[server];
        serverItems.forEach((item) => {
          const itemName = `${item.item} (${server})`;
          items.push(itemName);
          counts.push(item.purchase_count);
          revenues.push(item.total_revenue);
          const serverColors = {
            "pve": "#8B5CF6",
            // Фиолетовый как на скриншоте
            "pvp": "#3B82F6",
            // Синий
            "tp": "#10B981",
            // Зеленый
            "sky": "#F59E0B",
            // Оранжевый
            "anarchy": "#EF4444"
            // Красный
          };
          colors.push(serverColors[server] || "#8B5CF6");
        });
      });
      return { items, counts, revenues, colors };
    });
    const chartSeries = computed(() => {
      return [{
        name: "Количество покупок",
        data: chartData.value.counts
      }];
    });
    const chartOptions = computed(() => {
      return {
        chart: {
          id: "top-items",
          toolbar: {
            show: true
          },
          background: "#18181b",
          // Темный фон как на скриншоте
          foreColor: "#d1d5db"
          // Светлый текст для темного фона
        },
        plotOptions: {
          bar: {
            distributed: true,
            // Разные цвета для каждого столбца
            columnWidth: "60%",
            // Ширина столбцов
            dataLabels: {
              position: "top"
            }
          }
        },
        colors: chartData.value.colors,
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val + " ";
          },
          style: {
            colors: ["#f8fafc"]
          },
          offsetY: -20
        },
        xaxis: {
          categories: chartData.value.items,
          labels: {
            style: {
              colors: "#d1d5db"
            },
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true
          }
        },
        yaxis: {
          title: {
            text: "Количество",
            style: {
              color: "#d1d5db"
            }
          },
          labels: {
            formatter: function(val) {
              return val + " ₽";
            }
          }
        },
        grid: {
          borderColor: "#2d3748"
        },
        tooltip: {
          theme: "dark",
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
              position: "bottom"
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
          error.value = "Ошибка при получении данных";
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
      chartSeries
    };
  }
});
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dashboard/TestChart.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TestChart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-706cf811"]]);
const _sfc_main$1 = defineComponent({
  name: "ServerRevenueChart",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    period: {
      type: String,
      default: "30d"
    }
  },
  setup(props) {
    const serversData = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const servers = computed(() => serversData.value.map((item) => item.server));
    const revenueData = computed(() => serversData.value.map((item) => Math.round(parseFloat(item.total_revenue))));
    const purchasesData = computed(() => serversData.value.map((item) => parseInt(item.total_purchases)));
    const avgPriceData = computed(() => serversData.value.map((item) => Math.round(parseFloat(item.average_price))));
    const revenueChartOptions = computed(() => ({
      chart: {
        id: "server-revenue",
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: "Сервера" }
      },
      yaxis: {
        title: { text: "Выручка" }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: "Выручка по серверам",
        align: "center"
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: "#000"
        },
        theme: "dark"
      },
      colors: ["#2E93fA"]
    }));
    const purchasesChartOptions = computed(() => ({
      chart: {
        id: "server-purchases",
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: "Сервера" }
      },
      yaxis: {
        title: { text: "Кол-во покупок" }
      },
      dataLabels: {
        enabled: true
      },
      title: {
        text: "Количество покупок по серверам",
        align: "center"
      },
      colors: ["#66DA26"],
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(0)}`;
          }
        },
        style: {
          color: "#000"
        },
        theme: "dark"
      }
    }));
    const avgPriceChartOptions = computed(() => ({
      chart: {
        id: "avg-price",
        toolbar: { show: true }
      },
      xaxis: {
        categories: servers.value,
        title: { text: "Сервера" }
      },
      yaxis: {
        title: { text: "Средняя цена" }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(2);
        }
      },
      title: {
        text: "Средняя цена покупки по серверам",
        align: "center"
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: "#000"
        },
        theme: "dark"
      },
      colors: ["#FF4560"]
    }));
    const pieChartOptions = computed(() => ({
      chart: {
        id: "revenue-distribution",
        toolbar: { show: true }
      },
      labels: servers.value,
      title: {
        text: "Распределение выручки по серверам",
        align: "center"
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return `${val.toFixed(2)}`;
          }
        },
        style: {
          color: "#000"
        },
        theme: "dark"
      },
      legend: {
        position: "bottom"
      }
    }));
    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`/api/stats/server-revenue?period=${props.period}`);
        if (response.data.success) {
          serversData.value = response.data.data;
        } else {
          error.value = "Ошибка при получении данных";
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
      pieChartOptions
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_apexchart = resolveComponent("apexchart");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "server-revenue-chart" }, _attrs))}><h2 class="text-xl font-bold mb-4">Прибыльность серверов</h2>`);
  if (_ctx.loading) {
    _push(`<div class="text-center py-8">Загрузка данных...</div>`);
  } else if (_ctx.error) {
    _push(`<div class="text-red-500 py-4">${ssrInterpolate(_ctx.error)}</div>`);
  } else {
    _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="p-4 border rounded"><h3 class="text-lg font-semibold mb-2 text-white">Общая выручка по серверам</h3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "bar",
      height: "350",
      options: _ctx.revenueChartOptions,
      series: [{ name: "Выручка", data: _ctx.revenueData }]
    }, null, _parent));
    _push(`</div><div class="p-4 border rounded"><h3 class="text-lg font-semibold mb-2 text-white">Количество покупок по серверам</h3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "bar",
      height: "350",
      options: _ctx.purchasesChartOptions,
      series: [{ name: "Покупки", data: _ctx.purchasesData }]
    }, null, _parent));
    _push(`</div><div class="p-4 border rounded"><h3 class="text-lg font-semibold mb-2 text-white">Средняя цена покупки</h3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "bar",
      height: "350",
      options: _ctx.avgPriceChartOptions,
      series: [{ name: "Средняя цена", data: _ctx.avgPriceData }]
    }, null, _parent));
    _push(`</div><div class="p-4 border rounded"><h3 class="text-lg font-semibold mb-2 text-white">Распределение выручки</h3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "pie",
      height: "350",
      options: _ctx.pieChartOptions,
      series: _ctx.revenueData
    }, null, _parent));
    _push(`</div></div>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dashboard/ReChart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TestChart2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = defineComponent({
  name: "StatisticsDashboard",
  components: {
    apexchart: VueApexCharts,
    testChart: TestChart,
    TestChart2
  },
  layout: _sfc_main$3,
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
        case "1d":
          return "за 1 день";
        case "7d":
          return "за 7 дней";
        case "14d":
          return "за 14 дней";
        case "30d":
          return "за 30 дней";
        case "year":
          return "за год";
        case "all":
          return "за все время";
        default:
          return `за ${groupBy.value === "month" ? "месяц" : "день"}`;
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
        return { name: "N/A", amount: 0 };
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
        type: "area",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800
        },
        background: "transparent"
      },
      colors: ["#facc15"],
      stroke: {
        curve: "smooth",
        width: 3
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: "dark",
        x: {
          show: true,
          format: "dd MMM yyyy"
          // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), "dd MMM", { locale: ru });
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        title: {
          text: "Дата",
          style: {
            color: "#9ca3af"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: (value) => `${value} ₽`
        },
        title: {
          text: "Сумма покупок",
          style: {
            color: "#9ca3af"
          }
        }
      }
    });
    const purchasesChartSeries = ref([
      {
        name: "Покупки",
        data: []
      }
    ]);
    const paymentsChartOptions = ref({
      chart: {
        type: "area",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800
        },
        background: "transparent"
      },
      colors: ["#10b981"],
      stroke: {
        curve: "smooth",
        width: 3
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: "dark",
        x: {
          show: true,
          format: "dd MMM yyyy"
          // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`
        }
      },
      xaxis: {
        type: "datetime",
        // Указываем, что это даты
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), "dd MMM", { locale: ru });
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        title: {
          text: "Дата",
          style: {
            color: "#9ca3af"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: (value) => `${value} ₽`
        },
        title: {
          text: "Сумма платежей",
          style: {
            color: "#9ca3af"
          }
        }
      }
    });
    const paymentsChartSeries = ref([
      {
        name: "Платежи",
        data: []
      }
    ]);
    const methodsChartOptions = ref({
      chart: {
        type: "line",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        background: "transparent"
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: "dark",
        x: {
          show: true,
          format: "dd MMM yyyy"
          // Форматирование даты в tooltip
        },
        y: {
          formatter: (value) => `${value} ₽`
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: function(value, timestamp) {
            return format(new Date(timestamp), "dd MMM", { locale: ru });
          }
        },
        title: {
          text: "Дата",
          style: {
            color: "#9ca3af"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: (value) => `${value} ₽`
        },
        title: {
          text: "Сумма по методам платежей",
          style: {
            color: "#9ca3af"
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#9ca3af"
        }
      }
    });
    const methodsChartSeries = ref([]);
    const serversChartOptions = ref({
      chart: {
        type: "bar",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        background: "transparent"
      },
      colors: ["#3b82f6"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 6,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val} ₽`,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => `${value} ₽`
        },
        z: {
          formatter: (value) => `${value} продаж`,
          title: "Продажи:"
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9ca3af"
          },
          rotate: -45,
          rotateAlways: true
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af"
          },
          formatter: (value) => `${value} ₽`
        }
      }
    });
    const serversChartSeries = ref([]);
    const itemsChartOptions = ref({
      ...serversChartOptions.value,
      colors: ["#8b5cf6"]
    });
    const itemsChartSeries = ref([]);
    const itemServersChartOptions = ref({
      ...serversChartOptions.value,
      colors: ["#ec4899"],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9ca3af"
          },
          rotate: -45,
          rotateAlways: true
        }
      }
    });
    const serverItemsChartOptions = ref({
      ...serversChartOptions.value,
      colors: ["#f59e0b"],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9ca3af"
          },
          rotate: -45,
          rotateAlways: true
        }
      }
    });
    const topDons = ref([]);
    const topServerR = ref([]);
    const fetchData = async () => {
      var _a;
      try {
        const response = await axios.get(`/api/statistics?period=${period.value}&group_by=${groupBy.value}`);
        statsData.value = response.data;
        topDons.value.splice(
          0,
          topDons.value.length,
          ...((_a = statsData.value.top_donators) == null ? void 0 : _a.map((donator) => ({
            ...donator,
            total: Number(donator.total)
          }))) || []
        );
        topServerR.value = response.data.top_server;
        console.log(topServerR.value);
        updateCharts();
      } catch (error) {
        console.error("Ошибка получения данных:", error);
        alert("Ошибка при загрузке данных статистики");
      }
    };
    console.log(topDons.value);
    console.log(statsData.value);
    const updateCharts = () => {
      var _a, _b;
      purchasesChartOptions.value.xaxis.categories = statsData.value.purchases.map(
        (item) => new Date(item.date).getTime()
      );
      purchasesChartSeries.value[0].data = statsData.value.purchases.map((item) => ({
        x: new Date(item.date).getTime(),
        y: parseFloat(item.total_amount || 0)
      }));
      const payments = Array.isArray(statsData.value.payments) ? statsData.value.payments : ((_a = statsData.value.payments) == null ? void 0 : _a.all_payments) || [];
      paymentsChartOptions.value.xaxis.categories = payments.map((item) => {
        return new Date(item.date).getTime();
      });
      paymentsChartSeries.value[0].data = payments.map((item) => ({
        x: new Date(item.date).getTime(),
        y: parseFloat(item.total_amount || 0)
      }));
      const paymentMethods = ((_b = statsData.value.payments) == null ? void 0 : _b.payment_methods) || statsData.value.payment_methods || [];
      if (paymentMethods.length > 0) {
        const uniqueDates = [...new Set(payments.map((item) => formatDate(item.date)))];
        const uniqueMethods = [...new Set(paymentMethods.map((item) => item.method))];
        methodsChartOptions.value.xaxis.categories = uniqueDates;
        methodsChartOptions.value.xaxis.categories = uniqueDates;
        methodsChartSeries.value = uniqueMethods.map((method) => {
          const methodData = payments.map((paymentItem) => {
            const matchingMethod = paymentMethods.find(
              (item) => item.method === method && item.date === paymentItem.date
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
        methodsChartOptions.value.xaxis.categories = payments.map((item) => item.date);
        methodsChartSeries.value = [{
          name: "Все платежи",
          data: payments.map((item) => parseFloat(item.total_amount || 0))
        }];
      }
      const topServers2 = statsData.value.top_servers || [];
      if (topServers2.length > 0) {
        const serverNames = topServers2.map((server) => String(server.server_name));
        const serverAmounts = topServers2.map((server) => parseFloat(server.total_amount || 0));
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
          name: "Прибыль",
          data: serverAmounts
        }];
        const topItems2 = statsData.value.top_items || [];
        if (topItems2.length > 0) {
          const itemNames = topItems2.map((item) => String(item.item_name));
          const itemAmounts = topItems2.map((item) => parseFloat(item.total_amount || 0));
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
            name: "Прибыль",
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
        const topServers2 = data.top_servers || [];
        if (topServers2.length > 0) {
          itemServersChartOptions.value.xaxis.categories = topServers2.map((server) => server.server_name);
          itemServersChartSeries.value = [
            {
              name: "Прибыль",
              data: topServers2.map((server) => parseFloat(server.total_amount || 0))
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
        const topItems2 = data.top_items || [];
        if (topItems2.length > 0) {
          serverItemsChartOptions.value.xaxis.categories = topItems2.map((item) => item.item_name);
          serverItemsChartSeries.value = [
            {
              name: "Прибыль",
              data: topItems2.map((item) => parseFloat(item.total_amount || 0))
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
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b;
  const _component_apexchart = resolveComponent("apexchart");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-900 text-white p-6" }, _attrs))} data-v-ecd232d3><div class="flex justify-between items-center mb-6" data-v-ecd232d3><h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600" data-v-ecd232d3> Статистика сервера </h1><div class="flex space-x-2" data-v-ecd232d3><div class="bg-gray-800 rounded-lg p-1 mr-2" data-v-ecd232d3><button class="${ssrRenderClass([_ctx.period === "1d" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> 1д </button><button class="${ssrRenderClass([_ctx.period === "7d" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> 7д </button><button class="${ssrRenderClass([_ctx.period === "14d" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> 14д </button><button class="${ssrRenderClass([_ctx.period === "30d" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> 30д </button><button class="${ssrRenderClass([_ctx.period === "year" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> Год </button><button class="${ssrRenderClass([_ctx.period === "all" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> Все время </button></div><div class="bg-gray-800 rounded-lg p-1" data-v-ecd232d3><button class="${ssrRenderClass([_ctx.groupBy === "month" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> По месяцам </button><button class="${ssrRenderClass([_ctx.groupBy === "day" ? "bg-yellow-500 text-gray-900" : "bg-gray-700", "px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"])}" data-v-ecd232d3> По дням </button></div></div></div><div class="grid grid-cols-4 gap-4 mb-6" data-v-ecd232d3><div class="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500 shadow-lg transform hover:scale-105 transition-transform" data-v-ecd232d3><h3 class="text-gray-400 mb-1 text-sm" data-v-ecd232d3>Всего платежей</h3><div class="text-2xl font-bold" data-v-ecd232d3>${ssrInterpolate(_ctx.totalPayments)} ₽</div><div class="text-sm text-gray-400 mt-1" data-v-ecd232d3>${ssrInterpolate(_ctx.getPeriodLabel())}</div></div><div class="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500 shadow-lg transform hover:scale-105 transition-transform" data-v-ecd232d3><h3 class="text-gray-400 mb-1 text-sm" data-v-ecd232d3>Уникальных пользователей</h3><div class="text-2xl font-bold" data-v-ecd232d3>${ssrInterpolate(_ctx.uniqueUsers)}</div><div class="text-sm text-gray-400 mt-1" data-v-ecd232d3>${ssrInterpolate(_ctx.getPeriodLabel())}</div></div><div class="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 shadow-lg transform hover:scale-105 transition-transform" data-v-ecd232d3><h3 class="text-gray-400 mb-1 text-sm" data-v-ecd232d3>Средний платеж</h3><div class="text-2xl font-bold" data-v-ecd232d3>${ssrInterpolate(_ctx.averagePurchaseAmount)} ₽</div><div class="text-sm text-gray-400 mt-1" data-v-ecd232d3>${ssrInterpolate(_ctx.getPeriodLabel())}</div></div><div class="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500 shadow-lg transform hover:scale-105 transition-transform" data-v-ecd232d3><h3 class="text-gray-400 mb-1 text-sm" data-v-ecd232d3>Топ сервер</h3><div class="text-2xl font-bold" data-v-ecd232d3>${ssrInterpolate(((_a = _ctx.topServerR) == null ? void 0 : _a.server_name) || "N/A")}</div><div class="text-sm text-gray-400 mt-1" data-v-ecd232d3>${ssrInterpolate(((_b = _ctx.topServerR) == null ? void 0 : _b.total_revenue) || 0)} ₽</div></div></div><div class="grid grid-cols-2 gap-4 mb-6" data-v-ecd232d3><div class="bg-gray-800 p-4 rounded-lg shadow-lg" data-v-ecd232d3><h2 class="text-lg mb-4 font-bold" data-v-ecd232d3>Статистика покупок </h2><div class="h-80" data-v-ecd232d3>`);
  _push(ssrRenderComponent(_component_apexchart, {
    type: "area",
    height: "100%",
    options: _ctx.purchasesChartOptions,
    series: _ctx.purchasesChartSeries
  }, null, _parent));
  _push(`</div></div><div class="bg-gray-800 p-4 rounded-lg shadow-lg" data-v-ecd232d3><h2 class="text-lg mb-4 font-bold" data-v-ecd232d3>Статистика платежей </h2><div class="h-80" data-v-ecd232d3>`);
  _push(ssrRenderComponent(_component_apexchart, {
    type: "area",
    height: "100%",
    options: _ctx.paymentsChartOptions,
    series: _ctx.paymentsChartSeries
  }, null, _parent));
  _push(`</div></div></div><div class="bg-gray-800 p-4 rounded-lg shadow-lg mb-6" data-v-ecd232d3><h2 class="text-lg mb-4 font-bold" data-v-ecd232d3>Платежные способы </h2><div class="h-80" data-v-ecd232d3>`);
  _push(ssrRenderComponent(_component_apexchart, {
    type: "line",
    height: "100%",
    options: _ctx.methodsChartOptions,
    series: _ctx.methodsChartSeries
  }, null, _parent));
  _push(`</div></div><div class="grid grid-cols-2 gap-4" data-v-ecd232d3><div class="bg-gray-800 p-4 rounded-lg shadow-lg" data-v-ecd232d3><h2 class="text-lg mb-4 font-bold" data-v-ecd232d3>Топ предметы</h2><div class="overflow-x-auto" data-v-ecd232d3><table class="min-w-full" data-v-ecd232d3><thead data-v-ecd232d3><tr data-v-ecd232d3><th class="text-left py-2 px-4 border-b border-gray-700" data-v-ecd232d3>Название</th><th class="text-left py-2 px-4 border-b border-gray-700" data-v-ecd232d3>Сумма</th><th class="text-left py-2 px-4 border-b border-gray-700" data-v-ecd232d3>Кол-во продаж</th></tr></thead><tbody data-v-ecd232d3><!--[-->`);
  ssrRenderList(_ctx.topItems, (item, index2) => {
    _push(`<tr class="hover:bg-gray-700 cursor-pointer" data-v-ecd232d3><td class="py-2 px-4 border-b border-gray-700" data-v-ecd232d3>${ssrInterpolate(item.item_name)}</td><td class="py-2 px-4 border-b border-gray-700" data-v-ecd232d3>${ssrInterpolate(parseFloat(item.total_amount).toFixed(2))} ₽</td><td class="py-2 px-4 border-b border-gray-700" data-v-ecd232d3>${ssrInterpolate(item.count)}</td></tr>`);
  });
  _push(`<!--]--></tbody></table></div></div><div class="bg-gray-800 p-4 rounded-lg shadow-lg" data-v-ecd232d3><h2 class="text-lg mb-4 font-bold" data-v-ecd232d3>Топ донатеров</h2><div class="overflow-x-auto" data-v-ecd232d3><table class="min-w-full" data-v-ecd232d3><thead data-v-ecd232d3><tr data-v-ecd232d3><th class="text-left py-2 px-4 border-b border-gray-700" data-v-ecd232d3>Игрок</th><th class="text-left py-2 px-4 border-b border-gray-700" data-v-ecd232d3>Сумма</th></tr></thead><tbody data-v-ecd232d3><!--[-->`);
  ssrRenderList(_ctx.topDons, (item, index2) => {
    _push(`<tr class="hover:bg-gray-700 cursor-pointer" data-v-ecd232d3><td class="py-2 px-4 border-b border-gray-700" data-v-ecd232d3>${ssrInterpolate(item.steamid)}</td><td class="py-2 px-4 border-b border-gray-700" data-v-ecd232d3>${ssrInterpolate(item.total)} ₽</td></tr>`);
  });
  _push(`<!--]--></tbody></table></div></div></div>`);
  if (_ctx.showItemModal) {
    _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-ecd232d3><div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full" data-v-ecd232d3><div class="flex justify-between items-center mb-4" data-v-ecd232d3><h3 class="text-xl font-bold" data-v-ecd232d3>Детали предмета: ${ssrInterpolate(_ctx.selectedItem.item_name)}</h3><button class="text-gray-400 hover:text-white text-2xl" data-v-ecd232d3>×</button></div><div class="mb-4" data-v-ecd232d3><h4 class="text-lg font-bold mb-2" data-v-ecd232d3>Серверы, где покупают</h4><div class="h-64" data-v-ecd232d3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "bar",
      height: "100%",
      options: _ctx.itemServersChartOptions,
      series: _ctx.itemServersChartSeries
    }, null, _parent));
    _push(`</div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.showServerModal) {
    _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-ecd232d3><div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full" data-v-ecd232d3><div class="flex justify-between items-center mb-4" data-v-ecd232d3><h3 class="text-xl font-bold" data-v-ecd232d3>Детали сервера: ${ssrInterpolate(_ctx.selectedServer.server_name)}</h3><button class="text-gray-400 hover:text-white text-2xl" data-v-ecd232d3>×</button></div><div class="mb-4" data-v-ecd232d3><h4 class="text-lg font-bold mb-2" data-v-ecd232d3>Топ предметы на сервере</h4><div class="h-64" data-v-ecd232d3>`);
    _push(ssrRenderComponent(_component_apexchart, {
      type: "bar",
      height: "100%",
      options: _ctx.serverItemsChartOptions,
      series: _ctx.serverItemsChartSeries
    }, null, _parent));
    _push(`</div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ecd232d3"]]);
export {
  index as default
};
