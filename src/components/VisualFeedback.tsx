import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface VisualFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  show: boolean;
}

export function VisualFeedback({ type, message, show }: VisualFeedbackProps) {
  if (!show) return null;

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-100 text-green-700 border-green-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${colors[type]} border rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 max-w-md`}
    >
      <Icon className="w-5 h-5" />
      <p className="text-sm">{message}</p>
    </motion.div>
  );
}
