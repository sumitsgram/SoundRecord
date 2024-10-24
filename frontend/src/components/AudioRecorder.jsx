import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data); // Collect the audio data
      }
    };

    mediaRecorder.onstop = () => {
      sendAudioToBackend(); // When recording stops, send audio data
    };

    mediaRecorder.start(1000); // Collect audio chunks every second
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop(); // Stop recording
    setIsRecording(false);
  };

  const sendAudioToBackend = () => {
    const socket = new WebSocket("ws://localhost:5000/transcribe");

    socket.onopen = () => {
      console.log("WebSocket connection established");

      audioChunksRef.current.forEach((audioChunk) => {
        socket.send(audioChunk); // Send audio chunks to backend
      });
    };

    socket.onmessage = (event) => {
      setTranscription(event.data); // Update transcription when received from backend
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {isRecording && <p>Recording in progress...</p>}

      <h3>Transcription:</h3>
      <p>{transcription}</p>
    </div>
  );
};

export default AudioRecorder;
