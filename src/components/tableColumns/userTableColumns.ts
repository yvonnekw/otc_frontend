import {Payment, User} from "../../store/types";
import {Column} from "react-table";

export const COLUMNS: Column<User>[] = [
    {
        Header: 'Username'
    },
    {
        Header: 'First Name'
    },
    {
        Header: 'Last Name'
    },
    {
        Header: 'Email Address'
    },
    {
        Header: 'Phone Number'
    }
]