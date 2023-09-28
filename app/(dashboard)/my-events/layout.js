import DashboardPageLayout from "../../../components/DashboardPageLayout";

const TABS = [
  {
    name: "Upcoming",
    href: `/my-events/upcoming`,
  },
  {
    name: "Past",
    href: `/my-events/past`,
  },
];

export default function MyEventsLayout({ children }) {
  return (
    <DashboardPageLayout title="My Events" tabs={TABS}>
      {children}
    </DashboardPageLayout>
  );
}
