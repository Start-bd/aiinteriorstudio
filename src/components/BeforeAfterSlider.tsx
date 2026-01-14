import { useState, useRef, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-lg overflow-hidden cursor-ew-resize select-none bg-secondary"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Handle Grip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium px-2 py-1 rounded">
        {afterLabel}
      </div>

      {/* Instruction hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-sm text-foreground text-xs px-3 py-1.5 rounded-full opacity-70">
        Drag to compare
      </div>
    </div>
  );
}
