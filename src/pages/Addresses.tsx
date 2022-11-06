import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid';
import labels from '../utils/labels.json'
import useStore from '../utils/store';
import { Navigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Button from '@mui/material/Button';
import { deleteAddress } from '../utils/actions';
import { statuses } from '../utils/config';

const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 90 },
  { 
    field: 'contactId', 
    headerName: labels.contactId, 
    width: 90 
  },
  {
    field: 'value',
    headerName: labels.value,
    width: 300,
  },
  {
    field: 'status',
    headerName: labels.status,
    width: 100,
  },
  {
    field: 'contact',
    headerName:  labels.contact,
    width: 300,
  },
];

type Params = {
  id: string
}
export default function DataGridDemo() {
  const params = useParams<Params>()
  const user = useStore((state) => state.user)
  const contacts = useStore((state) => state.contacts)
  const error = useStore((state) => state.error)
  const [selectedId, setSelectedId] = useState<GridRowId | undefined>(undefined)
  const addresses = useMemo(() => contacts.flatMap(c => c.addresses.map(a => ({
    contactId: c.id,
    value: a.value,
    status: a.status
  }))), [contacts])
  const data = useMemo(() => addresses.filter(a => params.id === '0' || a.contactId === params.id)
                                    .map(a => {
                                      const contact = contacts.find(c => c.id === a.contactId)?.name
                                      return {
                                        id: a.value,
                                        contactId: a.contactId,
                                        value: a.value,
                                        status: statuses.find(s => s.id === a.status)?.name,
                                        contact
                                      }
                                    }).sort((a1, a2) => Number(a2.contactId) - Number(a1.contactId))
  , [addresses, contacts, params.id])
  const handleDelete = () => {
    try {
      if (!selectedId) return
      if (addresses.find(a => a.value === selectedId.toString())?.status === 's') return
      deleteAddress(selectedId.toString(), addresses, contacts)
    } catch (err: any) {
      error(err.message)
    }
  }
  if (!user) {
    return <Navigate to="/login" />
  }
  return (
    <>
      <Header pageTitle={labels.addresses} />
        {selectedId && <Button onClick={handleDelete}>{labels.delete}</Button>}
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[100]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          onSelectionModelChange={selected => {
            setSelectedId(selected.at(-1))
          }}
          selectionModel={selectedId}
          autoHeight
        />
      </Box>
    </>
  );
}
