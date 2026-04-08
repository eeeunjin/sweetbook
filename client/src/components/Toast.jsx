import { useEffect, useState } from 'react';
import CheckIcon from '../assets/icons/check.svg';

let toastHandler = null;

export function showToast(message, type = 'success') {
  if (toastHandler) toastHandler(message, type);
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastHandler = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    return () => { toastHandler = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-heavy text-sm font-medium text-white transition-all animate-fade-in ${
            t.type === 'error' ? 'bg-red-400' : 'bg-espresso'
          }`}
        >
          {t.type !== 'error' && <img src={CheckIcon} className="w-4 h-4 brightness-0 invert" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
