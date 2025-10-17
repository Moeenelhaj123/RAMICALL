import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    open, 
    onClose, 
    title, 
    children, 
    width = '500px', 
    closable = true, 
    maskClosable = true,
    className = '',
    footer
  }, ref) => {
    // Close on escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={maskClosable ? onClose : undefined}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            ref={ref}
            className={[
              'relative w-full bg-white rounded-lg shadow-xl transform transition-all duration-300',
              'flex flex-col max-h-[90vh]',
              className
            ].join(' ')}
            style={{ maxWidth: width }}
          >
            {/* Header */}
            {(title || closable) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                {title && (
                  <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                  </h2>
                )}
                {closable && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors duration-200"
                  >
                    <span className="sr-only">Close</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-slate-200">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';