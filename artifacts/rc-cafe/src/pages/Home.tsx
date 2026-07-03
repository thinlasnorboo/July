import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, GaugeCircle, Wrench, Coffee } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type Slide = { id: number; imageUrl: string; title: string; subtitle: string };

function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/slides")
      .then(r => r.json())
      .then((data: Slide[]) => {
        const active = data.filter((s: Slide & { active?: boolean }) => s.active !== false);
        setSlides(active.length ? active : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(slides.length, 1)), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1)), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [slides.length, next]);

  const slide = slides[current];

  return (
    <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background images */}
      {loaded && slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={s.imageUrl}
            alt={s.title}
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </div>
      ))}

      {/* Fallback if no slides yet */}
      {(!loaded || slides.length === 0) && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop"
            alt="RC Racing"
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </div>
      )}

      {/* Watermark logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] z-0 pointer-events-none select-none">
        <img src="/logo.jpeg" alt="" className="w-[80vw] max-w-[800px] h-auto object-cover mix-blend-screen" />
      </div>

      {/* Text content */}
      <div className="container relative z-20 flex flex-col items-center text-center space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs uppercase tracking-widest font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          India's Premier RC Experience
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-serif uppercase tracking-tighter text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          {slide?.title ? (
            <span dangerouslySetInnerHTML={{ __html: slide.title.replace("Relax", '<span class="text-primary italic pr-2">Relax</span>') }} />
          ) : (
            <>Race. <span className="text-primary italic pr-2">Relax.</span> Repeat.</>
          )}
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-300 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {slide?.subtitle || "Professional RC tracks, high-performance rentals, and a fully stocked cafe."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Button asChild size="lg" className="rounded-none h-14 px-8 text-base uppercase tracking-widest font-bold bg-primary text-primary-foreground hover:bg-primary/90 group">
            <Link href="/book">
              Book Track Time
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-none h-14 px-8 text-base uppercase tracking-widest font-bold border-white/20 text-white hover:bg-white/10 hover:text-white bg-background/20 backdrop-blur-sm">
            <Link href="/menu">View Menu</Link>
          </Button>
        </div>
      </div>

      {/* Slide nav arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/30 hover:bg-primary/80 transition-colors text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/30 hover:bg-primary/80 transition-colors text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 transition-all ${i === current ? "bg-primary w-6" : "bg-white/40 hover:bg-white/70"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}

export default function Home() {
  const { data: stats } = useGetStats();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />

      {/* Stats Bar */}
      <div className="border-y border-border/50 bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/30 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl font-bold font-serif text-primary">{stats?.totalTracks ?? 3}+</h4>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Racing Tracks</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold font-serif text-primary">{stats?.memberCount ?? 500}+</h4>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Active Members</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold font-serif text-primary">{stats?.totalBookings ?? 1000}+</h4>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Sessions Run</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold font-serif text-primary">{stats?.yearsOpen ?? 1}</h4>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Years Open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold font-serif uppercase tracking-tight mb-4">The Experience</h2>
              <p className="text-muted-foreground text-lg">Everything you need for a full day of adrenaline-fueled action.</p>
            </div>
            <Button asChild variant="link" className="text-primary hover:text-primary/80 uppercase tracking-widest font-bold">
              <Link href="/services">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-card border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
              <GaugeCircle className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">Track Rental</h3>
              <p className="text-muted-foreground mb-6">Professional grade carpet and dirt tracks. Timing systems available. Bring your own car or rent ours.</p>
              <div className="text-sm font-bold text-primary">From ₹150 / 30 Min</div>
            </div>
            <div className="group bg-card border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
              <Wrench className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">Pro Shop</h3>
              <p className="text-muted-foreground mb-6">Parts broke? Need an upgrade? Our fully stocked pit shop has bodies, motors, batteries, and tools.</p>
              <Link href="/shop" className="text-sm font-bold text-primary hover:underline flex items-center">
                Shop Parts <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="group bg-card border border-border/50 p-8 hover:border-primary/50 transition-all duration-300">
              <Coffee className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">Cafe & Chill</h3>
              <p className="text-muted-foreground mb-6">Fuel up between heats with espresso, cold shakes, burgers, and pizzas while watching the races.</p>
              <Link href="/menu" className="text-sm font-bold text-primary hover:underline flex items-center">
                View Menu <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 mix-blend-overlay" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23fff'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")",backgroundSize:"40px 40px"}} />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold font-serif uppercase tracking-tight mb-6">Ready to Race?</h2>
            <p className="text-xl text-muted-foreground mb-8">Open 7 days a week. Book your track time online to guarantee your spot on the driver's stand.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[["30 Minutes","₹150"],["1 Hour","₹250"],["Full Day Pass","₹700"],["Basic Drift Rental (15m)","₹150"]].map(([label, price]) => (
                <div key={label} className="flex justify-between items-center p-4 border border-border/50 bg-background/50">
                  <span className="font-bold">{label}</span>
                  <span className="text-primary font-serif text-xl font-bold">{price}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="rounded-none h-14 px-10 text-base uppercase tracking-widest font-bold bg-primary hover:bg-primary/90">
              <Link href="/book">Book Your Session</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-background">
        <div className="container text-center max-w-2xl">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-serif uppercase tracking-wide mb-4">Find The Track</h2>
          <p className="text-muted-foreground mb-8">Located in the heart of the city with dedicated parking and easy access.</p>
          <Button asChild variant="outline" className="rounded-none uppercase tracking-widest font-bold border-primary/50 hover:bg-primary hover:text-primary-foreground">
            <a href="https://maps.app.goo.gl/3S5WxWXwAi9S7ThK6" target="_blank" rel="noreferrer">Open in Google Maps</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
