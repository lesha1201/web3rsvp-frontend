import DashboardNav from "../../components/DashboardNav";

export const metadata = {
  title: "My Dashboard | web3rsvp",
  description: "Manage your events and RSVPs",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap py-8">
        <DashboardNav />
        {children}
      </div>
    </div>
  );
}
