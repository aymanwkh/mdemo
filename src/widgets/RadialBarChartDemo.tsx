import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import labels from '../utils/labels.json'
import useStore from "../utils/store";
import { colors } from '../utils/config'

const categories = [
  {id: 0, from: 0, to: 299, name: '<300'},
  {id: 1, from: 300, to: 499, name: '300-499'},
  {id: 2, from: 500, to: 999, name: '500-999'},
  {id: 3, from: 1000, to: 3000, name: '>=1000'},
]
export default function RadialBarChartDemo() {
  const theme = useTheme();
  const employees = useStore((state) => state.employees)
  const data = useMemo(() => categories.sort((c1, c2) => c2.id - c1.id).map(c => {
    const count = employees.filter(e => e.salary >= c.from && e.salary <= c.to).length
    const color = colors[c.id]
    return {
      name: c.name,
      uv: count,
      fill: color
    }
  }), [employees])

  return (
    <Card>
      <CardHeader title={process.env.REACT_APP_LANG === 'en' ? labels.contractsBySize : labels.employeesBySalary} />
      <CardContent>
        <ResponsiveContainer width="99%" height={244}>
          <RadialBarChart
            barGap={1}
            innerRadius="15%"
            outerRadius="100%"
            barSize={16}
            data={data}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 10]}
              dataKey={"value"}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: theme.palette.background.default }}
              cornerRadius={16}
              label={{ position: "insideStart", fill: "#fff", fontWeight: 700 }}
              dataKey="uv"
            />
            <Legend
              align="right"
              wrapperStyle={{ fontWeight: 700 }}
              iconSize={16}
              layout="vertical"
              verticalAlign="middle"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

