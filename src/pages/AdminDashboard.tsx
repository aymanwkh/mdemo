import Grid from "@mui/material/Unstable_Grid2"
import AdminPieChartDemo from "../widgets/AdminPieChartDemo"
import RadialBarChartDemo from "../widgets/RadialBarChartDemo"
import AdminLineChartDemo from "../widgets/AdminLineChartDemo"
import RadialBarChartPercentDemo from "../widgets/RadialBarChartPercentDemo"
import Header from "../components/Header"

export default function AdminDashboard() {
  return (
    <>
      <Header pageTitle="" />
      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <AdminLineChartDemo />
        </Grid>
        <Grid xs={12} md={4}>
          <RadialBarChartPercentDemo />
        </Grid>
        <Grid xs={12} md={8}>
          <RadialBarChartDemo />
        </Grid>
        <Grid xs={12} md={4}>
          <AdminPieChartDemo />
        </Grid>
      </Grid>
    </>
  )
}

