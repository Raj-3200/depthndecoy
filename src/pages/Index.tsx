import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import useEmblaCarousel from "embla-carousel-react";
import heroImage from "@/assets/hero-image.jpg";
import philosophyImage from "@/assets/philosophy-image.jpg";

const series = [
  {
    name: "Quote Series",
    slug: "quote-series",
    tagline: "Wear what you believe",
    description: "Statement pieces that carry conviction. Each garment in the Quote Series bears the ethos of Depth & Decoy — words that move, printed on fabric that lasts.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80",
  },
  {
    name: "Chronicle Series",
    slug: "chronicle-series",
    tagline: "Every thread tells a story",
    description: "Narrative-driven designs that chronicle the journey. The Chronicle Series captures moments in time through texture, tone, and meticulous construction.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=80",
  },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <Layout>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 container-premium text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6"
          >
            We Win
          </motion.p>

          <h1 className="hero-text-reveal">
            <span className="block text-display text-foreground">DEPTH</span>
            <span className="block text-display text-foreground -mt-2 md:-mt-4 lg:-mt-8">& DECOY</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-6 md:mt-8 text-lg md:text-xl font-light tracking-wide text-muted-foreground max-w-md mx-auto"
          >
            Let Us Be Your Reminder
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/shop" className="btn-primary">
              Shop Now
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
            <Link to="/collections" className="btn-outline">
              View Collections
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          aria-hidden="true"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-5 border-y border-border/60 overflow-hidden" aria-hidden="true">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 mx-10">
              WE WIN • DEPTH OVER NOISE • NOT FOR THE SURFACE • LET US BE YOUR REMINDER •
            </span>
          ))}
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-16 md:py-24" aria-label="Featured pieces">
        <div className="container-premium">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Featured</p>
              <h2 className="text-headline text-foreground">Curated Picks</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-4" />
                  <div className="h-3 bg-secondary w-3/4 mb-2" />
                  <div className="h-3 bg-secondary w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 md:gap-8">
                {featuredProducts.slice(0, 6).map((product, index) => (
                  <div key={product.id} className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Series Preview */}
      <section className="py-16 md:py-24 bg-secondary/50" aria-label="Collections">
        <div className="container-premium">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Collections</p>
            <h2 className="text-headline text-foreground">The Series</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {series.map((s, index) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
              >
                <Link
                  to={`/collections?series=${s.slug}`}
                  className="group block relative aspect-[4/5] bg-secondary overflow-hidden"
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{s.tagline}</p>
                    <h3 className="font-display text-3xl md:text-4xl tracking-[0.05em] text-foreground mb-3">
                      {s.name}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-foreground group-hover:gap-3 transition-all duration-300">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-24" aria-label="Our philosophy">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">Our Philosophy</p>
              <h2 className="text-headline text-foreground mb-6">
                Quiet Power.{"\n"}Bold Presence.
              </h2>
              <p className="text-lg font-light text-muted-foreground mb-6 leading-relaxed">
                Depth & Decoy exists for men who understand that true style doesn't shout — it commands.
                Every piece is engineered for those who move in shadow, who let their presence speak
                before their words.
              </p>
              <p className="text-base font-light text-muted-foreground/80 mb-8 leading-relaxed">
                We craft garments that merge streetwear energy with luxury precision. No logos demanding
                attention. No trends dictating direction. Just considered design for the considered man.
              </p>
              <Link to="/about" className="btn-outline">
                Our Story
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-[4/5]"
            >
              <img
                src={philosophyImage}
                alt="Depth & Decoy craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-border" aria-label="Call to action">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">We Win</p>
            <h2 className="text-headline text-foreground mb-5">Enter the Depth</h2>
            <p className="text-lg font-light text-muted-foreground max-w-lg mx-auto mb-10">
              Join the inner circle. Get early access to drops, exclusive content, and member-only pricing.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop Now
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
