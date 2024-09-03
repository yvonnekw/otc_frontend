import {Column} from "react-table";
import { InvoiceData } from '../../store/types'
import { format } from 'date-fns';

export const COLUMNS:  Column<InvoiceData>[] = [
    {
        Header: 'Invoice Id',
        accessor: 'invoiceId',
    },
    {
        Header: 'user',
        accessor: 'username',
    },
    {
        Header: 'Invoice Date',
        accessor: 'invoiceDate',
        Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy'),
    },
    {
        Header: 'status',
        accessor: 'status',
    },
    {
        Header: 'Total Amount',
        accessor: 'totalAmount',
        //Cell: ({ value }) => `$${value.toFixed(2)}`,
    },
    {
        Header: 'Number of Calls',
        accessor: 'callIds',
        Cell: ({ value }) => Array.isArray(value) ? value.length : 'N/A',
    },

]