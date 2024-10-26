import React, { useState, useRef, useEffect } from "react";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [pastTranscriptions, setPastTranscriptions] = useState([]);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Load past transcriptions from localStorage when the component mounts
    const savedTranscriptions =
      JSON.parse(localStorage.getItem("transcriptions")) || [];
    setPastTranscriptions(savedTranscriptions);
  }, []);

  const saveTranscription = (newTranscript) => {
    // Save the transcription to localStorage and update the state
    const updatedTranscriptions = [...pastTranscriptions, newTranscript];
    localStorage.setItem(
      "transcriptions",
      JSON.stringify(updatedTranscriptions)
    );
    setPastTranscriptions(updatedTranscriptions);
  };

  const startRecording = async () => {
    try {
      socketRef.current = new WebSocket("wss://api.deepgram.com/v1/listen", [
        "token",
        "fd04e238691ff4c6bb890e202e7921c90c99836a",
      ]);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      socketRef.current.onopen = () => {
        console.log("Connected to Deepgram API");

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          if (
            event.data.size > 0 &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            socketRef.current.send(event.data);
          }
        });

        mediaRecorderRef.current.start(250);
        setIsRecording(true);
      };

      socketRef.current.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const newTranscript = received.channel.alternatives[0].transcript;
        setTranscript((prev) => prev + " " + newTranscript);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsRecording(false);

    if (transcript) {
      saveTranscription(transcript);
      setTranscript("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        Real-Time Transcription
      </h1>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
            isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={startRecording}
          disabled={isRecording}>
          Start Recording
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
            !isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          onClick={stopRecording}
          disabled={!isRecording}>
          Stop Recording
        </button>
      </div>

      <div className="w-3/4 p-6 bg-white rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Current Transcription:
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {transcript || "Your transcription will appear here..."}
        </p>
      </div>

      <div className="w-3/4 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Past Transcriptions:
        </h2>
        {pastTranscriptions.length > 0 ? (
          <ul className="space-y-3">
            {pastTranscriptions.map((text, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                {text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-500">No transcriptions saved yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
