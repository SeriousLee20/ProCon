<template>
  <div
    id="app"
    class="px-8 flex-column flex-wrap align-items-center justify-content-center w-full mt-20"
  >
    <h2 class="text-center">National Blood Donation Program</h2>
    <BarChart v-bind="barChartProps" />
  </div>
</template>

<script>
import "chartjs-adapter-date-fns";
import { de } from "date-fns/locale";
import { defineComponent, ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import { BarChart, useBarChart } from "vue-chart-3";
const value = ref(null);

Chart.register(...registerables);
console.log(value);

let dto = {};
dto["project_id"] = "4ce23978-13ee-4e50-81dd-fbddf0bb84c6";

const fetchTasks = async () => {
  const { data: taskData } = await useFetch("/api/get_task_by_project", {
    method: "POST",
    body: dto,
    headers: { "cache-control": "no-cache" },
  });
  console.log(taskData.value.response);
};

fetchTasks();

export default defineComponent({
  name: "App",
  components: {
    BarChart,
  },
  setup() {
    const colours = [
      "rgba(255,26,104,1)",
      "rgba(255,159,64,1)",
      "rgba(75,192,192,1)",
    ];
    const chartData = ref({
      datasets: [
        {
          data: [
            {
              x: ["2023-09-12", "2023-10-20"],
              y: "Create Poster",
              name: "Amber - Program",
              status: 2,
            },
            {
              x: ["2023-10-24", "2023-12-15"],
              y: "Print Banner",
              name: "Amber - Program",
              status: 1,
            },
            {
              x: ["2023-12-07", "2023-12-14"],
              y: "This is a new Task",
              name: "Amber - Program",
              status: 1,
            },
            {
              x: ["2023-10-24", "2023-11-04"],
              y: "Clean Apparatus",
              name: "Amber - Program",
              status: 2,
            },
            {
              x: ["2023-09-15", "2023-11-25"],
              y: "Prepare floor plan",
              name: "Amber - Program",
              status: 1,
            },
          ],
          backgroundColor: (ctx) => {
            return colours[ctx.raw.status];
          },
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 10,
          barPercentage: 0.5,
        },
      ],
    });

    const todayLine = {
      id: "todayLine",
      afterDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right },
          scales: { x, y },
        } = chart;
        ctx.save();

        if (
          x.getPixelForValue(new Date()) >= left &&
          x.getPixelForValue(new Date()) <= right
        ) {
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "rgba(255, 26, 104, 1)";
          ctx.setLineDash([6, 6]);
          ctx.moveTo(x.getPixelForValue(new Date()), top);
          ctx.lineTo(x.getPixelForValue(new Date()), bottom);
          ctx.stroke();
          ctx.restore();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(255, 26, 104, 1)";
          ctx.fillStyle = "rgba(255, 26, 104, 1)";
          ctx.moveTo(x.getPixelForValue(new Date()), top + 3);
          ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
          ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          ctx.font = "bold 12px sans-serif";
          ctx.fillStyle = "rgba(255, 26, 104, 1)";
          ctx.textAlign = "center";
          ctx.fillText("Today", x.getPixelForValue(new Date()), bottom + 15);
        }
      },
    };

    const moveChart = {
      id: "moveChart",
      afterEvent(chart, args) {
        const {
          ctx,
          canvas,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        canvas.addEventListener("mousemove", (event) => {
          const x = args.event.x;
          const y = args.event.y;

          if (
            x >= left - 20 &&
            x <= left + 20 &&
            y >= bottom - 20 &&
            y <= bottom + 20
          ) {
            canvas.style.cursor = "pointer";
          } else if (
            x >= right - 20 &&
            x <= right + 20 &&
            y >= bottom - 20 &&
            y <= bottom + 20
          ) {
            canvas.style.cursor = "pointer";
          } else {
            canvas.style.cursor = "default";
          }
        });
      },
      afterDraw(chart, args, pluginOptions) {
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();

        class CircleChevron {
          // constructor(x1,y1){

          // }

          draw(ctx, x1, pixel) {
            const angle = Math.PI / 180;
            const radius = 20;
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = "rgba(255,26,104,0.7)";
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.arc(x1, bottom, radius, angle * 0, angle * 360, false);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgba(255,26,104)";
            ctx.moveTo(x1 + pixel, bottom - 7.5);
            ctx.lineTo(x1 - pixel, bottom);
            ctx.lineTo(x1 + pixel, bottom + 7.5);
            ctx.stroke();
            ctx.closePath();
          }
        }

        let drawCircleLeft = new CircleChevron();
        drawCircleLeft.draw(ctx, left, 5);

        let drawCircleRight = new CircleChevron();
        drawCircleRight.draw(ctx, right, -5);
      },
    };

    const weekend = {
      id: "weekend",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();

        x.ticks.forEach((tick, index) => {
          const day = new Date(tick.value).getDay();
          if (day === 0 || day === 6) {
            ctx.fillStyle = "rgba(102,102,102,0.2)";
            ctx.fillRect(
              x.getPixelForValue(tick.value),
              top,
              x.getPixelForValue(new Date(tick.value).setHours(24)) -
                x.getPixelForValue(tick.value),
              height
            );
          }
        });
      },
    };

    const { barChartProps, barChartRef } = useBarChart({
      chartData,
      options: {
        layout: {
          padding: {
            bottom: 25,
          },
        },
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            position: "top",
            type: "time",
            time: {
              unit: "day",
            },
            adapters: {
              date: {
                local: de,
              },
            },
            min: "2023-09-01",
            max: "2023-10-01",
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            yAlign: "bottom",
            callbacks: {
              label: (ctx) => {
                return [ctx.raw.name, ctx.label];
              },
              title: (ctx) => {
                const startDate = new Date(ctx[0].raw.x[0]);
                const endDate = new Date(ctx[0].raw.x[1]);
                const formattedStartDate = startDate.toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour12: true,
                });
                const formattedEndDate = endDate.toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour12: true,
                });
                return `${formattedStartDate} - ${formattedEndDate}`;
              },
            },
          },
        },
      },
      plugins: [todayLine, weekend, moveChart],
    });

    onMounted(() => {
      if (barChartRef.value) {
        barChartRef.value.chartInstance.destroy();
        barChartRef.value.renderChart();
      } else {
        barChartRef.value.renderChart();
      }
      console.log(barChartRef.value.chartInstance.ctx);
      barChartRef.value.chartInstance.ctx.onclick = moveScroll(
        barChartRef.value.chartInstance
      );
    });

    return { barChartProps, barChartRef };
  },
});

function moveScroll(chart) {
  chart.canvas.addEventListener("click", (event) => {
    const rect = chart.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
      x >= chart.chartArea.left - 20 &&
      x <= chart.chartArea.left + 20 &&
      y >= chart.chartArea.bottom - 20 &&
      y <= chart.chartArea.bottom + 20
    ) {
      const currentMinDate = new Date(chart.options.scales.x.min);
      const currentMaxDate = new Date(chart.options.scales.x.max);
      let newMinDate = addMonths(currentMinDate, -1);
      let newMaxDate = addMonths(currentMaxDate, -1);
      console.log(newMinDate, newMaxDate);
      chart.options.scales.x.min = newMinDate;
      chart.options.scales.x.max = newMaxDate;
      chart.update();
    } else if (
      x >= chart.chartArea.right - 20 &&
      x <= chart.chartArea.right + 20 &&
      y >= chart.chartArea.bottom - 20 &&
      y <= chart.chartArea.bottom + 20
    ) {
      const currentMinDate = new Date(chart.options.scales.x.min);
      const currentMaxDate = new Date(chart.options.scales.x.max);
      let newMinDate = addMonths(currentMinDate, 1);
      let newMaxDate = addMonths(currentMaxDate, 1);
      console.log(newMinDate, newMaxDate);
      chart.options.scales.x.min = newMinDate;
      chart.options.scales.x.max = newMaxDate;
      chart.update();
    }
  });
}

function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return formatDate(date);
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

definePageMeta({
  // layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style>
#app {
}
</style>
