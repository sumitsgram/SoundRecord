import React, { useState } from "react";
import MicrophoneRecorder from "./MicrophoneRecorder";

const DeepgramTranscriber = () => {
  const [transcription, setTranscription] = useState("");
  const [pastTranscriptions, setPastTranscriptions] = useState([]);

  // Update transcription
  const handleTranscription = (newTranscript) => {
    setTranscription((prev) => prev + " " + newTranscript);
    setPastTranscriptions((prev) => [...prev, newTranscript]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Deepgram Streaming Transcription
      </h1>
      <MicrophoneRecorder onTranscription={handleTranscription} />
      <div className="transcription mt-4">
        <h2 className="text-lg font-semibold">Live Transcription:</h2>
        <p className="bg-gray-100 p-2 rounded">{transcription}</p>
      </div>
      <div className="past-transcriptions mt-4">
        <h2 className="text-lg font-semibold">Past Transcriptions:</h2>
        <ul className="list-disc ml-5">
          {pastTranscriptions.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeepgramTranscriber;
