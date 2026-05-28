import { Navbar } from "@/src/components/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
