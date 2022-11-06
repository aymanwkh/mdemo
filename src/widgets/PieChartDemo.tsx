import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import useStore from "../utils/store";
import { colors } from '../utils/config'
import labels from '../utils/labels.json'

// const salesData = [
//   {
//     name: "Education",
//     fill: colors[0],
//     value: 20,
//   },
//   {
//     name: "Industrial",
//     fill: colors[1],
//     value: 25,
//   },
//   {
//     name: "Commercial",
//     fill: colors[2],
//     value: 35,
//   },
//   {
//     name: "Non-Profit",
//     fill: colors[3],
//     value: 10,
//   },
//   {
//     name: "Others",
//     fill: colors[4],
//     value: 10,
//   },
// ];

export default function PieChartDemo() {
  const theme = useTheme();
  const departments = useStore((state) => state.departments)
  const employees = useStore((state) => state.employees)
  const data = useMemo(() => departments.map(d => {
    const count = employees.filter(e => e.departmentId === d.id).length
    const color = colors[+d.id]
    return {
      name: d.name,
      fill: color,
      value: count
    }
  }), [departments, employees])

  return (
    <Card>
      <CardHeader title={process.env.REACT_APP_LANG === 'en' ? labels.customersBySector : labels.employeesByDept} />
      <CardContent>
        <ResponsiveContainer width="99%" height={244}>
          <PieChart width={244} height={244}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              stroke={theme.palette.background.paper}
              strokeWidth={8}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
              }}
              itemStyle={{
                color: theme.palette.text.primary,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 14 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

