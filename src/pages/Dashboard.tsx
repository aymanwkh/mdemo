import Grid from "@mui/material/Unstable_Grid2"
import PieChartDemo from "../widgets/PieChartDemo"
import RadialBarChartDemo from "../widgets/RadialBarChartDemo"
import LineChartDemo from "../widgets/LineChartDemo"
import RadialBarChartPercentDemo from "../widgets/RadialBarChartPercentDemo"
import Header from "../components/Header"
import { Link } from "react-router-dom"

export default function Dashboard() {
  return (
    <>
      <Header pageTitle="" />
      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <LineChartDemo />
        </Grid>
        <Grid xs={12} md={4}>
          <RadialBarChartPercentDemo />
        </Grid>
        <Grid xs={12} md={8}>
          <RadialBarChartDemo />
        </Grid>
        <Grid xs={12} md={4}>
          <Link to="/main/departments">
            <PieChartDemo />
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

