import { useListProducts } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["All", "RC Cars", "Parts", "Accessories", "Apparel"];

export default function Shop() {
  const { data: products = [], isLoading } = useListProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-3">Pit Shop</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            High-performance RC cars, parts, and exclusive LA RC Cafe gear. Gear up before hitting the track.
          </p>
        </div>
        
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search parts, cars..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full md:w-[300px] rounded-none border-primary/20 focus-visible:ring-primary bg-card/50"
          />
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
            <Card key={product.id} className="rounded-none border-border/50 bg-card overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
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
                    <Badge variant="destructive" className="rounded-none uppercase tracking-widest font-bold">Out of Stock</Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="flex-1 pb-2">
                <div className="text-xs uppercase tracking-wider text-primary mb-1">{product.category}</div>
                <CardTitle className="text-lg line-clamp-2 leading-snug">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
              </CardHeader>
              
              <CardFooter className="pt-2 border-t border-border/30 bg-muted/5 flex items-center justify-between">
                <div className="font-bold text-xl">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>
                <Button 
                  size="sm" 
                  className="rounded-none uppercase tracking-widest text-[10px] font-bold"
                  disabled={!product.inStock}
                >
                  Buy
                </Button>
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
