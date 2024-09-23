export const SET_USER = 'SET_USER';
export const SET_CALLS = 'SET_CALLS';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';


export interface User {
    userId: number;
    username?: string;
    password: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephone: string | null;
    authorities: Authority[];
    address: string | null;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}

export interface UserUsername extends User{
    username: string;
}


export interface Call {
    callId?: number;
    startTime?: string;
    endTime?: string;
    duration?: string;
    costPerSecond?: string;
    discountForCalls?: string;
    vat?: string;
    netCost?: string;
    grossCost?: string;
    callDate?: string;
    status?: string;
    user?: User;
    receiver?: Receiver;
}

export interface UserCall extends Omit<Call, 'startTime' | 'endTime' | 'discountForCalls'> {
    startTime: string;
    endTime: string;
    discountForCalls: string;
    username: string | null;
    telephone: string;
}


export interface Receiver {
    callReceiverId: number;
    telephone: string;
    fullName: string;
    relationship: string;
    user: User;
}


export interface ReceiverSubset extends Receiver{
    telephone: string;
}

export interface InvoiceData {
    invoiceId: string;
    invoiceDate: string; // ISO date string or Date object
    totalAmount: number;
    status: string;
    callIds: string;
    username?: string;
}

export interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    fullNameOnPaymentCard: string;
    cardNumber: string;
    expiringDate: string;
    issueNumber: string;
    securityNumber: string;
    status: string;
    invoiceId: string;
    username?: string;
}
export interface EnterCallResponse {
    data: Call;
}

export interface Authority {
    roleId: number;
    authority: string;
}


export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string;
}


export interface CallsState {
    calls: Call[];
}

export interface MessageState {
    successMessage?: string;
    errorMessage: string;
}

export type ActionTypes =
    | SetUserAction
    | SetCallsAction
    | SetErrorMessageAction
    | SetSuccessMessageAction;

interface SetUserAction {
    type: typeof SET_USER;
    payload: User;
}

interface SetCallsAction {
    type: typeof SET_CALLS;
    payload: Call[];
}

interface SetErrorMessageAction {
    type: typeof SET_ERROR_MESSAGE;
    payload: string;
}

interface SetSuccessMessageAction {
    type: typeof SET_SUCCESS_MESSAGE;
    payload: string;
}

