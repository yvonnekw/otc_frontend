import { Call } from '../../store/types'
import {GridColDef} from "@mui/x-data-grid";


export const COLUMNS: GridColDef<Call>[]  = [
    {
        headerName: 'Call Id',
        field: 'callId',
    },
    {
        headerName: 'Call Date',
        field: 'callDate',
    },
    {
        headerName: 'Start Time',
        field: 'startTime',
    },
    {
        headerName: 'End Time',
        field: 'endTime',
    },
    {
        headerName: 'Duration',
        field: 'duration',
    },
    {
        headerName: 'Cost Per Second',
        field: 'costPerSecond',
    },
    {
        headerName: 'Discount',
        field: 'discountForCalls',
    },
    {
        headerName: 'Call Gross Cost',
        field: 'grossCost',
    },
    {
        headerName: 'VAT',
        field: 'vat',
    },
    {
        headerName: 'Net Cost',
        field: 'netCost',
    },
    {
        headerName: 'Status',
        field: 'status',
    },
];
