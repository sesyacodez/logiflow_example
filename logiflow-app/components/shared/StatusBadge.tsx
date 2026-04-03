// StatusBadge component — always pairs color with icon and label (accessibility requirement)
'use client';

import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { PRIORITY, PRIORITY_BG, PRIORITY_COLOR, PRIORITY_LABEL } from '@/lib/priority/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  priority: 1 | 2 | 3;
  className?: string;
}

function PriorityIcon({ priority }: { priority: 1 | 2 | 3 }) {
  const cls = 'h-3.5 w-3.5';
  if (priority === PRIORITY.CRITICAL) return <AlertOctagon className={cls} />;
  if (priority === PRIORITY.ELEVATED) return <AlertTriangle className={cls} />;
  return <CheckCircle className={cls} />;
}

export function StatusBadge({ priority, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium',
        PRIORITY_BG[priority],
        PRIORITY_COLOR[priority],
        className
      )}
    >
      <PriorityIcon priority={priority} />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
