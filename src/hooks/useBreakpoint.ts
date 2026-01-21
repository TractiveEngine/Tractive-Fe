import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "lg";

/**
 * Hook to detect responsive breakpoints
 * @returns Current breakpoint: "xs" | "sm" | "lg"
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth >= 1024) {
        setBreakpoint("lg");
      } else if (window.innerWidth >= 640) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
