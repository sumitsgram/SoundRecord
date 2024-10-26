# Audio Transcription App

This application allows users to record audio and transcribe it in real-time using the Deepgram API. The app features a simple user interface for recording audio, handling transcription, and displaying the results.

## Features

- **Record Audio**: Users can start and stop audio recording with a single button.
- **Real-time Transcription**: The app uses the Deepgram API to transcribe audio in streaming mode.
- **Responsive Design**: The UI is designed to be responsive and user-friendly on various devices.
- **Past Transcriptions**: Users can view previously transcribed texts.
- **Error Handling**: The app gracefully handles errors and provides feedback.

## Technologies Used

- **Frontend**: React, Hooks, Tailwind CSS (or Bootstrap)
- **Backend**: Node.js, Express.js, WebSocket
- **Audio Processing**: MediaRecorder API
- **Transcription Service**: Deepgram API

## Installation

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your machine.
- A Deepgram API key (sign up at [Deepgram](https://deepgram.com) to get one).

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/SoundRecord.git
   cd SoundRecord
