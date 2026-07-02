import BgImage from "@/assets/login.png";

export default function BackgroundLayout({ children, overlayColor = "bg-green-950/65" }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayColor}`} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
