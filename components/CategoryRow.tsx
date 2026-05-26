'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useState } from 'react';
import AppCard from '@/components/AppCard';
import BorderGlow from '@/components/BorderGlow';
import ShinyText from '@/components/ShinyText';

interface RepoItem {
  name: string;
  owner: string;
  description: string;
  avatarUrl: string;
  stars: number;
  forks: number;
  platforms: string[];
  verified?: boolean;
}

interface CategoryRowProps {
  title: string;
  items: RepoItem[];
}

export default function CategoryRow({ title, items }: CategoryRowProps) {
  if (!items || items.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mb-14">
      <p className="mb-5 px-4 sm:px-1 font-semibold tracking-wide uppercase">
        <ShinyText
          text={title}
          speed={4}
          color="var(--muted-foreground)"
          shineColor="var(--foreground)"
          spread={100}
          className="text-lg"
        />
      </p>

      <div className="relative overflow-x-clip">
        <Swiper
          modules={[EffectCoverflow, Pagination, Keyboard, Autoplay]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          keyboard={{ enabled: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            0:    { slidesPerView: 1.1,  spaceBetween: 12 },
            480:  { slidesPerView: 1.35, spaceBetween: 14 },
            640:  { slidesPerView: 1.85, spaceBetween: 16 },
            900:  { slidesPerView: 2.4,  spaceBetween: 18 },
            1200: { slidesPerView: 3.1,  spaceBetween: 20 },
          }}
          className="category-swiper !pb-9"
        >
          {items.map((item, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <div className="h-[390px]">
                {activeIndex === i ? (
                  <BorderGlow
                    className="h-full w-full"
                    backgroundColor="var(--card)"
                    borderRadius={16}
                    glowRadius={36}
                    glowColor="200 70 80"
                    glowIntensity={0.9}
                    colors={['#c084fc', '#818cf8', '#38bdf8']}
                    fillOpacity={0.35}
                    animated
                  >
                    <AppCard {...item} />
                  </BorderGlow>
                ) : (
                  <AppCard {...item} />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none max-md:hidden absolute inset-y-0 -left-2 w-16 sm:w-24 z-10 fade-edge-left" />
        <div className="pointer-events-none max-md:hidden absolute inset-y-0 -right-2 w-16 sm:w-24 z-10 fade-edge-right" />
      </div>
    </section>
  );
}
