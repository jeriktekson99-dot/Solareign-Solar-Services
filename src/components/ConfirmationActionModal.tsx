import React from 'react';
import { X, Loader2 } from 'lucide-react';

export type ConfirmationActionType = 'archive' | 'delete' | 'recovery';

export interface ConfirmationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: ConfirmationActionType;
  recordCode?: string;
  customEyebrow?: string;
  customTitle?: string;
  customMessage?: React.ReactNode;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  isProcessing?: boolean;
}

export default function ConfirmationActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  recordCode,
  customEyebrow,
  customTitle,
  customMessage,
  confirmButtonLabel = 'YES, CONFIRM ACTION',
  cancelButtonLabel = 'CANCEL',
  isProcessing = false
}: ConfirmationActionModalProps) {
  if (!isOpen) return null;

  // Default header labels based on action type
  const getEyebrow = () => {
    if (customEyebrow) return customEyebrow;
    switch (actionType) {
      case 'archive':
        return 'SYSTEM ARCHIVE CONFIRMATION';
      case 'delete':
        return 'SYSTEM DELETION CONFIRMATION';
      case 'recovery':
        return 'SYSTEM RECOVERY CONFIRMATION';
    }
  };

  const getTitle = () => {
    if (customTitle) return customTitle;
    switch (actionType) {
      case 'archive':
        return 'CONFIRM ARCHIVE ACTION';
      case 'delete':
        return 'CONFIRM DELETION ACTION';
      case 'recovery':
        return 'CONFIRM RECOVERY ACTION';
    }
  };

  const getDefaultMessage = () => {
    const displayCode = recordCode ? ` ${recordCode}` : '';
    switch (actionType) {
      case 'archive':
        return `Are you sure you want to move record${displayCode} to the Archive/Trash?`;
      case 'delete':
        return `Are you sure you want to permanently delete record${displayCode} from the system? This action cannot be undone.`;
      case 'recovery':
        return `Are you sure you want to recover record${displayCode} and restore it to the active stream?`;
    }
  };

  const isRecovery = actionType === 'recovery';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Section (Dark Green Header with Eyebrow and Main Title) */}
        <div className="bg-[#0F5A29] px-6 py-5 sm:px-8 sm:py-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <p className="text-[11px] font-black tracking-widest uppercase text-[#88D628] mb-1">
            {getEyebrow()}
          </p>
          <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
            {getTitle()}
          </h3>
        </div>

        {/* Brand Accent Divider Line */}
        <div className="h-1 w-full bg-[#88D628]" />

        {/* Middle Body Section */}
        <div className="px-6 py-6 sm:px-8 sm:py-7 bg-white">
          <div className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {customMessage || getDefaultMessage()}
          </div>
        </div>

        {/* Footer / Action Placement */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 sm:px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelButtonLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
              isRecovery
                ? 'bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] border border-[#0F5A29]'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            } disabled:opacity-50`}
          >
            {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
