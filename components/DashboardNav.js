"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import joinClassNames from "../utils/joinClassNames";

export default function DashboardNav() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "My Events",
      href: `/my-events/upcoming`,
      current: pathname.startsWith("/my-events"),
    },
    {
      name: "My RSVPs",
      href: `/my-rsvps/upcoming`,
      current: pathname.startsWith("/my-rsvps"),
    },
  ];

  return (
    <nav className="space-y-1 w-60 mb-8 sm:w-2/12" aria-label="Sidebar">
      {navigation.map((item) => (
        <Link key={item.name} href={item.href} passHref legacyBehavior>
          <a
            className={joinClassNames(
              item.current
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            )}
            aria-current={item.current ? "page" : undefined}
          >
            <span className="truncate">{item.name}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
