import React from 'react';

function Stat({ icon, title, value, color }) {
  const colorVariants = {
    blue: {
      bg: 'bg-blue-600/10',
      text: 'text-blue-600',
      icon: 'bg-blue-600'
    },
    green: {
      bg: 'bg-green-600/10',
      text: 'text-green-600',
      icon: 'bg-green-600'
    },
    purple: {
      bg: 'bg-purple-600/10',
      text: 'text-purple-600',
      icon: 'bg-purple-600'
    },
    amber: {
      bg: 'bg-amber-600/10',
      text: 'text-amber-600',
      icon: 'bg-amber-600'
    }
  };

  const variant = colorVariants[color] || colorVariants.blue;

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg">
      <div className={`
        ${variant.bg} 
        ${variant.text}
        rounded-full 
        w-12 h-12 
        flex items-center justify-center
      `}>
        {React.cloneElement(icon, { 
          className: `w-6 h-6 ${variant.text}` 
        })}
      </div>
      <div>
        <div className="text-gray-400 text-xs uppercase tracking-wider">
          {title}
        </div>
        <div className="text-2xl font-semibold text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

export default Stat;