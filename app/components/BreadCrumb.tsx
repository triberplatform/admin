"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbProps {
  homeLabel?: string;
  separator?: React.ReactNode;
  containerClassName?: string;
  listClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  transformLabel?: (segment: string) => string;
}

export default function Breadcrumb({
  homeLabel = "Home",
  separator = "/",
  containerClassName = "",
  listClassName = "",
  activeItemClassName = "text-mainGreen font-medium",
  inactiveItemClassName = "text-black",
  transformLabel = (segment) =>
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
}: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Use useMemo instead of useState + useEffect to compute breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    
    // Split the pathname into segments
    const segments = pathname.split("/").filter(Boolean);
    
    // Build the breadcrumbs array
    const crumbs = segments.map((segment, index) => {
      const label = transformLabel(segment);
      const isActive = index === segments.length - 1;
      
      return { label, isActive };
    });
    
    // Add home as the first breadcrumb
    return [
      { label: homeLabel, isActive: pathname === "/" },
      ...crumbs,
    ];
  }, [pathname, homeLabel, transformLabel]);
  
  // Don't show breadcrumbs on the home page
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${containerClassName}`}>
      <ol className={`flex flex-wrap items-center text-sm ${listClassName}`}>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}

            <span 
              className={crumb.isActive ? activeItemClassName : inactiveItemClassName}
              aria-current={crumb.isActive ? "page" : undefined}
            >
              {crumb.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}