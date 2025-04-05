'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './DatePicker.css';

const SingleDatePicker = dynamic(
    () => import('react-dates').then((mod) => mod.SingleDatePicker),
    { ssr: false }
);

interface DatePickerProps {
    date: string;
    onDateChange: (date: string) => void;
    placeholder?: string;
    id: string;
    minDate?: string;
    maxDate?: string;
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = 'Select date',
    id,
    minDate,
    maxDate,
}: DatePickerProps) {
    const [focused, setFocused] = useState(false);

    return (
        <div className='date-picker-container pl-4 py-2 border rounded'>
            <SingleDatePicker
                date={date ? moment(date) : null}
                onDateChange={(newDate) =>
                    onDateChange(newDate ? newDate.format('YYYY-MM-DD') : '')
                }
                focused={focused}
                onFocusChange={({ focused: isFocused }) =>
                    setFocused(isFocused)
                }
                id={id}
                placeholder={placeholder}
                numberOfMonths={1}
                isOutsideRange={(currentDate) => {
                    if (maxDate && currentDate.isAfter(moment(maxDate)))
                        return true;
                    if (minDate && currentDate.isBefore(moment(minDate)))
                        return true;
                    return false;
                }}
                showClearDate={true}
                small={true}
                displayFormat='DD/MM/YYYY'
                readOnly
                customInputIcon={null}
                noBorder
                block
            />
       
        </div>
    );
}
