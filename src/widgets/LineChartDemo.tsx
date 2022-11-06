import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import labels_a from '../utils/labels.json'
import labels_e from '../utils/labels_e.json'
import useStore from "../utils/store";

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

export default function LineChartDemo() {
  const theme = useTheme()
  const departments = useStore((state) => state.departments)
  const employees = useStore((state) => state.employees)
  const data = useMemo(() => departments.map(d => {
    const salaries = employees.filter(e => e.departmentId === d.id).reduce((sum, e) => sum + e.salary, 0)
    return {
      name: d.name,
      pv: salaries
    }
  }), [departments, employees])

  return (
    <Card>
      <CardHeader title={process.env.REACT_APP_LANG === 'en' ? labels.salesBySector : labels.salariesByDept} />
      <CardContent>
        <ResponsiveContainer height={244}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 50,
              left: 50,
              bottom: 5,
            }}
          >
            <XAxis
              axisLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickLine={false}
              dataKey="name"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
              }}
            />
            <Line
              name="Value"
              type="monotone"
              dataKey="pv"
              stroke={theme.palette.primary.main}
              strokeWidth={6}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

