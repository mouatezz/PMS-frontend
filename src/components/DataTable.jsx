import React from 'react';
import { ArrowUpDown, Trash2 } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    onDelete,
    emptyMessage = "No data found matching your search criteria",
}) => {
   // Calculate total columns, including delete column if applicable
   const totalColumns = onDelete ? columns.length + 1 : columns.length;

   return (
     <div className="overflow-x-auto">
       <table className="w-full">
         <thead>
           <tr className="text-left border-b border-gray-700">
             {columns.map((column, index) => (
               <th
                  key={index}
                  className={`pb-2 font-medium text-gray-400 ${column.className || ''}`}
               >
                 <div className="flex items-center">
                   {column.header}
                   {column.sortable && <ArrowUpDown className="ml-1 h-4 w-4" />}
                 </div>
               </th>
             ))}
             {onDelete && (
               <th className="pb-2 font-medium text-gray-400 text-right">Actions</th>
             )}
           </tr>
         </thead>
         <tbody>
           {data.map((item, rowIndex) => (
             <tr key={rowIndex} className="border-b border-gray-700">
               {columns.map((column, colIndex) => (
                 <td
                    key={`${rowIndex}-${colIndex}`}
                    className={`py-3 ${column.cellClassName || ''}`}
                 >
                   {column.renderCell ? column.renderCell(item) : item[column.key]}
                 </td>
               ))}
               {onDelete && (
                 <td className="py-3 text-white text-right">
                   <button
                      onClick={() => onDelete(item.username)}
                      className="p-1 text-red-400 hover:text-red-500 hover:bg-gray-700 rounded-full"
                   >
                     <Trash2 className="h-5 w-5" />
                   </button>
                 </td>
               )}
             </tr>
           ))}
           {data.length === 0 && (
             <tr>
               <td
                  colSpan={totalColumns}
                  className="py-4 text-center text-gray-400"
               >
                 {emptyMessage}
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   );
};

export default DataTable;