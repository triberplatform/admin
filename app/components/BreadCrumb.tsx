"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  inactiveItemClassName = "text-black hover:text-mainGreen hover:underline",
  transformLabel = (segment) =>
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
}: BreadcrumbProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{
      label: string;
      href: string;
      isActive: boolean;
    }>
  >([]);

  useEffect(() => {
    if (!pathname) return;

    // Split the pathname into segments and build the breadcrumbs
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = transformLabel(segment);
      const isActive = index === segments.length - 1;

      return { label, href, isActive };
    });

    // Add home as the first breadcrumb
    const allCrumbs = [
      { label: homeLabel, href: "/", isActive: pathname === "/" },
      ...crumbs,
    ];

    setBreadcrumbs(allCrumbs);
  }, [pathname, homeLabel, transformLabel]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on the home page
  }

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${containerClassName}`}>
      <ol className={`flex flex-wrap items-center text-sm ${listClassName}`}>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}

            {crumb.isActive ? (
              <span className={activeItemClassName} aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className={inactiveItemClassName}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
