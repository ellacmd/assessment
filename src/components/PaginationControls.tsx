interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: PaginationControlsProps) {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='flex flex-col gap-4 px-4 py-3 border-t sm:flex-row sm:items-center sm:justify-between'>
         
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
                <p className='text-sm text-gray-700 whitespace-nowrap'>
                    <span className='hidden sm:inline'>Showing </span>
                    <span className='font-medium'>
                        {Math.min(
                            (currentPage - 1) * itemsPerPage + 1,
                            totalItems
                        )}
                    </span>
                    {' - '}
                    <span className='font-medium'>
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>
                    <span className='hidden sm:inline'> of </span>
                    <span className='sm:hidden'>/</span>
                    <span className='font-medium'>{totalItems}</span>
                </p>

                <div className='flex items-center gap-2'>
                    <label
                        htmlFor='itemsPerPage'
                        className='text-sm text-gray-700 whitespace-nowrap'>
                        Items per page:
                    </label>
                    <div className='px-2 py-1 border rounded text-sm'>
                        <select
                            id='itemsPerPage'
                            value={itemsPerPage}
                            onChange={(e) =>
                                onItemsPerPageChange(Number(e.target.value))
                            }
                            className='outline-none'>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

       
            <div className='flex  gap-1 sm:gap-2'>
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className='hidden sm:block px-3 py-1 rounded border disabled:opacity-50'>
                    First
                </button>
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1 rounded border disabled:opacity-50'>
                    Previous
                </button>

             
                <div className='hidden sm:flex gap-1'>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 rounded border ${
                                currentPage === number
                                    ? 'bg-gray-200'
                                    : 'hover:bg-gray-50'
                            }`}>
                            {number}
                        </button>
                    ))}
                </div>

           
                <span className='sm:hidden px-3 py-1'>
                    {currentPage} / {totalPages}
                </span>

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 rounded border disabled:opacity-50'>
                    Next
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className='hidden sm:block px-3 py-1 rounded border disabled:opacity-50'>
                    Last
                </button>
            </div>
        </div>
    );
}
