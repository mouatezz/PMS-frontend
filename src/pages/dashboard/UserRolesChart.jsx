import React from 'react';
import { 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

// Predefined color mapping for roles in dark mode
const ROLE_COLORS = {
  admin: '#ef4444',     // Red for admin
  staff: '#10b981',     // Green for staff
  receptionist: '#f59e0b', // Amber for receptionist
  guest: '#3b82f6'      // Blue for guest
};

function UserRolesChart({ users }) {
  // Prepare data by counting users in each role
  const prepareRoleData = (users) => {
    const roleCounts = users.reduce((acc, user) => {
      const role = user.role.toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCounts).map(([role, value]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize first letter
      value,
      color: ROLE_COLORS[role] || '#4d7c0f' // Default color if role not found
    }));
  };

  const data = prepareRoleData(users);

  return (
    <div className="
      bg-gray-800 
      border border-gray-700 
      rounded-md 
      p-6 
      grid-column-start-3 
      grid-column-end-5
    ">
      <h2 className="text-xl font-semibold text-white mb-4">
        User Roles Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            nameKey="role"
            dataKey="value"
            innerRadius={80}
            outerRadius={120}
            cx="40%"
            cy="50%"
            paddingAngle={2}
            labelStyle={{ fill: 'white' }}
          >
            {data.map(entry => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.role}
              />
            ))}
          </Pie>
          <Legend
            align="right"
            verticalAlign="middle"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
            color="white"
            payload={data.map(entry => ({
              value: entry.role,
              type: 'circle',
              color: entry.color
            }))}
            formatter={(value) => <span className="text-white">{value}</span>}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              borderColor: '#374151',
              color: 'white'
            }}
            itemStyle={{ color: 'white' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserRolesChart;