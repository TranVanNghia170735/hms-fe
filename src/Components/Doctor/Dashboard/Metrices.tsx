import { AreaChart } from "@mantine/charts";

const Metrices = () => {
   const data = [
      { date: "2025-10-01", appointments: 5 },
      { date: "2025-10-02", appointments: 8 },
      { date: "2025-10-03", appointments: 6 },
      { date: "2025-10-04", appointments: 10 },
      { date: "2025-10-05", appointments: 7 },
      { date: "2025-10-06", appointments: 9 },
      { date: "2025-10-07", appointments: 11 },
   ];

   const getSum = (data: any[], key: string) => {
      return data.reduce((sum, item) => sum + item[key], 0);
   };
   return (
      <div className="bg-violet-50 rounded-xl border">
         <div className="flex justify-between p-5 items-center">
            <div>
               <div className="font-semibold">Appointments</div>
               <div className="text-xs text-gray-500">Last 7 days</div>
            </div>
            <div className="text-2xl font-bold text-violet-500">{getSum(data, "appointments")}</div>
         </div>
         <AreaChart
            h={100}
            data={data}
            dataKey="date"
            series={[{ name: "appointments", color: "violet" }]}
            strokeWidth={5}
            withGradient
            fillOpacity={0.7}
            curveType="bump"
            tickLine="none"
            gridAxis="none"
            withXAxis={false}
            withYAxis={false}
            withDots={false}
         />
      </div>
   );
};

export default Metrices;
