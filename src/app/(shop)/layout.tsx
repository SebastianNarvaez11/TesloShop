import { SideMenu, TopMenu } from "@/components";
import { Footer } from "@/components/ui/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      <SideMenu />
      <div className="px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
