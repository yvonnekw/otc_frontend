
import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { getAllInvoices } from '../../services/InvoiceService';
import { InvoiceData } from '../../store/types';
import { COLUMNS } from '../tableColumns/invoiceTableColumns'; // Import the columns configuration

const AdminInvoiceTable: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching invoices. Please try again.');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Memoize the columns to prevent unnecessary re-renders
  const columns = useMemo(() => COLUMNS, []);

  // Define the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable<InvoiceData>(
      {
        columns,
        data: invoices,
        initialState: { sortBy: [{ id: 'invoiceId', desc: false }] },
      },
      useGlobalFilter, // Hook for global search
      useSortBy // Hook for sorting
  );

  const { globalFilter } = state;

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6">Loading...</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Invoice List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Search Input */}
        <TextField
            label="Search Invoices"
            variant="outlined"
            sx={{ width: '50%', mb: 2 }}
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                        <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                        </TableCell>
                    ))}
                  </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                          <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                      ))}
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default AdminInvoiceTable;



/*
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  CircularProgress,
  TextField
} from '@mui/material';
import { getAllInvoices } from '../../services/InvoiceService';
import { InvoiceData } from '../../store/types';

const AdminInvoiceTable: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('invoiceId');

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching invoices. Please try again.');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: InvoiceData[], orderBy: string, order: 'asc' | 'desc') => {
    return data.slice().sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterData = (data: InvoiceData[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter((invoice) =>
        Object.values(invoice).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const filteredInvoices = filterData(invoices, searchTerm);
  const sortedInvoices = sortData(filteredInvoices, orderBy, order);

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6">Loading...</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Error: {error}</Typography>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Invoice List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Search Input *///}
/*
        <TextField
            label="Search Invoices"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'invoiceId' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'invoiceId'}
                      direction={orderBy === 'invoiceId' ? order : 'asc'}
                      onClick={() => handleRequestSort('invoiceId')}
                  >
                    Invoice ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'invoiceDate' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'invoiceDate'}
                      direction={orderBy === 'invoiceDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('invoiceDate')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'totalAmount' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'totalAmount'}
                      direction={orderBy === 'totalAmount' ? order : 'asc'}
                      onClick={() => handleRequestSort('totalAmount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Calls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                  <React.Fragment key={invoice.invoiceId}>
                    <TableRow>
                      <TableCell>{invoice.invoiceId}</TableCell>
                      <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.totalAmount}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell>
                        {invoice.callIds.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Call ID</TableCell>
                                  <TableCell>Start Time</TableCell>
                                  <TableCell>End Time</TableCell>
                                  <TableCell>Duration</TableCell>
                                  <TableCell>Cost Per Second</TableCell>
                                  <TableCell>Net Cost</TableCell>
                                  <TableCell>Gross Cost</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {invoice.callIds.map((call) => (
                                    <TableRow key={call.callId}>
                                      <TableCell>{call.callId}</TableCell>
                                      <TableCell>{call.startTime}</TableCell>
                                      <TableCell>{call.endTime}</TableCell>
                                      <TableCell>{call.duration}s</TableCell>
                                      <TableCell>{call.costPerSecond}</TableCell>
                                      <TableCell>{call.netCost}</TableCell>
                                      <TableCell>{call.grossCost}</TableCell>
                                    </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        ) : (
                            <Typography>No Calls</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default AdminInvoiceTable;
*/
/*
import React, { useState, useEffect } from 'react';
import { Container, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, CircularProgress } from '@mui/material';
import { getAllInvoices } from '../../services/InvoiceService';
import { InvoiceData } from '../../store/types';

const AdminInvoiceTable: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('invoiceId');

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching invoices. Please try again.');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: InvoiceData[], orderBy: string, order: 'asc' | 'desc') => {
    return data.slice().sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedInvoices = sortData(invoices, orderBy, order);

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6">Loading...</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Error: {error}</Typography>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Invoice List
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'invoiceId' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'invoiceId'}
                      direction={orderBy === 'invoiceId' ? order : 'asc'}
                      onClick={() => handleRequestSort('invoiceId')}
                  >
                    Invoice ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'invoiceDate' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'invoiceDate'}
                      direction={orderBy === 'invoiceDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('invoiceDate')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'totalAmount' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'totalAmount'}
                      direction={orderBy === 'totalAmount' ? order : 'asc'}
                      onClick={() => handleRequestSort('totalAmount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Calls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                  <React.Fragment key={invoice.invoiceId}>
                    <TableRow>
                      <TableCell>{invoice.invoiceId}</TableCell>
                      <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.totalAmount}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell>
                        {invoice.callIds.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Call ID</TableCell>
                                  <TableCell>Start Time</TableCell>
                                  <TableCell>End Time</TableCell>
                                  <TableCell>Duration</TableCell>
                                  <TableCell>Cost Per Second</TableCell>
                                  <TableCell>Net Cost</TableCell>
                                  <TableCell>Gross Cost</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {invoice.callIds.map((call) => (
                                    <TableRow key={call.callId}>
                                      <TableCell>{call.callId}</TableCell>
                                      <TableCell>{call.startTime}</TableCell>
                                      <TableCell>{call.endTime}</TableCell>
                                      <TableCell>{call.duration}s</TableCell>
                                      <TableCell>{call.costPerSecond}</TableCell>
                                      <TableCell>{call.netCost}</TableCell>
                                      <TableCell>{call.grossCost}</TableCell>
                                    </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        ) : (
                            <Typography>No Calls</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default AdminInvoiceTable;
*/

/*
import React, { useState, useEffect } from 'react';
import { Container, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, CircularProgress, Typography as MuiTypography } from '@mui/material';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';

const AdminInvoiceTable: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('invoiceId');

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching invoices. Please try again.');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: InvoiceData[], orderBy: string, order: 'asc' | 'desc') => {
    return data.slice().sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedInvoices = sortData(invoices, orderBy, order);

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress />
          <MuiTypography variant="h6">Loading...</MuiTypography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          <MuiTypography variant="h6" color="error">Error: {error}</MuiTypography>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          AdminInvoiceTable List
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'invoiceId' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'invoiceId'}
                      direction={orderBy === 'invoiceId' ? order : 'asc'}
                      onClick={() => handleRequestSort('invoiceId')}
                  >
                    AdminInvoiceTable ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'date' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'asc'}
                      onClick={() => handleRequestSort('date')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'amount' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'asc'}
                      onClick={() => handleRequestSort('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell>{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell>{invoice.totalAmount}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{invoice.calls}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default AdminInvoiceTable;
*/
/*
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Divider } from '@mui/material';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';
import { AuthContext } from '../auth/AuthProvider';
import CallsTable from '../calls/CallsTable';

interface InvoiceProps { }

const AdminInvoiceTable: React.FC<InvoiceProps> = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  //const userId = localStorage.getItem('userId') ?? '';
  const storedUser = localStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).username : null;
  const role = storedUser ? JSON.parse(storedUser).role : null;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData: InvoiceData[] = await getAllInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  if (role !== 'ADMIN') {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" color="error" align="center">
          You don't have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        AdminInvoiceTable List
      </Typography>
      <Divider sx={{ mb: 2 }} />

    </Container>
  );
};

export default AdminInvoiceTable;
*/
/*

import React, { useState, useEffect, useContext } from 'react';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';
import { AuthContext } from '../auth/AuthProvider';
import CallsTable from '../calls/CallsTable';

interface InvoiceProps {
}

const AdminInvoiceTable: React.FC<InvoiceProps> = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const userId = localStorage.getItem("userId") ?? '';

  const { role } = useContext(AuthContext);

  if (role !== "ADMIN") {
    return <div>You don't have permission to access this page.</div>;
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData: InvoiceData[] = await getAllInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>AdminInvoiceTable List</h2>
    
      <div>
        <CallsTable userId={userId} status="Invoiced" />
      </div>
    </div>
   
  );
};

export default AdminInvoiceTable;

*/