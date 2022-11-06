import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useMemo, useState } from "react";
import Empty from "../components/Empty";
import useStore from "../utils/store";
import Header from "../components/Header";
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
    id: "count",
    align: "center",
    label: labels.employeesCount,
  },
  {
    id: "salaries",
    align: "center",
    label: labels.salariesSum,
  },
];

export default function Departments() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const departments = useStore((state) => state.departments)
  const employees = useStore((state) => state.employees)
  const data = useMemo(() => departments.map(d => {
    const deptEmployees = employees.filter(e => e.departmentId === d.id)
    return {
      ...d,
      employeesCount: deptEmployees.length,
      salaries: deptEmployees.reduce((sum, e) => sum + e.salary, 0)
    }
  }), [employees, departments])
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (departments.length === 0) {
    return <Empty title={labels.noData} />;
  }

  return (
    <>
      <Header pageTitle={labels.departments} />
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
                <TableCell>{e.name}</TableCell>
                <TableCell align="center">{e.employeesCount}</TableCell>
                <TableCell align="center">{e.salaries}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={departments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

