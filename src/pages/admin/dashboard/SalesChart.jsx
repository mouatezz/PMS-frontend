
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
import { parseISO, format } from 'date-fns';

function SalesChart({ payments }) {
  const colors = {
    stayCharges: { stroke: '#f59e0b' },
    serviceCharges: { stroke: '#9C27B0' },
    text: '#e5e7eb',
    background: '#18212f',
  };

  // Process payments data
  const processedData = payments.reduce((acc, payment) => {
    const date = parseISO(payment.date);
    const formattedDate = format(date, 'MMM dd');
    
    // Find or create an entry for this date
    let existingEntry = acc.find(entry => entry.label === formattedDate);
    if (!existingEntry) {
      existingEntry = { 
        label: formattedDate, 
        stayCharges: 0, 
        serviceCharges: 0 
      };
      acc.push(existingEntry);
    }

    // Add charges based on payment type
    if (payment.type.trim() === 'stay') {
      existingEntry.stayCharges += parseFloat(payment.amount);
    } else if (payment.type.trim() === 'service') {
      existingEntry.serviceCharges += parseFloat(payment.amount);
    }

    return acc;
  }, []);

  // Sort the data by date
  processedData.sort((a, b) => {
    const dateA = new Date(a.label);
    const dateB = new Date(b.label);
    return dateA - dateB;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 col-span-full">
      <h2 className="text-white text-xl font-semibold mb-4">
        Incomes 
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={processedData}>
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
            unit={'DA'}
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
            dataKey="stayCharges"
            stroke={colors.stayCharges.stroke}
            fill="transparent"
            strokeWidth={2}
            name="Stay charges"
            unit={'DA'}
          />
          <Area
            type="monotone"
            dataKey="serviceCharges"
            stroke={colors.serviceCharges.stroke}
            fill="transparent"

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