import { InfiniteSlider } from "./infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
    return (
        <div
            {...props}
            className={cn(
                "overflow-hidden ",
                className
            )}
        >
            <InfiniteSlider
                reverse
                duration={80}
                durationOnHover={100}
            >
                {logos.map((logo, idx) => (
  <div
    key={idx}
    className="relative  flex-shrink-0 flex items-center mb-2 justify-center md:w-28 md:h-28 h-16 w-16 p-2 bg-white shadow-sm border-2 border-gray-200"
    style={{
      clipPath:
        "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
    }}
  >
    <img
      alt={logo.alt}
      src={logo.src}
      width={200}
      height={100}
      loading="lazy"
      className="pointer-events-none h-full w-full object-contain select-none"
      draggable={false}
    />
  </div>
))}

            </InfiniteSlider>
        </div>
    );
}