'use client';

import React from 'react';

export interface ChartSelectorOption {
  key: string;
  label: string;
  value: number;
}

interface ChartSelectorProps {
  options: ChartSelectorOption[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

export function ChartSelector({
  options,
  activeKey,
  onSelect,
  className = ''
}: ChartSelectorProps) {
  return (
    <div className={`flex ${className}`}>
      {options.map((option) => (
        <button
          key={option.key}
          data-active={activeKey === option.key}
          className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
          onClick={() => onSelect(option.key)}
        >
          <span className='text-muted-foreground text-xs'>{option.label}</span>
          <span className='text-lg leading-none font-bold sm:text-3xl'>
            {option.value.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
}
