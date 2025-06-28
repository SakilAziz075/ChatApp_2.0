import React, { useEffect, useState } from "react";
import { getSocket } from '../services/socket';

const FileTransfer = ({ receiverEmail, senderEmail, onFileSent }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [fileMessages, setFileMessages] = useState([]);
    const [fileBuffer, setFileBuffer] = useState(new Map()); // To store file chunks

    const socket = getSocket();
    const CHUNK_SIZE = 64 * 1024; // 64 KB

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload file in chunks
    const uploadFileInChunks = (file) => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const senderEmail = localStorage.getItem('email');
        let offset = 0;

        const readChunk = () => {
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            const reader = new FileReader();

            reader.onload = () => {
                const isLastChunk = offset + CHUNK_SIZE >= file.size;

                // Send chunk to server
                socket.emit('file_upload', {
                    senderEmail,
                    receiverEmail,
                    fileName: file.name,
                    chunk: reader.result,
                    isLastChunk,
                    fileSize: file.size
                });

                offset += CHUNK_SIZE;
                setUploadProgress(Math.min(((offset / file.size) * 100).toFixed(2), 100));

                if (!isLastChunk) {
                    readChunk();
                }

                else {
                    setIsUploading(false);
                    console.log("File upload completed");

                    // Notify receiver about the file message
                    socket.emit('file_message', {
                        senderEmail,
                        receiverEmail,
                        fileName: file.name,
                        fileSize: (file.size / 1024).toFixed(2) + " KB" // Convert to KB
                    });

                    if (onFileSent) {
                        onFileSent(file.name, (file.size / 1024).toFixed(2) + " KB");
                    }
                }
            };

            reader.readAsArrayBuffer(chunk);
        };

        readChunk();
    };

    // Handle file upload trigger
    const handleFileUpload = () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        uploadFileInChunks(selectedFile);

        setFileMessages(prevMessages => [
            ...prevMessages,
            {
                sender_id: senderEmail,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                fileData: null,
                fileType: selectedFile.type,

            }])
    };

    // Handle file download
    const handleFileDownload = (file) => {
        const blob = new Blob([file.fileData], { type: file.fileType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };



    // Listen for file transfer updates from server
    useEffect(() => {
        // Listen for file chunk and buffer the file
        socket.on('file_chunk', (data) => {
            const { senderEmail, fileName, chunk, isLastChunk } = data;

            // Store chunks of the file in a buffer
            const currentFileBuffer = fileBuffer.get(fileName) || [];
            currentFileBuffer.push(chunk);
            setFileBuffer(prevBuffer => new Map(prevBuffer.set(fileName, currentFileBuffer)));

            if (isLastChunk) {
                // Once all chunks are received, reassemble the file and allow downloading
                const completeFile = new Blob(currentFileBuffer);
                setFileMessages(prevMessages => [
                    ...prevMessages,
                    { senderEmail, fileName, fileData: completeFile, fileType: chunk.type }
                ]);
            }
        });

        // Clean up socket listeners
        return () => {
            socket.off("file_chunk");
        };
    }, [socket, fileBuffer]);


    return (
        <div className="file-transfer mt-4">
            <div className="file-upload">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2"
                />

                <button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-2">
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>

                {isUploading && (
                    <div className="mt-2">
                        <progress value={uploadProgress} max="100" className="w-full"></progress>
                        <span>{uploadProgress}%</span>
                    </div>
                )}
            </div>

            <div className="messages flex-1 overflow-y-auto p-4">
                {fileMessages.length > 0 ? (
                    fileMessages.map((file, index) => (
                        <div key={index} className={`my-2 ${file.sender_id === localStorage.getItem('email') ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-3 rounded-lg ${file.sender_id === localStorage.getItem('email') ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                {file.fileName ? (
                                    <div>
                                        📁 <strong>{file.sender_id === localStorage.getItem('email') ? 'You' : file.senderEmail}</strong> sent a file
                                        <br/>
                                        <p>{file.fileName}</p>
                                        <button
                                            onClick={() => handleFileDownload(file)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 ">
                                            Download
                                        </button>
                                    </div>
                                ) : (
                                    file.message
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No Files yet.</div>
                )}
            </div>



        </div>
    );
};

export default FileTransfer;
