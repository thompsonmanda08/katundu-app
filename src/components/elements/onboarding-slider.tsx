"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Slide } from "@/lib/types";

export default function OnboardingSlider({ slides }: { slides: Slide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col items-center w-full flex-1 relative md:min-h-screen md:max-h-[100svh]">
      <Carousel
        plugins={[
          Autoplay({
            delay: 7000 + current,
            stopOnInteraction: true,
            stopOnLastSnap: false,
          }),
        ]}
        setApi={setApi}
        className="w-full flex flex-1"
      >
        <CarouselContent className="w-full h-full flex flex-grow mx-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              {/* <Image
                className="w-full h-full md:max-h-[100svh] object-cover"
                src={`/images/onboarding/image${index + 1}.jpg`}
                alt=""
                width={280}
                height={280}
                priority
                unoptimized
              /> */}
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <div className="hidden lg:block">
          <CarouselPrevious className="bg-slate-50 text-primary border-transparent hover:bg-slate-50/80 hover:text-primary" />
          <CarouselNext className="bg-slate-50 text-primary border-transparent hover:bg-slate-50/80 hover:text-primary" />
        </div> */}
      </Carousel>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // Ensure a unique key for each step
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              ease: "easeInOut",
              duration: 0.25,
            },
          }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          className="flex flex-col absolute top-32 p-5 rounded-xl backdrop-blur-md md:mx-auto mx-2 bg-gradient-to-br from-white/5 via-white/10 to-white/5 justify-center items-center gap-4 max-w-lg mb-8 z-50"
        >
          <h3 className="text-center text-white text-[clamp(1rem,1rem+1vw,1.75rem)] font-semibold  leading-10">
            {slides[currentIndex]?.title}
          </h3>

          <p className="w-full text-center text-neutral-200 text-[clamp(11px,11px+0.5vw,1.25rem)] leading-7">
            {slides[currentIndex]?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
