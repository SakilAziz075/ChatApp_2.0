import React, { useEffect, useState } from "react";
import { getSocket } from "../services/socket";
import { uploadFileInChunks } from "../services/fileUploader";

const FileTransfer = ({ receiverEmail, senderEmail, onFileSent }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileMessages, setFileMessages] = useState([]);
  const [fileBuffer, setFileBuffer] = useState(new Map());

  const socket = getSocket();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    uploadFileInChunks({
      socket,
      file: selectedFile,
      receiverEmail,
      onProgress: (progress) => setUploadProgress(progress),
      onComplete: (fileName, fileSize) => {
        setIsUploading(false);
        onFileSent && onFileSent(fileName, fileSize);
        setFileMessages((prev) => [
          ...prev,
          {
            sender_id: senderEmail,
            fileName,
            fileSize,
          },
        ]);
      },
    });
  };

  const handleFileDownload = (file) => {
    const blob = new Blob([file.fileData], { type: file.fileType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    socket.on("file_chunk", (data) => {
      const { senderEmail, fileName, chunk, isLastChunk } = data;

      const currentFileBuffer = fileBuffer.get(fileName) || [];
      currentFileBuffer.push(chunk);
      setFileBuffer((prev) => new Map(prev.set(fileName, currentFileBuffer)));

      if (isLastChunk) {
        const completeFile = new Blob(currentFileBuffer);
        setFileMessages((prev) => [
          ...prev,
          { senderEmail, fileName, fileData: completeFile, fileType: chunk.type },
        ]);
      }
    });

    return () => {
      socket.off("file_chunk");
    };
  }, [socket, fileBuffer]);

  return (
    <div className="file-transfer mt-4">
      <div className="file-upload mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || isUploading}
          className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-2"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
        {isUploading && (
          <div className="mt-2">
            <progress value={uploadProgress} max="100" className="w-full"></progress>
            <span>{uploadProgress}%</span>
          </div>
        )}
      </div>

      <div className="messages space-y-3">
        {fileMessages.length > 0 ? (
          fileMessages.map((file, index) => (
            <div
              key={index}
              className={`flex ${file.sender_id === senderEmail ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  file.sender_id === senderEmail ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
              >
                <p className="font-semibold mb-1">📁 {file.fileName}</p>
                <button
                  onClick={() => handleFileDownload(file)}
                  className="bg-white text-sm text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No files yet.</p>
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
