import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LogOut, Download, Search, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Account() {
  const { user, logout, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"downloads" | "searches">("downloads");

  const { data: downloadHistory, isLoading: downloadsLoading } = trpc.downloads.getHistory.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  const { data: searchHistory, isLoading: searchesLoading } = trpc.search.getHistory.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );

  const handleLogout = async () => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full border-0 bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-4 text-center">Sign In Required</h1>
          <p className="text-foreground/70 text-center mb-6">
            Please sign in to view your download and search history.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
            <p className="text-foreground/70">Welcome, {user.name || user.email}!</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <Card className="p-6 mb-8 border-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-semibold text-foreground">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold text-foreground">{user.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Member Since</p>
              <p className="font-semibold text-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Sign In</p>
              <p className="font-semibold text-foreground">
                {new Date(user.lastSignedIn).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("downloads")}
            className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "downloads"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="w-4 h-4" />
            Download History
          </button>
          <button
            onClick={() => setActiveTab("searches")}
            className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "searches"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Search History
          </button>
        </div>

        {/* Download History Tab */}
        {activeTab === "downloads" && (
          <Card className="border-0 bg-white shadow-sm">
            {downloadsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              </div>
            ) : downloadHistory && downloadHistory.length > 0 ? (
              <div className="divide-y divide-border">
                {downloadHistory.map((download) => (
                  <div key={download.id} className="p-4 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {download.videoTitle || "Unknown Video"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Format: <span className="font-mono">{download.downloadFormat}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(download.downloadedAt).toLocaleString()}
                        </p>
                      </div>
                      {download.videoThumbnail && (
                        <img
                          src={download.videoThumbnail}
                          alt={download.videoTitle || "Video"}
                          className="w-20 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No downloads yet</p>
                <Button
                  onClick={() => setLocation("/")}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Start Downloading
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Search History Tab */}
        {activeTab === "searches" && (
          <Card className="border-0 bg-white shadow-sm">
            {searchesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              </div>
            ) : searchHistory && searchHistory.length > 0 ? (
              <div className="divide-y divide-border">
                {searchHistory.map((search) => (
                  <div key={search.id} className="p-4 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {search.searchQuery}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(search.searchedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setLocation(`/search?q=${encodeURIComponent(search.searchQuery)}`)
                        }
                      >
                        Search Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No searches yet</p>
                <Button
                  onClick={() => setLocation("/")}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Start Searching
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
