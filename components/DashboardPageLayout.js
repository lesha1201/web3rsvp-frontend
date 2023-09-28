"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import joinClassNames from "../utils/joinClassNames";

export default function DashboardPageLayout({ title, tabs, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.value;
    const href = tabs.find((tab) => tab.name == name).href;
    router.push(href);
  };

  const currentTab = tabs.find((tab) => tab.href === pathname);

  return (
    <div className="sm:w-10/12 sm:pl-8">
      <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl mb-4">
        {title}
      </h1>

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={currentTab?.name}
          onChange={handleChange}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const isCurrentTab = tab.name === currentTab.name;

              return (
                <Link key={tab.name} href={tab.href} passHref legacyBehavior>
                  <a
                    className={joinClassNames(
                      isCurrentTab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                    )}
                    aria-current={isCurrentTab ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <section className="py-8">{children}</section>
    </div>
  );
}
