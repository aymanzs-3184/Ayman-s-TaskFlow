import { useState } from 'react';

// Stripe reflects STATUS — changes when card moves columns
const statusStripe = {
  todo:       'bg-blue-400',
  inprogress: 'bg-amber-400',
  done:       'bg-green-500',
};

// Dot reflects PRIORITY — set when task is created, doesn't change
const priorityDot = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-green-400',
};

// Avatar colour per assignee
const avatarColor = {
  Ayman: 'bg-indigo-500',
  Sara:  'bg-pink-500',
};

export default function TaskCard({ title, assigneeName, priority, status }) {

  return (
    <div className={`
      group bg-white rounded-lg border overflow-hidden
      shadow-sm hover:shadow-md
      hover:-translate-y-0.5 hover:border-indigo-200
      transition-all duration-200 cursor-pointer
    `}>

      {/* Stripe — colour based on which column the card is in */}
      <div className={`h-1 w-full ${statusStripe[status] || 'bg-gray-300'}`} />

      <div className="p-3">

        {/* Title + priority dot */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className={`text-sm font-medium leading-snug flex-1`}>
            {title}
          </p>
          {/* Priority dot — stays the same regardless of column */}
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0
            ${priorityDot[priority] || 'bg-gray-300'}`}
          />
        </div>

        {/* Footer — avatar + done button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assigneeName ? (
              <>
                <div className={`w-6 h-6 rounded-full text-xs font-bold
                  text-white flex items-center justify-center flex-shrink-0
                  ${avatarColor[assigneeName] || 'bg-gray-400'}`}>
                  {assigneeName[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-400">{assigneeName}</span>
              </>
            ) : (
              <span className="text-xs text-gray-300">Unassigned</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}