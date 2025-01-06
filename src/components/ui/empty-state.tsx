import { cn } from "@/lib/utils";
import Image from "next/image";

import { motion } from "framer-motion";

type EmptyStateProps = {
  title: string;
  description: string;
  src?: string;
  className?: string;
  width?: number;
  height?: number;
  classNames?: {
    base?: string;
    heading?: string;
    paragraph?: string;
    image?: string;
  };
};

const EmptyState = ({
  title = "Nothing here",
  description = "Looks like you have no listings yet",
  src = "/images/empty.jpg",
  className,
  classNames,
  width,
  height,
}: EmptyStateProps) => {
  const { base, heading, paragraph, image } = classNames || {};
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 80 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -80 },
      }}
      className={cn(
        `flex w-full flex-col items-center justify-center gap-1`,
        className,
        base
      )}
    >
      <Image
        src={src}
        alt="empty list"
        className={cn("w-[250px] dark:opacity-40", image)}
        width={width || 150}
        height={height || 150}
      />
      <h4
        className={cn(
          "text-center text-lg leading-6 text-foreground font-semibold",
          heading
        )}
      >
        {title}
      </h4>
      <p
        className={cn(
          "mb-2  text-center text-sm leading-6 text-slate-500",
          paragraph
        )}
      >
        {description}
      </p>
    </motion.div>
  );
};
export default EmptyState;
