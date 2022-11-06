import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import labels_a from '../utils/labels.json'
import labels_e from '../utils/labels_e.json'
import useStore from "../utils/store";
import { format } from 'date-fns'

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

export default function AdminLineChartDemo() {
  const theme = useTheme()
  const contacts = useStore((state) => state.contacts)
  const dates = contacts.filter(c => c.status === 's').map(c => format(new Date(c.sendingDate), 'dd/MM/yyyy'))
  const distinctDates = new Set(dates)
  const data = useMemo(() => Array.from(distinctDates).map(d => {
    const count = contacts.filter(c => c.sendingDate && format(new Date(c.sendingDate), 'dd/MM/yyyy') === d).length
    return {
      name: d,
      pv: count
    }
  }), [contacts])

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

