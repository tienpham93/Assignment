
export type GetElementOptions = {
    timeout?: number;
    retry?: {
        maxRetry: number;
        interval: number;
    }
}

export type RowValue = {
    [title: string]: string;
}

export type Payload = {
    username?: string;
    dateOfBirth?: string;
    gender?: string;
    subscribedMarketing?: any;
}

export type FilterOptionsByNumericValue = {
    columnName: string;
    condition: {
        matchValue?: string;
        greaterThan?: string;
        lessThan?: string;
    }
}

export type FilterOptionsByTextValue = {
    columnName: string;
    condition: {
        matchValue?: string;
        contains?: string;
        notContains?: string;
    }
}

export type ClickOptions = {
    timeout?: number;
    force?: boolean;
    delay?: number;
}

export type EnterTextOptions = {
    timeout?: number;
    force?: boolean;
    clearText?: boolean;
    delay?: number;
}