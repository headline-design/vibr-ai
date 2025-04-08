"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Import the SpeechRecognitionService
import { SpeechRecognitionService } from "@/utils/speech-recognition"

interface VoiceInputEnhancedProps {
  onClose: () => void
  onTranscript: (transcript: string) => void
}

export function VoiceInputEnhanced({ onClose, onTranscript }: VoiceInputEnhancedProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(50).fill(5))
  const recognitionRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize speech recognition
  // Replace the existing useEffect for speech recognition with:
  useEffect(() => {
    const speechRecognition = new SpeechRecognitionService({
      onStatusChange: (status) => {
        setIsListening(status === "listening");
        if (status === "error") {
          setErrorMessage("Speech recognition error occurred");
        }
      },
      onResult: (transcript: string, isFinal: boolean) => {
        setTranscript(transcript);
      },
      onError: (error) => {
        console.error(error);
        setErrorMessage(error);
        setIsListening(false);
      },
    });

    recognitionRef.current = speechRecognition

    return () => {
      stopListening()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Start/stop listening
  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Update the startListening function:
  const startListening = async () => {
    setErrorMessage(null)

    try {
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }

      // Set up audio visualizer
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 128

        const bufferLength = analyserRef.current.frequencyBinCount
        dataArrayRef.current = new Uint8Array(bufferLength)

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const source = audioContextRef.current.createMediaStreamSource(stream)
          source.connect(analyserRef.current)

          // Start visualization
          visualize()
        } catch (err) {
          console.error("Error accessing microphone", err)
          // Continue with speech recognition even if visualizer fails
        }
      } else {
        visualize()
      }
    } catch (err) {
      console.error("Error starting voice input", err)
      setErrorMessage("Could not access microphone")
      setIsListening(false)
    }
  }

  // Update the stopListening function:
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const visualize = () => {
    if (!analyserRef.current || !dataArrayRef.current) return

    const updateVisualizer = () => {
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!)

      // Use the frequency data to create visualizer bars
      const data = Array.from(dataArrayRef.current!).slice(0, 50)
      const normalized = data.map((value) => Math.max(5, Math.min(100, value / 2.55))) // Scale to 0-100
      setVisualizerData(normalized)

      animationFrameRef.current = requestAnimationFrame(updateVisualizer)
    }

    animationFrameRef.current = requestAnimationFrame(updateVisualizer)
  }

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
  }

  const handleClear = () => {
    setTranscript("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">Voice Input</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded text-sm">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 min-h-[100px] p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
            {transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {isListening ? "Listening..." : "Press the microphone button and start speaking"}
              </p>
            )}
          </div>

          {/* Audio Visualizer */}
          <div className="mb-4 h-12 flex items-end justify-center space-x-1">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className={cn("w-1 rounded-t", isListening ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700")}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Button variant="outline" onClick={handleClear} disabled={!transcript}>
                Clear
              </Button>
              <Button variant="outline" onClick={handleSubmit} disabled={!transcript}>
                Submit
              </Button>
            </div>

            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
