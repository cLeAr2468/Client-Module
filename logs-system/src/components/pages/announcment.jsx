import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import BackgroundLayout from "@/components/layout/background-layout";

export default function AnnouncementPage() {
  return (
    <BackgroundLayout overlayColor="bg-green-950/65">
      {/* Header */}
      <Header />

      {/* MOBILE VIEW - Visible only on mobile */}
      <div className="block min-h-screen md:hidden">
        <div className="flex flex-col items-center px-4 pt-8">
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

          {/* Announcement Card - Mobile */}
          <Card className="mt-6 w-full border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-4">
              <h4 className="mb-3 text-center text-xl font-semibold text-white">
                Latest Announcement:
              </h4>

              <p className="text-center text-base leading-relaxed text-white">
                Please be informed that the enrollment period for the 2nd
                semester will start on March 1, 2026. Students are advised to
                complete their clearance and required documents before the
                deadline.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DESKTOP VIEW - Visible only on desktop */}
      <div className="hidden min-h-screen md:block">
        <div className="flex flex-col items-center px-6 pt-16">
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

          {/* Announcement Card - Desktop */}
          <Card className="mt-8 w-full max-w-4xl border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <h4 className="mb-4 text-center text-3xl font-semibold text-white">
                Latest Announcement:
              </h4>

              <p className="text-center text-xl leading-relaxed text-white">
                Please be informed that the enrollment period for the 2nd
                semester will start on March 1, 2026. Students are advised to
                complete their clearance and required documents before the
                deadline.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundLayout>
  );
}