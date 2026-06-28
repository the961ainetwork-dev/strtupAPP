import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 150,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 border-x-transparent border-t-transparent";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-l-zinc-900 border-y-transparent border-r-transparent";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-r-zinc-900 border-y-transparent border-l-transparent";
      case "top":
      default:
        return "top-full left-1/2 -translate-x-1/2 border-t-zinc-900 border-x-transparent border-b-transparent";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`absolute z-[999] w-max max-w-xs p-2 bg-[#0c0c0e] text-zinc-300 text-[9px] font-mono leading-relaxed border border-zinc-800 shadow-2xl pointer-events-none ${getPositionClasses()}`}
            role="tooltip"
          >
            {content}
            <div
              className={`absolute border-4 border-solid ${getArrowClasses()}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
