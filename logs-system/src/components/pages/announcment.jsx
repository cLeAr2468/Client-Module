import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import BgImage from "@/assets/login.png";
export default function AnnouncementPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Green Overlay */}
      <div className="absolute inset-0 bg-green-950/65" />

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-2 pt-16">
        {/* Main Title */}
        <h1 className="text-center text-4xl font-extrabold italic uppercase tracking-wide text-emerald-400 md:text-4xl">
          Students Affairs and Services
        </h1>

        {/* University Name */}
        <div className="mt-6 text-center text-white">
          <h2 className="text-lg font-bold uppercase md:text-lg">
            Northwest Samar State University San Jorge Campus
          </h2>
        </div>

        {/* Announcement Card */}
        <Card className="mt-8 w-full max-w-4xl border border-white/40 bg-green-900/90 shadow-2xl backdrop-blur-sm">
          <CardContent className="">
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
  );
}