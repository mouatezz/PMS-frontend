import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

function SalesChart({ bookings, numDays }) {
  const colors = {
    totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
    extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
    text: '#e5e7eb',
    background: '#18212f',
  };

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map(date => {
    const label = format(date, 'MMM dd');
    const sameDays = bookings.filter(booking =>
      isSameDay(booking.created_at, date)
    );
    const totalSales = sameDays.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    const extrasSales = sameDays.reduce(
      (acc, booking) => acc + booking.extrasPrice,
      0
    );
    return {
      label,
      totalSales,
      extrasSales,
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 col-span-full">
      <h2 className="text-white text-xl font-semibold mb-4">
        Incomes from {format(allDates.at(0), 'MMM dd yyyy')} —{' '}
        {format(allDates.at(-1), 'MMM dd yyyy')}
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(55, 65, 81)" 
            className="opacity-20"
          />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit={'$'}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors.background,
              color: colors.text,
              borderRadius: '0.5rem',
              border: 'none'
            }} 
          />
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Stay charges"
            unit={'DA'}
          />
          <Area
            type="monotone"
            dataKey="extrasSales"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Service charges"
            unit={'DA'}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;