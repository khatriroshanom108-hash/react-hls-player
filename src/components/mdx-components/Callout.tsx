import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: ReactNode;
}

const styles = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    icon: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
  },
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
};

export function Callout({ type, title, children }: CalloutProps) {
  const style = styles[type];
  const Icon = icons[type];

  return (
    <div
      className={`my-6 rounded-lg border-l-4 ${style.bg} ${style.border} p-4`}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${style.icon}`} />
        <div className={`flex-1 ${style.text}`}>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
