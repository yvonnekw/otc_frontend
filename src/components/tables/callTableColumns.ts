import { Column } from 'react-table';

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

export const COLUMNS: Column<Call>[] = [
    {
        Header: 'Call Id',
        accessor: 'callId',
    },
    {
        Header: 'Call Date',
        accessor: 'callDate',
    },
    {
        Header: 'Start Time',
        accessor: 'startTime',
    },
    {
        Header: 'End Time',
        accessor: 'endTime',
    },
    {
        Header: 'Duration',
        accessor: 'duration',
    },
    {
        Header: 'Cost Per Second',
        accessor: 'costPerSecond',
    },
    {
        Header: 'Discount',
        accessor: 'discountForCalls',
    },
    {
        Header: 'Call Gross Cost',
        accessor: 'grossCost',
    },
    {
        Header: 'VAT',
        accessor: 'vat',
    },
    {
        Header: 'Net Cost',
        accessor: 'netCost',
    },
    {
        Header: 'Status',
        accessor: 'status',
    },
];
