import { useListProducts } from "@workspace/api-client-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "RC Cars", "Parts", "Accessories", "Apparel", "Other"];

function QuantitySelector({ stock, onAdd }: { stock: number; onAdd: (qty: number) => void }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex items-center border border-border/50">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-1 hover:bg-muted/10 transition-colors">
          <Minus className="w-3 h-3" />
        </button>
        <span className="px-3 py-1 text-sm font-bold min-w-[2rem] text-center border-x border-border/50">{qty}</span>
        <button onClick={() => setQty(q => Math.min(stock, q + 1))} disabled={qty >= stock} className="px-2 py-1 hover:bg-muted/10 transition-colors disabled:opacity-40">
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <Button
        size="sm"
        className="rounded-none uppercase tracking-widest text-[10px] font-bold flex-1 bg-primary hover:bg-primary/90"
        onClick={() => onAdd(qty)}
      >
        <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
      </Button>
    </div>
  );
}

export default function Shop() {
  const { data: products = [], isLoading } = useListProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart, itemCount } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleAddToCart(product: typeof products[0], qty: number = 1) {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl ?? null,
        stock: product.stock,
      });
    }
    setAddedIds(s => new Set(s).add(product.id));
    setTimeout(() => setAddedIds(s => { const n = new Set(s); n.delete(product.id); return n; }), 2000);
    toast({
      title: "Added to Cart",
      description: `${product.name} × ${qty}`,
    });
  }

  function handleBuyNow(product: typeof products[0]) {
    handleAddToCart(product, 1);
    setLocation("/cart");
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-3">Pit Shop</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            High-performance RC cars, parts, and exclusive LA RC Cafe gear. Gear up before hitting the track.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cart button */}
          <Button asChild variant="outline" className="rounded-none relative border-primary/30">
            <a href="/cart">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </a>
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search parts, cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 w-full md:w-[240px] rounded-none border-primary/20 focus-visible:ring-primary bg-card/50"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            onClick={() => setActiveCategory(cat)}
            className="rounded-none uppercase tracking-wider text-xs h-10 border-primary/20"
          >
            {cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="rounded-none border-border/50 animate-pulse bg-card/30">
              <div className="h-48 bg-muted/20" />
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted/40 w-1/3" />
                <div className="h-5 bg-muted/40 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted/30 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="rounded-none border-border/50 bg-card overflow-hidden group hover:border-primary/50 transition-colors flex flex-col"
            >
              <div className="aspect-square bg-muted/10 relative overflow-hidden flex items-center justify-center p-6">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
                )}
                {product.featured && (
                  <Badge className="absolute top-3 right-3 rounded-none bg-primary hover:bg-primary uppercase tracking-widest text-[10px]">
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Badge variant="destructive" className="rounded-none uppercase tracking-widest font-bold">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="flex-1 pb-2">
                <div className="text-xs uppercase tracking-wider text-primary mb-1">{product.category}</div>
                <CardTitle className="text-lg line-clamp-2 leading-snug">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
              </CardHeader>

              <CardFooter className="pt-2 border-t border-border/30 bg-muted/5 flex flex-col items-stretch gap-2 pb-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xl">₹{product.price.toLocaleString("en-IN")}</div>
                  {product.inStock && product.stock <= 3 && (
                    <span className="text-xs text-amber-500 font-bold">Only {product.stock} left!</span>
                  )}
                </div>

                {product.inStock ? (
                  <>
                    <QuantitySelector
                      stock={product.stock}
                      onAdd={(qty) => handleAddToCart(product, qty)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none uppercase tracking-widest text-[10px] font-bold w-full border-primary/30 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleBuyNow(product)}
                    >
                      {addedIds.has(product.id) ? (
                        <><Check className="w-3 h-3 mr-1 text-green-500" /> Added!</>
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="rounded-none uppercase tracking-widest text-[10px] font-bold w-full" disabled>
                    Out of Stock
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border/50">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Parts Found</h3>
          <p className="text-muted-foreground">Check back later or try a different search.</p>
        </div>
      )}
    </div>
  );
}
