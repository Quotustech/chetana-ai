"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { RootState, useSelector } from "@/src/Redux/store";
import { getAllUsers } from "@/src/Redux/actions/superAdminAction";
import { useDispatch } from "@/src/Redux/store";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserCount {
  [day: string]: number;
}

const BarChart: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.superAdminReducer);
  const [startDate, setStartDate] = useState(0 as number);
  const [endDate, setEndDtae] = useState(0 as number);
  const shortDaysOfWeek = [
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const userCountByDay = {} as UserCount;

  const filteredUsers = useMemo(() => {
    if (users.length === 0) {
      return []; // Return an empty array if users are not yet fetched
    }

    const filtered = users.filter((user) => {
      const userCreatedAt = new Date(user.createdAt).getTime();
      return userCreatedAt >= startDate && userCreatedAt <= endDate;
    });
    // console.log("!!!!!", filtered);
    return filtered;
  }, [startDate, endDate, users]);

  useEffect(() => {
    const getCurrentWeek = () => {
      const dateString = Date.now(); // Your date string
      const date = new Date(dateString); // Parse the date string into a Date object

      // Calculate the week start date (Sunday)
      const weekStartDate = new Date(date);
      weekStartDate.setDate(date.getDate() - date.getDay() - 1); // Subtract the current day of the week to get to Sunday

      // Calculate the week end date (Saturday)
      const weekEndDate = new Date(date);
      weekEndDate.setDate(date.getDate() - date.getDay() + 6); // Add the remaining days until Saturday

      setStartDate(weekStartDate.getTime());
      setEndDtae(weekEndDate.getTime());
    };
    getCurrentWeek();
    dispatch(getAllUsers())

  }, []);

  const calculateDailyGrowth = () => {
    const dailyGrowth: number[] = [];
    filteredUsers.forEach((user) => {
      const day = new Date(user.createdAt).getDay(); // Extract date from createdAt
      userCountByDay[shortDaysOfWeek[day]] =
        (userCountByDay[shortDaysOfWeek[day]] || 0) + 1;
    });
    const weekData = shortDaysOfWeek.map((day) => {
      return userCountByDay[day] || 0;
    });
    // console.log("week data", weekData);
    const days = Object.values(weekData);
    // console.log("days", days);
    for (let i = 0; i < weekData.length - 1; i++) {
      const previousDayUsers = i === 0 ? 0 : weekData[i - 1];
      // console.log("previousDayUsers", previousDayUsers);
      const currentDayUsers = weekData[i];
      // console.log("currentDayUsers", currentDayUsers);
      let growthPercentage = Math.floor(
        ((currentDayUsers - previousDayUsers) / previousDayUsers) * 100
      );
      // console.log("growth%", growthPercentage);
      if (growthPercentage < 0) {
        growthPercentage = 100 + growthPercentage;
      }
      dailyGrowth[i + 1] = previousDayUsers > 0 ? growthPercentage : 0;
    }
    return dailyGrowth;
  };
  // console.log('userCountByDate' , userCountByDay)
  // console.log("growth", calculateDailyGrowth());

  const optionscolumnchart: ApexOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: shortDaysOfWeek.slice(1),
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      //   tooltip: {
      //     enabled: true,
      //   }
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    title: {
      text: "Weekly User Growth",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
  };

  const series = [
    {
      name: "Growth",
      data: calculateDailyGrowth().slice(1),
    },
  ];
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-7">
      <div id="chart">
        <ReactApexChart
          options={optionscolumnchart}
          series={series}
          type="bar"
          width={"100%"}
          height="350px"
        />
      </div>
    </div>
  );
};

export default BarChart;
