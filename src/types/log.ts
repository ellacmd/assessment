export type LogMessage = 'warn' | 'error' | 'trace' | 'debug' | 'info' | '';

export interface Log {
    timestamp: string;
    level: string;
    message: LogMessage;
    trace: string;
    authorId: string;
}

export interface LogFilters {
    
    search?: string;
    startDate?: string;
    endDate?: string;
    message?: LogMessage;
}
