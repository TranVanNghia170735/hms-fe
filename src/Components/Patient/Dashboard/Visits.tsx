import { AreaChart } from "@mantine/charts";

const Visits = () => {
   const data = [
      { date: "January", visits: 5 },
      { date: "February", visits: 8 },
      { date: "March", visits: 6 },
      { date: "April", visits: 10 },
      { date: "May", visits: 7 },
      { date: "June", visits: 9 },
      { date: "July", visits: 11 },
      { date: "August", visits: 6 },
      { date: "September", visits: 8 },
      { date: "October", visits: 12 },
      { date: "November", visits: 9 },
      { date: "December", visits: 14 },
   ];

   const getSum = (data: any[], key: string) => {
      return data.reduce((sum, item) => sum + item[key], 0);
   };
   return (
      <div className="bg-violet-50 rounded-xl border">
         <div className="flex justify-between p-5 items-center">
            <div>
               <div className="font-semibold">visits</div>
               <div className="text-xs text-gray-500">{new Date().getFullYear()}</div>
            </div>
            <div className="text-2xl font-bold text-violet-500">{getSum(data, "visits")}</div>
         </div>
         <AreaChart
            h={150}
            data={data}
            dataKey="date"
            series={[{ name: "visits", color: "violet" }]}
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

export default Visits;
