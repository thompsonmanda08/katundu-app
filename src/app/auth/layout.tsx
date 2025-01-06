import { Logo, OnboardingSlider } from "@/components/elements";
import ThemeSwitcher from "@/components/elements/theme-switcher";
import { Slide } from "@/lib/types";

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Welcome to Katundu",
    description:
      "Explore thousands of properties for sale and rent. Katundu connects you with your dream home in just a few clicks.",
    image: "/images/onboarding/image1.jpg",
  },
  {
    id: 3,
    title: "Need Help? We're Here for You",
    description:
      "Whether you're looking for a cozy apartment or a spacious house, Katundu offers a variety of listings to suit your needs.",
    image: "/images/onboarding/image2.jpg",
  },
  {
    id: 3,
    title: "Find the Perfect Property",
    description:
      "There is nothing more satisfying than finding your dream home. Katundu makes it easy to find your perfect property.",
    image: "/images/onboarding/image3.jpg",
  },
  {
    id: 4,
    title: "Easily Connect with Agents",
    description:
      "Katundu helps you connect with verified real estate agents, making the buying, renting, or selling process seamless and stress-free.",
    image: "/images/onboarding/image4.jpg",
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
