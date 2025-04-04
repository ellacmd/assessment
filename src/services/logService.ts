import { Log, LogMessage } from '@/types/log';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_BASE64 || '';
const API_URL = '/api/logs';
const RAW_KEY = process.env.NEXT_PUBLIC_RAW_KEY || '';

export async function fetchLogs(): Promise<Log[]> {
    const decodedApiKey = atob(API_KEY);

    try {
        const response = await fetch(API_URL, {
            headers: {
                'x-log-key': decodedApiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data: string[] = await response.json();
        return data.map(parseLogLine);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Failed to fetch logs'
        );
    }
}

function parseLogLine(line: string): Log {
    const [timestamp, level, message, trace, authorId] = line.split('|=|');

    return {
        timestamp,
        level,
        message: message.toLowerCase() as LogMessage,
        trace,
        authorId,
    };
}
