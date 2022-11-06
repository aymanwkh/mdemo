import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useMemo, useRef, useState } from "react";
import labels from '../utils/labels.json'
import useStore from "../utils/store";
import { Navigate, NavLink } from "react-router-dom";
import Header from "../components/Header";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { statuses, contactTypes } from "../utils/config";
import Empty from "../components/Empty";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Fuse from "fuse.js"
import Page from "../components/Page";
import { format } from 'date-fns'
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import Chip from "@mui/material/Chip";
import print from "../utils/print";
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "id",
    align: "left",
    label: labels.id,
  },
  {
    id: "name",
    align: "left",
    label: labels.name,
  },
  {
    id: "type",
    align: "left",
    label: labels.type,
  },
  {
    id: "status",
    align: "left",
    label: labels.status,
  },
  {
    id: "address",
    align: "left",
    label: labels.address,
  },
  {
    id: "sendingDate",
    align: "left",
    label: labels.sendingDate,
  },
  {
    id: "newAdvert",
    align: "center",
    label: labels.newAdvert,
  },
];

type Order = 'asc' | 'desc';

export default function Contacts() {
  const [page, setPage] = useState(0)
  const user = useStore((state) => state.user)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState('id')
  const [search, setSearch] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const contacts = useStore((state) => state.contacts)
  const inputEl = useRef<HTMLIFrameElement | null>(null)
  const extendedContacts = useMemo(() => contacts.map(c => {
    return {
      ...c,
      address: c.addresses.find(a => a.status === c.status)?.value,
      typeName: contactTypes[c.type],
      statusName: statuses.find(s => s.id === c.status)?.name,
      sendingDate: c.sendingDate ? format(new Date(c.sendingDate), 'dd/MM/yyyy') : '',
    }
  }).sort((c1, c2) => orderBy === 'id' ? (order === 'desc' ? Number(c2.id) - Number(c1.id) : Number(c1.id) - Number(c2.id)) : 0)
  , [contacts, order, orderBy])
  const data = useMemo(() => {
    if (!search) {
      return extendedContacts
    }
    const options = {
      includeScore: true,
      // useExtendedSearch: true,
      threshold: 0.3,
      keys: ['id', 'name', 'typeName', 'statusName', 'address', 'sendingDate']
    }
    const fuse = new Fuse(extendedContacts, options)
    const result = fuse.search(search)
    return result.map(p => p.item)
  }, [search, extendedContacts])

  const handleSort = (id: string) => {
    setOrderBy(id)
    setOrder(o => o === 'asc' ? 'desc' : 'asc')
  } 
  useEffect(() => {
    setPage(0)
  }, [search])
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handlePrint = () => {
    if (!inputEl.current) return
    print(inputEl.current.innerHTML, labels.print)
  }
  if (!user) {
    return <Navigate to="/login" />
  }
  if (contacts.length === 0) {
    return (
      <>
        <Header pageTitle={labels.contacts} />
        <Button variant="outlined" component={NavLink} to="/main/contact-edit/-1">{labels.add}</Button>
        <Empty title={labels.noData} />
      </>
    )
  }

  return (
    <Page title={labels.contacts}>
      <>
        <Stack direction="row" spacing={2}>
          <TextField
            margin="normal"
            id="search"
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={labels.search}
            sx={{ my: 0, flexGrow: 1 }}
          />

          <Button variant="outlined" size="small" component={NavLink} to="/main/contact-edit/-1">{labels.add}</Button>
          <Button variant="outlined" size="small" onClick={handlePrint}>{labels.print}</Button>
        </Stack>
        <TableContainer>
          <div ref={inputEl}>
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
                  <TableCell 
                    key={e.id} 
                    align={e.align} 
                    sx={{ py: 0 }}
                    sortDirection={orderBy === e.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === e.id}
                      direction={orderBy === e.id ? order : 'asc'}
                      onClick={() => handleSort(e.id)}
                    >
                      {e.label}
                      {orderBy === e.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
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
                      <IconButton aria-label="edit" component={NavLink} to={`/main/contact-edit/${e.id}`}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{e.id}</TableCell>
                    <TableCell>{e.link ? <Link href={e.link} target="_blank">{e.name || labels.link}</Link> : ''}</TableCell>
                    <TableCell>{e.typeName}</TableCell>
                    <TableCell>{e.statusName}</TableCell>
                    <TableCell>{e.address && e.status === 'n' ? <Chip label={e.address} color="error" /> : e.address}</TableCell>
                    <TableCell>{e.sendingDate}</TableCell>
                    <TableCell>{e.newAdvert ? 'X' : ''}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          </div>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100, 200, 300, 400, 500]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </Page>
  );
};

