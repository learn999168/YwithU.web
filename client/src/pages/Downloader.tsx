import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
}

const VIDEO_FORMATS = {
  mp4: [
    { label: "360p", value: "mp4-360p", size: "~50MB" },
    { label: "720p", value: "mp4-720p", size: "~150MB" },
    { label: "1080p", value: "mp4-1080p", size: "~300MB" },
    { label: "4K", value: "mp4-4k", size: "~800MB" },
  ],
  mp3: [
    { label: "64 kbps", value: "mp3-64kbps", size: "~2.5MB" },
    { label: "128 kbps", value: "mp3-128kbps", size: "~5MB" },
    { label: "192 kbps", value: "mp3-192kbps", size: "~7.5MB" },
    { label: "256 kbps", value: "mp3-256kbps", size: "~10MB" },
    { label: "320 kbps", value: "mp3-320kbps", size: "~12.5MB" },
  ],
};

export default function Downloader() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4-720p");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<"mp4" | "mp3">("mp4");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    if (url) {
      setUrlInput(decodeURIComponent(url));
    }
  }, []);

  const handleFetchMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoMetadata(null);

    try {
      // Mock metadata extraction - in production, this would call a real API
      // For now, we'll simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockMetadata: VideoMetadata = {
        id: "dQw4w9WgXcQ",
        title: "Sample Video Title",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: 213,
        author: "Sample Channel",
      };

      setVideoMetadata(mockMetadata);
    } catch (err) {
      setError("Failed to fetch video metadata. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format: string) => {
    if (!videoMetadata) return;

    setIsLoading(true);
    try {
      // Mock download - in production, this would trigger the actual download
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log download to history if user is logged in
      if (user) {
        // This would call a tRPC mutation to save download history
        console.log("Download logged:", { videoUrl: urlInput, format });
      }

      // Simulate download
      alert(`Download started: ${videoMetadata.title} (${format})`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* URL Input Section */}
        <Card className="p-6 mb-8 border-0 bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">Download YouTube Video</h2>
          <form onSubmit={handleFetchMetadata} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 h-12 border-2 border-red-600"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 h-12"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
              </Button>
            </div>
            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </Card>

        {/* Video Metadata Section */}
        {videoMetadata && (
          <Card className="p-6 mb-8 border-0 bg-white shadow-sm">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Thumbnail */}
              <div className="md:col-span-1">
                <img
                  src={videoMetadata.thumbnail}
                  alt={videoMetadata.title}
                  className="w-full rounded-lg object-cover aspect-video"
                />
              </div>

              {/* Metadata */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {videoMetadata.title}
                </h3>
                <p className="text-foreground/70 mb-4">
                  By <span className="font-semibold">{videoMetadata.author}</span>
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">
                      {formatDuration(videoMetadata.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Video ID</p>
                    <p className="font-semibold text-foreground font-mono">
                      {videoMetadata.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Format Selection Section */}
        {videoMetadata && (
          <Card className="p-6 border-0 bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Select Download Format</h2>

            {/* Format Type Tabs */}
            <div className="flex gap-4 mb-6 border-b border-border">
              <button
                onClick={() => {
                  setFormatType("mp4");
                  setSelectedFormat("mp4-720p");
                }}
                className={`pb-3 font-semibold transition-colors ${
                  formatType === "mp4"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                MP4 Video
              </button>
              <button
                onClick={() => {
                  setFormatType("mp3");
                  setSelectedFormat("mp3-320kbps");
                }}
                className={`pb-3 font-semibold transition-colors ${
                  formatType === "mp3"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                MP3 Audio
              </button>
            </div>

            {/* Format Options Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {VIDEO_FORMATS[formatType].map((format) => (
                <div
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFormat === format.value
                      ? "border-red-600 bg-red-50"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{format.label}</h4>
                      <p className="text-sm text-muted-foreground">{format.size}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedFormat === format.value
                          ? "bg-red-600 border-red-600"
                          : "border-border"
                      }`}
                    >
                      {selectedFormat === format.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <Button
              onClick={() => handleDownload(selectedFormat)}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-semibold text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Your download will start automatically. If it doesn't, please check your browser settings.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
