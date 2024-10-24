import { render, fireEvent, screen } from "@testing-library/react";
import MicrophoneRecorder from "../components/MicrophoneRecorder";

test("Microphone button toggles recording state", () => {
  const { getByText } = render(
    <MicrophoneRecorder onTranscription={() => {}} />
  );
  const button = getByText("Start Recording");

  fireEvent.click(button);
  expect(button.textContent).toBe("Stop Recording");

  fireEvent.click(button);
  expect(button.textContent).toBe("Start Recording");
});
