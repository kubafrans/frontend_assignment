import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Data {
  product_id: number;
  product_name: string;
  product_price: number;
  in_stock: number;
}

interface TableProps {
  selectedOption: 'Products' | 'Clothes';
}

const headCells: readonly HeadCell[] = [
  {
    id: 'product_id',
    numeric: true,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'product_name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'product_price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'in_stock',
    numeric: true,
    disablePadding: false,
    label: 'In Stock',
  },
];

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc'
                    ? 'sorted descending'
                    : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  onAddClick: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { onAddClick } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onAddClick}
      >
        Add Product
      </Button>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const CustomTable: React.FC<TableProps> = ({ selectedOption }) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof Data>('product_price');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [editRow, setEditRow] = React.useState<Data | null>(null);
  const [newRow, setNewRow] = React.useState<Data | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  React.useEffect(() => {
    const endpoint =
      selectedOption === 'Products' ? 'products' : 'clothes';
    fetch(`http://localhost:3001/${endpoint}`)
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [selectedOption]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (row: Data) => {
    setEditRow(row);
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editRow) {
      setEditRow({
        ...editRow,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEditSubmit = () => {
    if (editRow) {
      // Update the row in the state
      setRows(
        rows.map((row) =>
          row.product_id === editRow.product_id ? editRow : row
        )
      );

      // Send the updated data to the server
      const endpoint =
        selectedOption === 'Products' ? 'products' : 'clothes';
      fetch(
        `http://localhost:3001/${endpoint}/${editRow.product_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editRow),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setSnackbarMessage('Item updated successfully');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Error:', error);
          setSnackbarMessage('Error updating item');
          setSnackbarOpen(true);
        });

      setEditRow(null);
    }
  };

  const handleEditCancel = () => {
    setEditRow(null);
  };

  const handleAddClick = () => {
    setNewRow({
      product_id: rows.length + 1,
      product_name: '',
      product_price: 0,
      in_stock: 0,
    });
  };

  const handleNewChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (newRow) {
      setNewRow({
        ...newRow,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleNewSubmit = () => {
    if (newRow) {
      // Add the new row to the state
      setRows([...rows, newRow]);

      // Send the new data to the server
      const endpoint =
        selectedOption === 'Products' ? 'products' : 'clothes';
      fetch(`http://localhost:3001/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })
        .then((response) => response.json())
        .then((data) => {
          setSnackbarMessage('Item added successfully');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Error:', error);
          setSnackbarMessage('Error adding item');
          setSnackbarOpen(true);
        });

      setNewRow(null);
    }
  };

  const handleNewCancel = () => {
    setNewRow(null);
  };

  const handleRemoveClick = (product_id: number) => {
    // Remove the row from the state
    setRows(rows.filter((row) => row.product_id !== product_id));

    // Send the delete request to the server
    const endpoint =
      selectedOption === 'Products' ? 'products' : 'clothes';
    fetch(`http://localhost:3001/${endpoint}/${product_id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage('Item removed successfully');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSnackbarMessage('Error removing item');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
      : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar onAddClick={handleAddClick} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.product_id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.product_id}
                    </TableCell>
                    <TableCell align="left">
                      {row.product_name}
                    </TableCell>
                    <TableCell align="right">
                      {row.product_price}
                    </TableCell>
                    <TableCell align="right">
                      {row.in_stock}
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleEditClick(row)}>
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          handleRemoveClick(row.product_id)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        open={!!editRow}
        onClose={handleEditCancel}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography
            id="edit-modal-title"
            variant="h6"
            component="h2"
          >
            Edit Item
          </Typography>
          {editRow && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="product_name"
                value={editRow.product_name}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price"
                name="product_price"
                type="number"
                value={editRow.product_price}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="In Stock"
                name="in_stock"
                type="number"
                value={editRow.in_stock}
                onChange={handleEditChange}
              />
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSubmit}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      <Modal
        open={!!newRow}
        onClose={handleNewCancel}
        aria-labelledby="new-modal-title"
        aria-describedby="new-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography
            id="new-modal-title"
            variant="h6"
            component="h2"
          >
            Add Item
          </Typography>
          {newRow && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="product_name"
                value={newRow.product_name}
                onChange={handleNewChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price"
                name="product_price"
                type="number"
                value={newRow.product_price}
                onChange={handleNewChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="In Stock"
                name="in_stock"
                type="number"
                value={newRow.in_stock}
                onChange={handleNewChange}
              />
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewSubmit}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleNewCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default CustomTable;
