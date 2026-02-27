import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Download, Music, Zap, Shield, Smartphone, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [urlInput, setUrlInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setLocation(`/downloader?url=${encodeURIComponent(urlInput)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setLocation("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">Y2mate</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/account")}
                  className="text-foreground"
                >
                  {user.name || user.email}
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await logout();
                    setLocation("/");
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white border-b border-border pt-16 pb-20 px-4 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Y2mate - YouTube Downloader
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Download YouTube videos and audio in multiple formats. Fast, free, and no installation required.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleUrlSubmit} className="mb-8">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 h-12 border-2 border-red-600 rounded-md focus:border-red-700"
              />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 h-12 rounded-md font-semibold"
              >
                Download
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              By using our service you are accepting our <a href="#" className="text-red-600 hover:underline">Terms of Use</a>.
            </p>
          </form>

          {/* Search Form */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Or search for videos</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search YouTube videos..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 h-12 border border-border rounded-md"
              />
              <Button
                type="submit"
                variant="outline"
                className="px-6 h-12"
                disabled={isSearching}
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white flex-1">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Download Video and Audio from YouTube
          </h2>
          <p className="text-foreground/80 mb-4 leading-relaxed">
            Y2mate is a popular free YouTube video downloader that allows users to easily convert and download videos from YouTube, Facebook, TikTok, Instagram, and more in high quality. We offer various video and audio formats such as MP4, MP3, M4V, FLV, AVI, 3GP, WEBM, WMV, and more. Download videos in 360p, 720p, 1080p, and even 4K quality without installing any software or applications.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Y2mate is a reliable, user-friendly, and completely free online YouTube downloader tool that makes it easy to convert and download YouTube videos in MP3 and MP4 formats. No registration required. Y2mate works seamlessly on all browsers and devices such as your computer, mobile, tablet, and other devices.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted flex-1">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose Y2mate?</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Download className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">Free Unlimited Downloads</h3>
              <p className="text-foreground/70 text-center">
                Download unlimited YouTube videos and audio files completely free. No restrictions on how many files you can download.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">Easy to Use</h3>
              <p className="text-foreground/70 text-center">
                Simple and intuitive interface. Just paste a YouTube URL and choose your format. No software installation needed.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Music className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">Multiple Formats</h3>
              <p className="text-foreground/70 text-center">
                Download in MP4 (360p-4K), MP3 (64-320kbps), and many other formats. Choose the quality you need.
              </p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">Very Fast</h3>
              <p className="text-foreground/70 text-center">
                Lightning-fast download speeds. Convert and download videos without long waiting times.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">No Installation</h3>
              <p className="text-foreground/70 text-center">
                Completely web-based. Use directly in your browser without installing any software or extensions.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-white">
              <div className="flex justify-center mb-4">
                <Smartphone className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 text-center">All Devices</h3>
              <p className="text-foreground/70 text-center">
                Works on smartphones, tablets, computers, and all popular browsers. Fully responsive design.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 px-4 bg-white flex-1">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How to Download</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Paste the YouTube URL</h3>
                <p className="text-foreground/70">Enter a YouTube video link in the search box above or search for videos directly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Select Format and Quality</h3>
                <p className="text-foreground/70">Choose your preferred format (MP4 or MP3) and quality (360p-4K for video, 64-320kbps for audio).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white font-bold">
                    3
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Download</h3>
                <p className="text-foreground/70">Click the download button and your file will start downloading immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted flex-1">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-foreground mb-2">Is Y2mate free to use?</h3>
              <p className="text-foreground/70">
                Yes, Y2mate is completely free. You don't need to pay anything to download videos or audio from YouTube.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-foreground mb-2">What formats can I download?</h3>
              <p className="text-foreground/70">
                We support MP4 video (360p, 720p, 1080p, 4K) and MP3 audio (64kbps, 128kbps, 192kbps, 256kbps, 320kbps).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-foreground mb-2">Do I need to register?</h3>
              <p className="text-foreground/70">
                No registration is required to use Y2mate. However, creating an account lets you track your download history.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-foreground mb-2">Is it safe to use Y2mate?</h3>
              <p className="text-foreground/70">
                Yes, Y2mate is safe and secure. We don't store any personal information and all downloads are processed securely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-foreground mb-2">Can I download unlimited videos?</h3>
              <p className="text-foreground/70">
                Yes, there are no limits on the number of videos you can download with Y2mate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-4 mt-auto w-full">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            © 2016 - 2026 y2mate.com. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-red-600">About</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="text-muted-foreground hover:text-red-600">Contact</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="text-muted-foreground hover:text-red-600">Terms of Service</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="text-muted-foreground hover:text-red-600">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
