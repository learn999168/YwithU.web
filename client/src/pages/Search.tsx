import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search as SearchIcon, ArrowLeft, Play } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(decodeURIComponent(q));
      performSearch(decodeURIComponent(q));
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Mock search results - in production, this would call a real YouTube API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResults: SearchResult[] = [
        {
          id: "dQw4w9WgXcQ",
          title: "Sample Video 1 - " + query,
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
          duration: "3:33",
          channel: "Sample Channel",
          views: "1.2M",
        },
        {
          id: "jNQXAC9IVRw",
          title: "Sample Video 2 - " + query,
          thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
          duration: "2:45",
          channel: "Another Channel",
          views: "850K",
        },
        {
          id: "9bZkp7q19f0",
          title: "Sample Video 3 - " + query,
          thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
          duration: "5:12",
          channel: "Popular Creator",
          views: "2.5M",
        },
        {
          id: "kJQP7kiw9Fk",
          title: "Sample Video 4 - " + query,
          thumbnail: "https://img.youtube.com/vi/kJQP7kiw9Fk/mqdefault.jpg",
          duration: "4:01",
          channel: "Music Channel",
          views: "500K",
        },
        {
          id: "L0MK7qz13bU",
          title: "Sample Video 5 - " + query,
          thumbnail: "https://img.youtube.com/vi/L0MK7qz13bU/mqdefault.jpg",
          duration: "6:30",
          channel: "Entertainment Hub",
          views: "1.8M",
        },
        {
          id: "OPf0YbXqDm0",
          title: "Sample Video 6 - " + query,
          thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg",
          duration: "3:15",
          channel: "Music Lover",
          views: "750K",
        },
      ];

      setResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const handleVideoClick = (videoId: string) => {
    setLocation(`/downloader?url=https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search YouTube videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 border border-border"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 h-12"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SearchIcon className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {hasSearched && isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}

        {hasSearched && !isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No results found for "{searchQuery}"
            </p>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        )}

        {results.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Search Results for "{searchQuery}"
            </h2>

            <div className="grid gap-4">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleVideoClick(result.id)}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden group">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {result.duration}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {result.channel}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.views} views
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="w-fit bg-red-600 hover:bg-red-700 text-white mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(result.id);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Import Download icon
import { Download } from "lucide-react";
