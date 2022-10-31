import { useState } from 'react';

import { Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

import CalendarList from '@/components/list/CalendarList';

export default function Calendar() {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
        <Stack spacing="xl">
            <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select date"
                inputFormat="YYYY-MM-DD"
            />
            <CalendarList selectedDate={date} />
        </Stack>
    );
}
