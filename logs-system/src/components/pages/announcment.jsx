import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import BackgroundLayout from "@/components/layout/background-layout";
import { getPublishedAnnouncements } from "@/api/announcementApi";
import { toast } from "sonner";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get the API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://logs-server-system-production.up.railway.app/api";
  // Extract the base URL without /api for storage
  const STORAGE_BASE_URL = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getPublishedAnnouncements();
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <BackgroundLayout overlayColor="bg-green-950/65">
      {/* Header */}
      <Header />

      {/* MOBILE VIEW - Visible only on mobile */}
      <div className="block min-h-screen md:hidden">
        <div className="flex flex-col items-center px-4 pt-8 pb-8">
          {/* Main Title - Mobile */}
          <h1 className="text-center text-2xl font-extrabold italic uppercase tracking-wide text-emerald-400">
            Students Affairs and Services
          </h1>

          {/* University Name - Mobile */}
          <div className="mt-4 text-center text-white">
            <h2 className="text-sm font-bold uppercase">
              Northwest Samar State University San Jorge Campus
            </h2>
          </div>

          {/* Announcements Section - Mobile */}
          <div className="mt-6 w-full space-y-4">
            <h3 className="text-center text-xl font-bold text-white">
              Announcements
            </h3>

            {loading ? (
              <Card className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                  <p className="text-white text-sm">Loading announcements...</p>
                </CardContent>
              </Card>
            ) : announcements.length === 0 ? (
              <Card className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-center text-white">No announcements available at this time.</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm"
                >
                  <CardContent className="p-4">
                    {/* Cover Image */}
                    {announcement.cover_image && (
                      <img
                        src={`${STORAGE_BASE_URL}/storage/${announcement.cover_image}`}
                        alt={announcement.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}

                    {/* Title */}
                    <h4 className="text-lg font-bold text-white mb-2">
                      {announcement.title}
                    </h4>

                    {/* Date */}
                    <p className="text-xs text-emerald-300 mb-2">
                      {formatDate(announcement.published_at)}
                    </p>

                    {/* Content */}
                    <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW - Visible only on desktop */}
      <div className="hidden min-h-screen md:block">
        <div className="flex flex-col items-center px-6 pt-16 pb-16">
          {/* Main Title - Desktop */}
          <h1 className="text-center text-5xl font-extrabold italic uppercase tracking-wide text-emerald-400">
            Students Affairs and Services
          </h1>

          {/* University Name - Desktop */}
          <div className="mt-6 text-center text-white">
            <h2 className="text-xl font-bold uppercase">
              Northwest Samar State University San Jorge Campus
            </h2>
          </div>

          {/* Announcements Section - Desktop */}
          <div className="mt-8 w-full max-w-4xl space-y-6">
            <h3 className="text-center text-3xl font-bold text-white">
              Announcements
            </h3>

            {loading ? (
              <Card className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-10 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-white mb-3" />
                  <p className="text-white text-lg">Loading announcements...</p>
                </CardContent>
              </Card>
            ) : announcements.length === 0 ? (
              <Card className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-10">
                  <p className="text-center text-white text-lg">
                    No announcements available at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    {/* Cover Image */}
                    {announcement.cover_image && (
                      <img
                        src={`${STORAGE_BASE_URL}/storage/${announcement.cover_image}`}
                        alt={announcement.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}

                    {/* Title */}
                    <h4 className="text-2xl font-bold text-white mb-3">
                      {announcement.title}
                    </h4>

                    {/* Date */}
                    <p className="text-sm text-emerald-300 mb-4">
                      {formatDate(announcement.published_at)}
                    </p>

                    {/* Content */}
                    <p className="text-lg leading-relaxed text-white whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}