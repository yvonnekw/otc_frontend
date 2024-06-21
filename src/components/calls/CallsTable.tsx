import React, { useEffect, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/callTableColumns';
import TablePagination from '@mui/material/TablePagination';

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  costPerSecond: number;
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
  callDate: string;
  status: string;
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });


  useEffect(() => {
    setTimeout(() => {

      getCallsByUsernameAndStatus(userId, status).then((data) => {
        setCalls(data);
        setLoading(false)
      }).

        catch((error) => {
          setError(error.message)
          setLoading(false)
        });
    },1000)

  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getHeadingText = (status: string) => {
    switch (status) {
      case "Invoiced":
        return "Invoiced Calls";
      case "Pending Invoice":
        return "Current Calls";
      case "Paid":
        return "Paid Calls";
      default:
        return "Call History";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      <br /> <br />
      <h2 className='text-center'>{getHeadingText(status)}</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <div>
          <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={calls.length} 
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default CallsTable;


/*

import React, { useEffect, useRef, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';
import TablePagination from '@mui/material/TablePagination';

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  costPerSecond: number;
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
  callDate: string;
  status: string;
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    setTimeout(() => {
 
      getCallsByUsernameAndStatus(userId, status).then((data) => {
        setCalls(data);
        setLoading(false)
      }).
    
        catch((error) => {
          setError(error.message)
          setLoading(false)
        });
    }, 1000)

  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      <br /> <br />
      <h2 className='text-center'>Call History</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <>
          <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={calls.length} // Replace with total count of calls if available from API
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default CallsTable;
*/
/*
import React, { useEffect, useRef, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  costPerSecond: number; 
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
  callDate: string;
  status: string;
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    const fetchCalls = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController();
      setLoading(true)
      try {
    
        const response = await getCallsByUsernameAndStatus(userId, status);
        {
          signal: abortControllerRef.current?.signal
        }
        //const rsp = (await response) as Call[];
        setCalls(response);
      } catch (error) {
      //  if(error.name === "AbortError"){
            //console.log("Aborted")
            //return
       // }
        
       // setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [userId, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  //if (error) {
   //return <div>Error: {error.message}</div>;
 // }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
    
      <br /> <br />
      <h2 className='text-center'>Call History</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          {loading}
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CallsTable;

*/
/*

import React, { useEffect, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation, useParams } from 'react-router-dom';
import { useTable } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  costPerSecond: number;
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
  callDate: string;
  status: string;
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const location = useLocation();
  const message = location.state && location.state.message;
  const columns = React.useMemo(() => COLUMNS, []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  console.log("get calls by user id ", userId)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getCallsByUsernameAndStatus(userId, status);
        setCalls(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [userId, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
/*
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getCallsByUsernameAndStatus(userId, status!);
        setCalls(response);
        console.log("get calls by user id ", response)
      } catch (error) {
        console.error(error);
      }
    };
    fetchCalls();
  }, [userId, status]);

  */
/*
  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
      <br /> <br />
        <h2 className='text-center'>Call History</h2>
        {calls && calls.length === 0 ? (
          <p>No calls to display.</p>
        ) : (
          <table className="table table-striped table-bordered" id="callTable">
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Call Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Cost Per Second</th>
                <th>Discount</th>
                <th>Call Gross cost</th>
                <th>VAT</th>
                <th>Net Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {calls && calls.map((call) => (
                <tr key={call.id}>
                  <td>{call.callId}</td>
                  <td>{call.callDate}</td>
                  <td>{call.startTime}</td>
                  <td>{call.endTime}</td>
                  <td>{call.duration}</td>
                  <td>{call.costPerSecond}</td>
                  <td>{call.discountForCalls}</td>
                  <td>{call.grossCost}</td>
                  <td>{call.vat}</td>
                  <td>{call.netCost}</td>
                  <td>{call.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  );
//};

//export default CallsTable;
*/