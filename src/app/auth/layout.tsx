import { Logo, OnboardingSlider, TopNavBar } from "@/components/elements";
import ThemeSwitcher from "@/components/elements/theme-switcher";
import { Slide } from "@/lib/types";

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Welcome to Katundu",
    description:
      "Simplify cargo transportation with Katundu. Whether you're shipping goods or looking for cargo to transport, we’ve got you covered.",
    image: "/images/onboarding/cargo1.jpg",
  },
  {
    id: 2,
    title: "Find Reliable Transporters",
    description:
      "Easily connect with trusted transporters. Katundu ensures your cargo is in safe hands from pickup to delivery.",
    image: "/images/onboarding/cargo2.jpg",
  },
  {
    id: 3,
    title: "Manage Your Shipments",
    description:
      "Track, manage, and update your shipments in real-time. Stay informed every step of the way with Katundu.",
    image: "/images/onboarding/cargo3.jpg",
  },
  {
    id: 4,
    title: "Earn as a Transporter",
    description:
      "Looking for cargo to transport? Katundu connects you with shippers, helping you maximize your earnings effortlessly.",
    image: "/images/onboarding/cargo4.jpg",
  },
  {
    id: 5,
    title: "Seamless Payment Integration",
    description:
      "Pay or get paid with ease. Katundu’s secure mobile money integration makes transactions smooth and hassle-free.",
    image: "/images/onboarding/cargo5.jpg",
  },
];

export default async function AuthLayout({
  showLogo = false,
  children,
}: {
  showLogo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="no-scrollbar relative flex min-h-[100vh] w-screen flex-col items-center md:max-h-screen md:overflow-clip">
      <section className="no-scrollbar mx-auto flex w-full max-w-[1920px] flex-1 flex-col lg:flex-row">
        <div className="no-scrollbar mb-5 flex max-h-screen flex-1 flex-col overflow-y-auto pb-12 md:flex-[0.75]">
          {/* <div className="flex h-max w-full justify-between gap-2 p-4 px-5">
            <span className="sr-only">Katundu Logo</span>
            <Logo href="/" />
            <ThemeSwitcher className="aspect-square h-9 w-9 self-end lg:self-start" />
          </div> */}
          <TopNavBar currentPage={1} />

          {children}
        </div>

        <div className="no-scrollbar relative bottom-0 top-0 hidden flex-1 flex-col items-center justify-center bg-primary md:max-h-screen md:min-h-[100vh] lg:flex">
          <div className="absolute inset-0 inset-x-0 z-40 mb-12 flex gap-3 bg-gradient-to-b from-black/80 via-secondary/30 to-transparent">
            {showLogo && (
              <div className="mx-auto flex flex-col pb-8 pt-16">
                <span className="sr-only">Katundu Logo</span>
                <Logo href="/" className="" src="/images/logo/logo-light.svg" />
              </div>
            )}
          </div>
          <OnboardingSlider slides={SLIDES} />
        </div>
      </section>
    </main>
  );
}
