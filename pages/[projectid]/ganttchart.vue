<template>
  <div id="app" style="width: 100%">
    <h2>National Blood Donation Program</h2>
    <BarChart v-bind="barChartProps" />
  </div>
</template>

<script>
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
import { defineComponent, ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { BarChart, useBarChart } from 'vue-chart-3';


Chart.register(...registerables);


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

    const assignedTasks = {
      id: "assignedTasks",
      afterDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right },
          scales: { x, y },
        } = chart;
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        chartData.value.datasets[0].data.forEach((datapoint, index) => {
          ctx.fillText(datapoint.name, 10, y.getPixelForValue(index));
        });
        ctx.fillText("Names", 10, top - 15);
        ctx.restore();
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
        indexAxis: 'y',
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
            min: '2023-09-01',
            max: '2023-10-31'
          }
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
        }

      },
      plugins: [todayLine, weekend],
    });

    onMounted(() => {
      if (barChartRef.value) {
        barChartRef.value.chartInstance.destroy();
        barChartRef.value.renderChart();
      }
      else {

        barChartRef.value.renderChart();
      }

    });



    return { barChartProps, barChartRef };
  },
});

definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  border-width: 3px;
  border-color: grey;
}
</style>
