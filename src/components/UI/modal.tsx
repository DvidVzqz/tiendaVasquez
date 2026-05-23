import type React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
    onClose: () => void;
}

export const BaseModal = ({ open, onClose, ...props }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="max-w-2xl mx-auto bg-gray-900 rounded-3xl shadow-md p-8 z-50" onClick={(e) => e.stopPropagation()} {...props} />
        </div>
    );
};
