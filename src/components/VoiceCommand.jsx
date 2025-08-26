"use client";

import React, { useState, useRef } from "react";

export default function VoiceCommand() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      setResponse("");
      transcriptRef.current = "";
    };

    recognitionRef.current.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setTranscript(text);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = async () => {
      setIsRecording(false);

      if (!transcriptRef.current.trim()) return;

      try {
        const res = await fetch("/api/nlp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcriptRef.current }),
        });

        const data = await res.json();
        const reply = data.reply || "No response";

        setResponse(reply);

        // Optional: Speak the response
        const utterance = new SpeechSynthesisUtterance(reply);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("API error:", err);
        setResponse("Error contacting API");
      }
    };

    recognitionRef.current.start();
  };

  return (
    <div className="p-4">
      <button
        onClick={startRecognition}
        className={`px-4 py-2 rounded-lg text-white ${
          isRecording ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {isRecording ? "Listening..." : "Start Speaking"}
      </button>

      <div className="mt-4">
        <h2 className="font-bold">You said:</h2>
        <p>{transcript || "..."}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-bold">Response:</h2>
        <p>{response || "Waiting..."}</p>
      </div>
    </div>
  );
}
