import {Column} from "react-table";
import { Payment } from '../../store/types'

export const COLUMNS: Column<Payment>[] = [
    {
        Header: 'Payment Id',
        accessor: 'paymentId',
    },
    {
        Header: 'username',
        accessor: 'username',
    },
    {
        Header: 'Payment Date',
        accessor: 'paymentDate',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
        Header: 'status',
        accessor: 'status',
    },
    {
        Header: 'Total Amount',
        accessor: 'amount',
    },
    {
        Header: 'invoice',
        accessor: 'invoiceId',
    },
]