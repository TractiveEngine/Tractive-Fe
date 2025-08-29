import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ATTrackSwitch: React.FC = () => {
  const pathname = usePathname();
  const [activeMode, setActiveMode] = useState<"Agents" | "Transporters">(
    "Agents"
  );

  // Set activeMode based on the current pathname
  useEffect(() => {
    if (pathname.includes("/admin/track-orders/track-transporter")) {
      setActiveMode("Transporters");
    } else {
      setActiveMode("Agents"); // Default to Agents
    }
  }, [pathname]);

  return (
    <div>
      {/* Agent and Transporter navigation */}
      <div className="flex items-center gap-6">
        <Link
          href="/admin/track-orders/track-agent"
          className={`border-[1px] border-[#808080] rounded-[5px] font-montserrat text-[13px] px-3 py-2 cursor-pointer ${
            activeMode === "Agents"
              ? "bg-[#538e53] text-[#fefefe] hover:bg-[#537e53]"
              : "text-[#2b2b2b] hover:bg-[#538e53] hover:text-[#fefefe]"
          }`}
          onClick={() => setActiveMode("Agents")}
          aria-label="Switch to Agents"
        >
          Agents
        </Link>
        <Link
          href="/admin/track-orders/track-transporter"
          className={`border-[1px] border-[#808080] rounded-[5px] font-montserrat text-[13px] px-3 py-2 cursor-pointer ${
            activeMode === "Transporters"
              ? "bg-[#538e53] text-[#fefefe] hover:bg-[#537e53]"
              : "text-[#2b2b2b] hover:bg-[#538e53] hover:text-[#fefefe]"
          }`}
          onClick={() => setActiveMode("Transporters")}
          aria-label="Switch to Transporters"
        >
          Transporters
        </Link>
      </div>
    </div>
  );
};
