"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface Screenshot {
  name: string;
  download_url: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

export default function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination, Keyboard, Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={screenshots.length > 2}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 80,
          modifier: 2,
          slideShadows: false,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          0: { slidesPerView: 1.15, spaceBetween: 10 },
          480: { slidesPerView: 1.3, spaceBetween: 12 },
          640: { slidesPerView: 1.6, spaceBetween: 14 },
          900: { slidesPerView: 2.2, spaceBetween: 16 },
          1200: { slidesPerView: 2.8, spaceBetween: 18 },
        }}
        className="screenshot-swiper !pb-8"
      >
        {screenshots.map((screen) => (
          <SwiperSlide key={screen.name} className="!h-auto">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <img
                src={screen.download_url}
                alt={screen.name}
                className="w-full h-auto object-contain select-none"
                draggable={false}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
