import { useListMenuItems } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Coffee, Pizza, Cookie, Zap, Flame } from "lucide-react";

export default function Menu() {
  const { data: menuItems = [], isLoading } = useListMenuItems();

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Sort categories logically
  const order = ["coffee", "cold_drinks", "snacks", "pizza", "rc_track", "rc_rental", "combo"];
  const sortedCategories = Object.keys(groupedMenu).sort((a, b) => order.indexOf(a) - order.indexOf(b));

  const formatCategoryName = (cat: string) => {
    return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'coffee': return <Coffee className="w-8 h-8 text-primary/40" />;
      case 'cold_drinks': return <Zap className="w-8 h-8 text-primary/40" />;
      case 'pizza': return <Pizza className="w-8 h-8 text-primary/40" />;
      case 'snacks': return <Cookie className="w-8 h-8 text-primary/40" />;
      default: return <Flame className="w-8 h-8 text-primary/40" />;
    }
  };

  return (
    <div className="container py-12 md:py-20 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">Fuel Station</h1>
        <p className="text-muted-foreground text-lg uppercase tracking-widest">
          Grind. Race. Sip. Repeat.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-muted/20 w-48 mb-6 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between border-b border-border/30 pb-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted/30 w-32" />
                      <div className="h-3 bg-muted/20 w-48" />
                    </div>
                    <div className="h-5 bg-muted/30 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-20">
          {sortedCategories.map((category) => (
            <section key={category} className="relative">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-primary/50"></div>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-widest">{formatCategoryName(category)}</h2>
                </div>
                <div className="h-[1px] w-12 bg-primary/50"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {groupedMenu[category].map((item) => (
                  <div key={item.id} className="group relative flex flex-col justify-between border-b border-border/20 pb-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
                        {item.name}
                        {item.featured && <Badge className="rounded-none bg-primary/20 text-primary hover:bg-primary/30 uppercase text-[9px] px-1.5 py-0">Hot</Badge>}
                      </h3>
                      <div className="font-serif text-xl font-bold text-primary shrink-0">
                        ₹{item.price}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground pr-12 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
