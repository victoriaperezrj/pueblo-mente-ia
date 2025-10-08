import { useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

export function useCustomToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const closeToast = () => setToast(null);

  const ToastComponent = toast && (
    <div className="fixed top-4 right-4 z-50 animate-slideDown">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-hard backdrop-blur-sm min-w-[300px]
        ${toast.type === 'success' ? 'bg-enterprise-50 border-2 border-enterprise-500' : ''}
        ${toast.type === 'error' ? 'bg-red-50 border-2 border-red-500' : ''}
        ${toast.type === 'info' ? 'bg-business-50 border-2 border-business-500' : ''}
      `}>
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-enterprise-600 flex-shrink-0" />}
        {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-business-600 flex-shrink-0" />}
        
        <span className={`
          text-sm font-medium flex-1
          ${toast.type === 'success' ? 'text-enterprise-800' : ''}
          ${toast.type === 'error' ? 'text-red-800' : ''}
          ${toast.type === 'info' ? 'text-business-800' : ''}
        `}>
          {toast.message}
        </span>
        
        <button
          onClick={closeToast}
          className="opacity-60 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return { showToast, closeToast, ToastComponent };
}
