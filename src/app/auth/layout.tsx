import { Logo, OnboardingSlider } from "@/components/elements";
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
    <main className="flex min-h-[100vh] flex-col items-center relative w-screen no-scrollbar md:overflow-clip md:max-h-screen">
      <section className="flex flex-col flex-1 lg:flex-row w-full max-w-[1920px] mx-auto no-scrollbar">
        <div className="flex-1 md:flex-[0.75] flex flex-col no-scrollbar mb-5 md:overflow-y-auto md:max-h-screen">
          <ThemeSwitcher className="lg:self-start self-end mx-4 my-4 " />
          {children}
        </div>
        <div className="bg-primary relative hidden top-0 bottom-0 lg:flex flex-col justify-center  items-center flex-1 md:min-h-[100vh] md:max-h-screen no-scrollbar">
          <div className="flex mb-12 gap-3 z-40 absolute inset-0 bg-gradient-to-b from-black/80 via-secondary/30 to-transparent inset-x-0">
            {showLogo && (
              <div className="flex flex-col mx-auto pt-16 pb-8">
                <span className="sr-only">Katundu Logo</span>
                <Logo href="/" className="" src="/images/logo/logo-light.svg" />
                {/* <p className="pl-14 tracking-wider leading-4 text-xs">
                  Home sweet home!
                </p> */}
              </div>
            )}
          </div>
          <OnboardingSlider slides={SLIDES} />
        </div>
      </section>
    </main>
  );
}
