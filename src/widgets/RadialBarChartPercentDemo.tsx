import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import labels from '../utils/labels.json'
import useStore from "../utils/store";


export default function RadialBarChartPercentDemo() {
  const theme = useTheme();
  const employees = useStore((state) => state.employees)
  const value = Math.round(employees.filter(e => e.gender === 'f').length / employees.length * 100)
  return (
    <Card>
      <CardHeader title={process.env.REACT_APP_LANG === 'en' ? labels.salesToTarget : labels.femalesPercent} />
      <CardContent>
        <ResponsiveContainer width="99%" height={244}>
          <RadialBarChart
            innerRadius="85%"
            outerRadius="85%"
            barSize={32}
            data={[{ fill: theme.palette.primary.main, value }]}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey={"value"}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              cornerRadius={16}
              label={{
                fill: theme.palette.text.primary,
                fontSize: theme.typography.h1.fontSize,
                fontWeight: theme.typography.h1.fontWeight,
                position: "center",
              }}
              background={{ fill: theme.palette.background.default }}
              dataKey="value"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

