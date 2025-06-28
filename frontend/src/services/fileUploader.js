const CHUNK_SIZE = 64 * 1024; // 64KB

export const uploadFileInChunks = ({ socket, file, receiverEmail, onProgress, onComplete }) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const senderEmail = localStorage.getItem('email');
  let offset = 0;

  const readChunk = () => {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const reader = new FileReader();

    reader.onload = () => {
      const isLastChunk = offset + CHUNK_SIZE >= file.size;

      socket.emit('file_upload', {
        senderEmail,
        receiverEmail,
        fileName: file.name,
        chunk: reader.result,
        isLastChunk,
        fileSize: file.size
      });

      offset += CHUNK_SIZE;
      onProgress && onProgress(Math.min(((offset / file.size) * 100).toFixed(2), 100));

      if (!isLastChunk) {
        readChunk();
      } else {
        socket.emit('file_message', {
          senderEmail,
          receiverEmail,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(2) + " KB"
        });

        onComplete && onComplete(file.name, (file.size / 1024).toFixed(2) + " KB");
      }
    };

    reader.readAsArrayBuffer(chunk);
  };

  readChunk();
};
