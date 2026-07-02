import { useListGalleryItems } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { data: gallery = [], isLoading } = useListGalleryItems();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(gallery.map(item => item.category)))];

  const filteredItems = activeCategory === "All" 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4">Track Action</h1>
        <p className="text-muted-foreground text-lg">
          Highlights from the pits, the track, and the cafe.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            onClick={() => setActiveCategory(cat)}
            className="rounded-none uppercase tracking-wider text-xs border-border/50"
          >
            {cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="break-inside-avoid bg-card border border-border/50 p-2 animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="break-inside-avoid group relative overflow-hidden bg-card border border-border/20">
              <div className="relative overflow-hidden">
                <img 
                  src={item.imageUrl || `https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop&random=${item.id}`} 
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs uppercase tracking-widest text-primary font-bold mb-1">{item.category}</span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
