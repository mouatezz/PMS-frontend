import React, { useState, useEffect } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const ROLE_COLORS = {
  admin: '#ef4444',
  staff: '#10b981',
  receptionist: '#f59e0b',
  guest: '#3b82f6'
};

function UserRolesChart({ users }) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Update width on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const isSmallScreen = windowWidth < 1024;

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
      <ResponsiveContainer width="100%" height={isSmallScreen ? 320 : 300}>
        <PieChart>
          <Pie
            data={data}
            nameKey="role"
            dataKey="value"
            innerRadius={isSmallScreen ? 50 : 70}
            outerRadius={isSmallScreen ? 80 : 120}
            cx={isSmallScreen ? "50%" : "40%"}
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
            align={isSmallScreen ? "center" : "right"}
            verticalAlign={isSmallScreen ? "bottom" : "middle"}
            width={isSmallScreen ? "100%" : "30%"}
            layout={isSmallScreen ? "horizontal" : "vertical"}
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