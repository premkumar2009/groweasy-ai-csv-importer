import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

export function Switch({ checked, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
        checked ? 'bg-slate-900 dark:bg-white' : 'bg-slate-300 dark:bg-slate-700',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-slate-950',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}