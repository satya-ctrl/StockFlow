const DashboardBackground = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-[-2] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-orange-500 animate-eruption mix-blend-overlay z-10 pointer-events-none" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-70"
          style={{
            filter: 'sepia(1) hue-rotate(330deg) saturate(300%) brightness(1.1) contrast(1.3)'
          }}
        >
          <source src="/dashboard-bg.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Dark Overlay to ensure high contrast for the dashboard */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[20px] z-[-1]" />
    </>
  );
};

export default DashboardBackground;
