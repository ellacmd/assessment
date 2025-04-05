'use client';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.css';

interface DatePickerProps {
    date: string;
    onDateChange: (date: string) => void;
    id: string;
    minDate?: string;
    maxDate?: string;
    isStartDate?: boolean;
}

export function CustomDatePicker({
    date,
    onDateChange,
    minDate,
    maxDate,
    isStartDate = false,
}: DatePickerProps) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className='date-picker-container px-4 py-2 border rounded'>
            <DatePicker
                value={date ? new Date(date) : null}
                onChange={(value: Date | null | [Date | null, Date | null]) => {
                    if (value instanceof Date) {
                        const localDate = new Date(
                            value.getFullYear(),
                            value.getMonth(),
                            value.getDate(),
                            12
                        );
                        onDateChange(formatDate(localDate));
                    } else {
                        onDateChange('');
                    }
                }}
                format='dd/MM/y'
                clearIcon={null}
                calendarIcon={null}
                minDate={minDate ? new Date(minDate) : undefined}
                maxDate={
                    isStartDate
                        ? today
                        : maxDate
                        ? new Date(maxDate)
                        : undefined
                }
                dayPlaceholder='dd'
                monthPlaceholder='mm'
                yearPlaceholder='yyyy'
                className='custom-datepicker'
            />
        </div>
    );
}
