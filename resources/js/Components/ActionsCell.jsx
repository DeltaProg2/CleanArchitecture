import React, { useState, useEffect, useRef } from 'react';
import {
  TrashIcon,
  PencilIcon,
  ClipboardCheckIcon
} from '@heroicons/react/outline';

const ActionsCell = ({ value: actions, row: { index }, column: { id } }) => {

  const iconClasses = 'w-10 h-10 text-gray-500 hover:text-gray-700 hover:cursor-pointer'

  return (
    <div
      className="text-center font-medium inline-flex"
    >
      {actions.map((action) => (
        (()=> {
          switch (action.type) {
            case 'edit':
              return <PencilIcon key={action.type} className="w-5 h-5 mx-1 text-indigo-600 hover:text-indigo-900 cursor-pointer"/>;
            case 'delete':
              return <TrashIcon key={action.type} className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer"/>;
            default: return null;
          }
        })()
      //   <button
      //   key={action.name}
      //   type="button"
      //   className={`
      //       inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white
      //       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
      //       ${action.disabled === true
      //   ? 'opacity-30 cursor-not-allowed bg-gray-400'
      //   : action.type === 'delete'
      //   ? 'bg-red-500 hover:bg-red-500'
      //   : 'bg-indigo-500 hover:bg-indigo-700'}
      //     `}
      //   onClick={action.action}
      //   disabled={action.disabled}
      //   >
      // {action.name}
      //   </button>
        ))}
    </div>
  );
};


export default ActionsCell;
