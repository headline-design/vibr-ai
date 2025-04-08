interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: any) => void
  onStatusChange?: (status: "listening" | "error" | "idle") => void
}

// Declare SpeechRecognition interface
declare var SpeechRecognition: any
declare var webkitSpeechRecognition: any

export class SpeechRecognitionService {
  private recognition: typeof SpeechRecognition | null = null
  private isListening = false
  private transcript = ""
  private options: SpeechRecognitionOptions

  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      continuous: true,
      interimResults: true,
      lang: "en-US",
      ...options,
    }

    // Check if browser supports speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.setupRecognition()
      } else {
        console.error("Speech recognition not supported in this browser")
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    const { continuous, interimResults, lang, onResult, onStart, onEnd, onError } = this.options

    this.recognition.continuous = continuous || false
    this.recognition.interimResults = interimResults || false
    this.recognition.lang = lang || "en-US"

    this.recognition.onstart = () => {
      this.isListening = true
      if (onStart) onStart()
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (onEnd) onEnd()
    }

    this.recognition.onerror = (event) => {
      if (onError) onError(event)
    }

    this.recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      this.transcript = finalTranscript || interimTranscript

      if (onResult) {
        onResult(this.transcript, !!finalTranscript)
      }
    }
  }

  public start() {
    if (!this.recognition) {
      console.error("Speech recognition not supported")
      return
    }

    if (!this.isListening) {
      this.transcript = ""
      this.recognition.start()
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
    return this.transcript
  }

  public abort() {
    if (this.recognition && this.isListening) {
      this.recognition.abort()
    }
  }

  public isSupported(): boolean {
    return !!this.recognition
  }

  public getTranscript(): string {
    return this.transcript
  }
}

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
