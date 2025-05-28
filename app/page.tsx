"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react"

export default function S3FileUploader() {
  const [presignedUrl, setPresignedUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0])
      setError("")
      setUploadComplete(false)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      setFile(selectedFiles[0])
      setError("")
      setUploadComplete(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const uploadFile = async () => {
    if (!file || !presignedUrl) {
      setError("Please provide both a file and a presigned URL")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      // Validate URL format
      new URL(presignedUrl)
    } catch {
      setError("Invalid presigned URL format")
      setUploading(false)
      return
    }

    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100
        setUploadProgress(Math.round(percentComplete))
      }
    })

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadComplete(true)
        setUploading(false)
        setUploadProgress(100)
      } else {
        setError(`Upload failed with status: ${xhr.status}`)
        setUploading(false)
      }
    })

    // Handle errors
    xhr.addEventListener("error", () => {
      setError("Upload failed. Please check your presigned URL and try again.")
      setUploading(false)
    })

    // Handle abort
    xhr.addEventListener("abort", () => {
      setError("Upload was cancelled")
      setUploading(false)
    })

    // Start the upload
    xhr.open("PUT", presignedUrl)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.send(file)
  }

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadComplete(false)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6" />
              S3 File Uploader
            </CardTitle>
            <CardDescription>
              Upload large files to S3 using a presigned URL. Perfect for files several GB in size.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Presigned URL Input */}
            <div className="space-y-2">
              <Label htmlFor="presigned-url">Presigned URL</Label>
              <Input
                id="presigned-url"
                type="url"
                placeholder="https://your-bucket.s3.amazonaws.com/..."
                value={presignedUrl}
                onChange={(e) => setPresignedUrl(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>File Upload</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <File className="w-12 h-12 mx-auto text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {!uploading && (
                      <Button variant="outline" size="sm" onClick={resetUpload} className="mt-2">
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Drop your file here</p>
                      <p className="text-gray-500">or click to browse</p>
                    </div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Success Message */}
            {uploadComplete && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">File uploaded successfully!</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Upload Button */}
            <Button
              onClick={uploadFile}
              disabled={!file || !presignedUrl || uploading || uploadComplete}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading... {uploadProgress}%
                </>
              ) : uploadComplete ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Upload Complete
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>

            {/* Instructions */}
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Paste your S3 presigned URL in the field above</li>
                <li>Drag and drop a file or click to browse and select one</li>
                <li>Click "Upload File" to start the upload process</li>
                <li>Monitor the progress bar during upload</li>
              </ol>
              <p className="text-xs text-gray-500 mt-4">
                This uploader supports files of any size and provides real-time upload progress. Make sure your
                presigned URL is valid and hasn't expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
