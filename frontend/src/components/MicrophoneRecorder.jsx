import React, { useState } from "react";

const MicrophoneRecorder = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  // Start/Stop recording
  const handleRecording = () => {
    if (isRecording) {
      mediaRecorder.stop(); // Stop recording
    } else {
      // Get user microphone access
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start();

        recorder.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };

        // Stop and send data to backend
        recorder.onstop = () => {
          sendAudioToBackend();
        };

        setMediaRecorder(recorder);
      });
    }
    setIsRecording(!isRecording);
  };

  // Send recorded audio to the backend for transcription
 const sendAudioToBackend = () => {
   const socket = new WebSocket("ws://localhost:5000");

   socket.onopen = () => {
     console.log("WebSocket connection established");
     audioChunks.forEach((chunk) => {
       socket.send(chunk); // Send audio data to backend
     });
   };

   socket.onmessage = (message) => {
     const transcript = message.data;
     if (transcript) {
       onTranscription(transcript); // Pass transcription to parent
     }
   };

   socket.onerror = (error) => {
     console.error("WebSocket error:", error);
   };

   socket.onclose = () => {
     console.log("WebSocket connection closed.");
   };
 };


  return (
    <div>
      <button
        onClick={handleRecording}
        className="bg-blue-500 text-white p-2 rounded">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default MicrophoneRecorder;
