import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-900 text-white dark:bg-white dark:text-slate-950',
    secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
    outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  } as const;

  return <div className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[variant], className)} {...props} />;
}