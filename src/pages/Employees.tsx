import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useMemo, useState } from "react";
import Empty from "../components/Empty";
import useStore from "../utils/store";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Fuse from "fuse.js"
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Page from "../components/Page";
import labels_a from '../utils/labels.json'
import labels_e from '../utils/labels_e.json'

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "name",
    align: "left",
    label: labels.name,
  },
  {
    id: "department",
    align: "left",
    label: process.env.REACT_APP_LANG === 'en' ? labels.side : labels.department,
  },
  {
    id: "status",
    align: "center",
    label: labels.status,
  },
];

export default function Employees() {
  let navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [view, setView] = useState(matches ? 'list' :'grid')
  const departments = useStore((state) => state.departments)
  const employees = useStore((state) => state.employees)
  const extendedEmployees = useMemo(() => employees.map(e => ({
    ...e,
    departmentName: departments.find(d => d.id === e.departmentId)?.name,
  })), [employees, departments])
  const data = useMemo(() => {
    if (!search) {
      return extendedEmployees
    }
    const options = {
      includeScore: true,
      findAllMatches: true,
      threshold: 0.1,
      keys: ['name', 'job', 'departmentName', 'address']
    }
    const fuse = new Fuse(extendedEmployees, options)
    const result = fuse.search(search)
    return result.map(p => p.item)
  }, [search, extendedEmployees])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setView(nextView);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (employees.length === 0) {
    return <Empty title={labels.noData} />
  }

  return (
    <Page title={labels.employees}>
      <>
        <Stack direction="row" spacing={{xs: 1, sm: 2}}>
          <TextField
            margin="normal"
            id="name"
            name="search"
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={labels.search}
            sx={{ my: 0, flexGrow: 1 }}
          />
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Fab color="primary" aria-label="add" onClick={() => navigate("/main/employee-edit/0")}>
            <AddIcon />
          </Fab>
        </Stack>

        {view === 'list' ?
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              sx={{
                minWidth: 600,
                borderCollapse: "separate",
                borderSpacing: "0 1rem",
              }}
            >
              <TableHead>
                <TableRow sx={{ "& th": { border: 0 } }}>
                  <TableCell sx={{ py: 0 }}>
                    <Checkbox
                      color="primary"
                      disabled
                    />
                  </TableCell>
                  {headCells.map(e => (
                    <TableCell key={e.id} align={e.align} sx={{ py: 0 }}>
                      {e.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, i) => (
                  <TableRow
                    // aria-checked={selected}
                    tabIndex={-1}
                    key={e.id}
                    sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
                    >
                      <IconButton aria-label="edit" onClick={() => navigate(`/main/employee-edit/${e.id}`)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ mr: 3 }} src={`/img/${e.image}`} />
                        <Box>
                          <Typography component="div" variant="h6">
                            {e.name}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            {e.job}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{process.env.REACT_APP_LANG === 'en' ? e.address : e.departmentName}</TableCell>
                    <TableCell align="center">
                      {e.isActive ? (
                        <Chip color="primary" label={labels.isActive} />
                        ) : (
                        <Chip label={labels.inActive} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        : <Grid container spacing={2} sx={{ pt: 2 }}>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((e, i) => (
                <Grid xs={12} md={6} lg={3} key={i}>
                  <Card>
                    <Avatar sx={{ mr: 3, m: 'auto', height: 140, width: 140, mt: 2 }} src={`/img/${e.image}`} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" align="center">
                        {e.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {e.job} <br />
                        {process.env.REACT_APP_LANG === 'en' ? e.address : e.departmentName}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => navigate(`/main/employee-edit/${e.id}`)}>{labels.edit}</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            }
          </Grid>
        }
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </Page>
  );
};

