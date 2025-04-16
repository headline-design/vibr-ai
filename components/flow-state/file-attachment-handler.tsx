"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, File, Image, FileText, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileInfo {
  name: string
  size: number
  type: string
  url: string
}

interface FileAttachmentHandlerProps {
  onClose: () => void
  onFileAttached: (fileInfo: FileInfo) => void
}

export function FileAttachmentHandler({ onClose, onFileAttached }: FileAttachmentHandlerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = () => {
    if (selectedFile) {
      const fileInfo: FileInfo = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: previewUrl || "",
      }

      onFileAttached(fileInfo)
    }
  }

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-12 w-12 text-gray-400" />

    if (selectedFile.type.startsWith("image/")) {
      return <Image className="h-12 w-12 text-blue-500" />
    } else if (selectedFile.type.includes("pdf") || selectedFile.type.includes("document")) {
      return <FileText className="h-12 w-12 text-red-500" />
    } else if (selectedFile.type.includes("json") || selectedFile.name.match(/\.(js|ts|py|html|css|jsx|tsx)$/)) {
      return <Code className="h-12 w-12 text-green-500" />
    } else {
      return <File className="h-12 w-12 text-yellow-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">Attach File</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
              selectedFile ? "py-4" : "py-10",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleChange} />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-32 rounded" />
                  ) : (
                    getFileIcon()
                  )}
                </div>
                <div>
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleButtonClick}>
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">Drag and drop a file here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse files</p>
                </div>
                <Button variant="outline" onClick={handleButtonClick}>
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedFile}>
              Attach
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
