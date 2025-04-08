"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, File, Image, X, Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  onCancel: () => void
  maxSize?: number // in MB
  allowedTypes?: string[]
  multiple?: boolean
  className?: string
}

export function FileUpload({
  onFileSelect,
  onCancel,
  maxSize = 10,
  allowedTypes = ["image/*", "application/pdf", "text/*"],
  multiple = true,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: File[] = []
    const newErrors: string[] = []

    Array.from(selectedFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        newErrors.push(`${file.name} exceeds the maximum size of ${maxSize}MB`)
        return
      }

      // Check file type
      const fileType = file.type || ""
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const category = type.split("/")[0]
          return fileType.startsWith(`${category}/`)
        }
        return type === fileType
      })

      if (!isAllowed) {
        newErrors.push(`${file.name} is not an allowed file type`)
        return
      }

      newFiles.push(file)
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles])

      // Initialize progress for each file
      const newProgress: Record<string, number> = {}
      newFiles.forEach((file) => {
        newProgress[file.name] = 0
      })
      setUploadProgress((prev) => ({ ...prev, ...newProgress }))
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  // Remove a file
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
    setUploadProgress({})
    setErrors([])
    onCancel()
  }

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    // Simulate upload progress for each file
    const uploadPromises = files.map((file) => {
      return new Promise<void>((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            resolve()
          }
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: Math.min(progress, 100),
          }))
        }, 300)
      })
    })

    await Promise.all(uploadPromises)

    // In a real app, you would send the files to your server here
    // and handle the response

    // Notify parent component
    onFileSelect(files)

    // Reset state
    setIsUploading(false)
    setFiles([])
    setUploadProgress({})
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div
      className={cn("p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", className)}
    >
      {/* Drag and drop area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging
            ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600",
          files.length > 0 && "hidden",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Drag and drop files here, or{" "}
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
            onClick={handleFileInputClick}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">Max file size: {maxSize}MB</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={allowedTypes.join(",")}
          onChange={handleFileInputChange}
        />
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 mt-2"
          >
            <div className="text-sm font-medium mb-2">Selected files:</div>
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {getFileIcon(file)}
                  <div className="truncate">
                    <div className="text-sm truncate">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                    <div className="w-16">
                      <Progress value={uploadProgress[file.name]} className="h-1" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    onClick={() => removeFile(file.name)}
                    disabled={isUploading}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-1">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={clearFiles} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={uploadFiles}
                disabled={isUploading || files.length === 0}
                className="flex items-center"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    <span>Upload</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
