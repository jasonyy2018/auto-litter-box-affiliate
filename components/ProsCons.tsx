'use client';

import { Check, X } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
  compact?: boolean;
}

export default function ProsCons({ pros, cons, compact = false }: ProsConsProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Pros
          </h4>
          <ul className="space-y-1">
            {pros.slice(0, 3).map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
            <X className="w-5 h-5" />
            Cons
          </h4>
          <ul className="space-y-1">
            {cons.slice(0, 3).map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pros */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h4 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          What We Like
        </h4>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-800">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h4 className="font-bold text-red-800 mb-4 text-lg flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </div>
          What Could Be Better
        </h4>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-800">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
