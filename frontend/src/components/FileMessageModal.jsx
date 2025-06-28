import React from 'react';
import FileMessage from './File_transfer';

const FileMessageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Shared Files</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Modal Body - FileMessage component with adjusted styling */}
                <div className="overflow-y-auto flex-1">
                    <FileMessage />
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t text-sm text-gray-500 text-center">
                    All files shared in this chat will appear here
                </div>
            </div>
        </div>
    );
};

export default FileMessageModal;