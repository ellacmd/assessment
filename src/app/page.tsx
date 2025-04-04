'use client';
import { useEffect, useMemo, useState } from 'react';
import { Log } from '@/types/log';
import { fetchLogs } from '@/services/logService';
import { PaginationControls } from '@/components/PaginationControls';

const defaultFilters = {
    search: '',
    message: '',
    startDate: '',
    endDate: '',
};

export default function Home() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLogs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortDirection]);

    async function loadLogs() {
        setError(null);
        try {
            const fetchedLogs = await fetchLogs();
            setLogs(fetchedLogs);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to load logs'
            );
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }

    const uniqueMessages = useMemo(() => {
        const messages = new Set<string>();
        logs.forEach((log) => messages.add(log.message));
        return Array.from(messages);
    }, [logs]);

    const filteredLogs = useMemo(() => {
        if (!logs.length) return [];

        return logs.filter((log) => {
            if (filters.message && log.message !== filters.message)
                return false;

            if (filters.search && filters.search.trim()) {
                const searchLowerCase = filters.search.toLowerCase();
                const matchesSearch =
                    log.message.toLowerCase().includes(searchLowerCase) ||
                    log.trace.toLowerCase().includes(searchLowerCase) ||
                    log.authorId.toLowerCase().includes(searchLowerCase) ||
                    log.level.toLowerCase().includes(searchLowerCase);

                if (!matchesSearch) return false;
            }

            const logDate = new Date(log.timestamp).getTime();
            if (
                filters.startDate &&
                logDate < new Date(filters.startDate).getTime()
            )
                return false;
            if (
                filters.endDate &&
                logDate > new Date(filters.endDate).getTime()
            )
                return false;

            return true;
        });
    }, [logs, filters]);

    const sortedAndFilteredLogs = useMemo(() => {
        if (!filteredLogs.length) return [];

        if (sortDirection === null) {
            return filteredLogs;
        }

        return [...filteredLogs].sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [filteredLogs, sortDirection]);

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredLogs.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [sortedAndFilteredLogs, currentPage, itemsPerPage]);

    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters(defaultFilters);
        setCurrentPage(1);
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => {
            if (prev === null) return 'asc';
            if (prev === 'asc') return 'desc';
            return null;
        });
        setCurrentPage(1);
    };

    const handleFilterChange = (updates: Partial<typeof filters>) => {
        setFilters((prev) => {
            const newFilters = {
                ...prev,
                ...updates,
            };

          
            if ('startDate' in updates || 'endDate' in updates) {
                const startDate = newFilters.startDate
                    ? new Date(newFilters.startDate).getTime()
                    : 0;
                const endDate = newFilters.endDate
                    ? new Date(newFilters.endDate).getTime()
                    : Infinity;

          
                if (endDate < startDate) {
                    newFilters.endDate = '';
                }
            }

            return newFilters;
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                    <p className='text-red-700'>{error}</p>
                    <button
                        onClick={loadLogs}
                        className='px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm'>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className='min-h-screen p-4 sm:p-8'>
            <h1 className='text-3xl font-bold mb-8'>Log Viewer</h1>

            <div className='flex gap-4 mb-8 flex-wrap justify-between'>
                <div className='flex gap-4 flex-wrap'>
                    <div className='px-4 py-2 border rounded'>
                        <select
                            className='outline-none capitalize'
                            value={filters.message ?? ''}
                            onChange={(e) => {
                                handleFilterChange({
                                    message: e.target.value,
                                });
                            }}>
                            <option value=''>All Messages</option>
                            {uniqueMessages.map((msg) => (
                                <option key={msg} value={msg}>
                                    {msg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type='text'
                        placeholder='Search logs...'
                        className='px-4 py-2 border rounded'
                        value={filters.search}
                        onChange={(e) =>
                            handleFilterChange({
                                search: e.target.value,
                            })
                        }
                    />

                    <input
                        type='datetime-local'
                        className='px-4 py-2 border rounded'
                        value={filters.startDate}
                        max={
                            filters.endDate ||
                            new Date().toISOString().slice(0, 16)
                        }
                        onChange={(e) =>
                            handleFilterChange({
                                startDate: e.target.value,
                            })
                        }
                    />
                    <input
                        type='datetime-local'
                        className='px-4 py-2 border rounded'
                        value={filters.endDate}
                        min={filters.startDate || undefined}
                        max={new Date().toISOString().slice(0, 16)}
                        onChange={(e) =>
                            handleFilterChange({
                                endDate: e.target.value,
                            })
                        }
                    />
                </div>

                <button
                    className='px-4 py-2 bg-red-50 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200'
                    onClick={handleClearFilters}>
                    Clear filters
                </button>
            </div>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='overflow-x-auto'>
                    {sortedAndFilteredLogs.length > 0 ? (
                        <>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th
                                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 group'
                                            onClick={toggleSortDirection}>
                                            <div className='flex items-center gap-2'>
                                                Timestamp
                                                <span className='text-gray-400'>
                                                    {sortDirection === 'asc'
                                                        ? '↑'
                                                        : sortDirection ===
                                                          'desc'
                                                        ? '↓'
                                                        : '⋮'}
                                                </span>
                                            </div>
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                                            Level
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                                            Message
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                                            Trace
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                                            Author ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {paginatedLogs.map((log, index) => (
                                        <tr
                                            key={index}
                                            className='hover:bg-gray-50'>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {new Date(
                                                    log.timestamp
                                                ).toLocaleString()}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap capitalize'>
                                                <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full '>
                                                    {log.level}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span
                                                    className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        log.message === 'error'
                                                            ? 'bg-red-50 text-red-500'
                                                            : log.message ===
                                                              'warn'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : log.message ===
                                                              'debug'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : log.message ===
                                                              'info'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {log.message}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-900'>
                                                {log.trace}
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-900'>
                                                {log.authorId}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-12 px-4'>
                            <p className='text-gray-500 text-lg mb-2'>
                                No items match your search criteria
                            </p>
                            <p className='text-gray-400 text-sm'>
                                Try adjusting your filters or clear them to see
                                all logs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
