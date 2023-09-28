import DashboardPageLayout from "../../../components/DashboardPageLayout";

const TABS = [
  {
    name: "Upcoming",
    href: `/my-rsvps/upcoming`,
  },
  {
    name: "Past",
    href: `/my-rsvps/past`,
  },
];

export default function MyRSVPsLayout({ children }) {
  return (
    <DashboardPageLayout title="My RSVPs" tabs={TABS}>
      {children}
    </DashboardPageLayout>
  );
}
