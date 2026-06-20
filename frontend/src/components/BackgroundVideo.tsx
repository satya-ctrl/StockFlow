const BackgroundVideo = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-[-2] overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] object-cover -translate-x-1/2 -translate-y-1/2 opacity-70"
          style={{
            filter: 'blur(30px) sepia(1) hue-rotate(320deg) saturate(500%) brightness(0.6) contrast(1.5)',
            transform: 'translate(-50%, -50%) scale(1.1)',
            animation: 'rumble 3s infinite alternate ease-in-out'
          }}
        >
          <source src="/dashboard-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Heavy Frosted Glass Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[10px] z-[-1]" />
    </>
  );
};

export default BackgroundVideo;
