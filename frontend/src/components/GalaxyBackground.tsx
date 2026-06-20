import { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Create stars
    const stars: {x: number, y: number, radius: number, speed: number, alpha: number}[] = [];
    const numStars = window.innerWidth < 768 ? 200 : 500;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random()
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Base dark background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // Move stars upwards and slightly left to create a flying through space effect
        star.y -= star.speed;
        star.x -= star.speed * 0.2; 
        
        // Twinkle effect
        star.alpha += (Math.random() - 0.5) * 0.05; 
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;

        // Reset position if out of bounds
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-[-3] pointer-events-none"
      />
      {/* Nebula Gradients */}
      <div className="fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black mix-blend-screen" />
      {/* Light Frosted Glass Overlay for text contrast */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none bg-black/40 backdrop-blur-[2px]" />
    </>
  );
};

export default GalaxyBackground;
