const express = require("express");
const WebSocket = require("ws");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios"); // Import Axios

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// Create an HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Store audio data chunks
  let audioChunks = [];

  // When receiving audio from the client
  ws.on("message", (audioChunk) => {
    console.log("Received audio chunk");
    audioChunks.push(audioChunk); // Store the audio chunks
  });

  // On WebSocket close
  ws.on("close", async () => {
    console.log("WebSocket connection closed");

    // Combine audio chunks into a single audio buffer
    const audioBuffer = Buffer.concat(audioChunks);

    try {
      // Send audio data to Deepgram API for transcription
      const response = await axios({
        method: "POST",
        url: "https://api.deepgram.com/v1/listen",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/wav", // Ensure audio format is correct
        },
        data: audioBuffer, // Send the combined audio buffer
      });

      // Extract transcription from Deepgram response
      const transcription =
        response.data.results.channels[0].alternatives[0].transcript;
      ws.send(transcription); // Send transcription back to the client
    } catch (error) {
      console.error("Deepgram API error:", error);
      ws.send("Error in transcription"); // Notify client of an error
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
