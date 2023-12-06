<template>
  <PChart
    type="bar"
    :data="chartData"
    :options="chartOptions"
    class="h-30rem"
  />
</template>

<script setup>
import "chartjs-adapter-date-fns";
import "chartjs-adapter-dayjs-4";
import { enUS } from "date-fns/locale";
import dayjs, { OpUnitType } from "dayjs";

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ["Dept1", "Dept2"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: documentStyle.getPropertyValue("--blue-500"),
        borderColor: documentStyle.getPropertyValue("--blue-500"),
        data: ["12-1-2023", "13-1-2023"],
      },
      {
        label: "My Second dataset",
        backgroundColor: documentStyle.getPropertyValue("--pink-500"),
        borderColor: documentStyle.getPropertyValue("--pink-500"),
        data: ["12-1-2023", "13-1-2023"],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        position: "top",
        stacked: true,
        // type: "time",
        // time: {
        //   unit: "day",
        //   // displayFormats: {
        //   //   day: "MMM D",
        //   // },
        // },
        // adapters: {
        //   date: {
        //     local: enUS,
        //   },
        // },
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },

      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};

definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="css" scoped>
.g-gantt-chart {
  overflow: scroll;
}
</style>
