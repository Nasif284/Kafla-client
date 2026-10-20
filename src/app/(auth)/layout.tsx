import AuthHero from "@/src/features/user/auth/components/AuthHero";
import AuthTabs from "@/src/features/user/auth/components/AuthTabs";
import GoogleAuth from "@/src/features/user/auth/components/GoogleAuth";
import AuthFooter from "@/src/features/user/auth/components/AuthFooter";
import Logo from "@/src/components/Logo";

export default function AuthPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen bg-[#f7faf6] flex flex-col lg:flex-row relative">
      <AuthHero />
      <section className="w-full min-h-screen lg:w-[45%] lg:ml-[55%] flex flex-col justify-center items-center px-4 py-8 sm:px-8 md:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md my-auto py-6">
          {/* Mobile Header branding */}
          <div className="lg:hidden text-center mb-8">
            <Logo size={40} className="justify-center" />
            <p className="text-sm text-[#3f4944] mt-1 font-medium">Coordinate trips with your tribe</p>
          </div>

          <AuthTabs />
          <GoogleAuth />
          {children}
          <AuthFooter />
        </div>
      </section>
    </main>
  );
}
