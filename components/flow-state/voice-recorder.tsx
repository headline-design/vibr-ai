"use client"

import { useState, useEffect, useRef, JSX } from "react"
import { X, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SpeechRecognitionService } from "@/utils/speech-recognition"

interface VoiceRecorderProps {
  onRecordingComplete: (transcript: string) => void
  onCancel: () => void
  className?: string
}

export function VoiceRecorder({ onRecordingComplete, onCancel, className }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"inactive" | "listening" | "processing">("inactive")

  const recognitionRef = useRef<SpeechRecognitionService | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = new SpeechRecognitionService({
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        setTranscript(text)
      },
      onError: (error) => {
        console.error("Speech recognition error:", error)
        setError(error)
        stopRecording()
      },
    })

    return () => {
      stopRecording()
    }
  }, [])

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  // Audio visualization
  useEffect(() => {
    if (isRecording && microphoneStreamRef.current && analyserRef.current) {
      const analyseAudio = () => {
        if (!analyserRef.current) return

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Calculate average level
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
        setAudioLevel(average / 255) // Scale to 0-1

        if (isRecording) {
          requestAnimationFrame(analyseAudio)
        }
      }

      analyseAudio()
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      // Get microphone access for visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream

      // Set up audio analysis
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsRecording(true)
        setError(null)
        setStatus("listening")
      }
    } catch (err) {
      console.error("Error starting voice recording", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Stop audio visualization
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
    setStatus("inactive")
  }

  const handleCancel = () => {
    stopRecording()
    onCancel()
  }

  const handleSubmit = () => {
    setStatus("processing")
    stopRecording()
    onRecordingComplete(transcript)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Generate waveform bars
  const generateWaveform = () => {
    const bars: JSX.Element[] = []
    const barCount = 30

    for (let i = 0; i < barCount; i++) {
      // Create a random but smooth pattern that's influenced by audioLevel
      const randomFactor = Math.sin(i * 0.5 + Date.now() * 0.002) * 0.5 + 0.5
      const height = isRecording ? Math.max(0.1, audioLevel * randomFactor * 100) : Math.random() * 20 + 5

      bars.push(
        <div
          key={i}
          className="bg-blue-500 rounded-full w-1"
          style={{
            height: `${height}%`,
            opacity: isRecording ? 0.7 + audioLevel * 0.3 : 0.5,
            transition: "height 0.1s ease-in-out",
          }}
        />,
      )
    }

    return bars
  }

  return (
    <div
      className={cn("p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800", className)}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("h-3 w-3 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300")} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {status === "listening" ? "Listening..." : status === "processing" ? "Processing..." : "Voice Input"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{formatTime(recordingTime)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleCancel}
              aria-label="Cancel recording"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Transcript display */}
        <div className="mb-3 min-h-[60px] p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
          {transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {status === "listening" ? "Speak now..." : "Press the microphone button to start"}
            </p>
          )}
        </div>

        {/* Audio Visualizer */}
        <div className="mb-3 h-10 flex items-end justify-center space-x-0.5">
          <div className="flex-1 h-full flex items-center justify-between">{generateWaveform()}</div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleSubmit} disabled={!transcript || status === "processing"}>
            Send
          </Button>

          <Button
            onClick={startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            className={isRecording ? "animate-pulse" : ""}
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                {status === "inactive" ? "Start" : "Restart"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
