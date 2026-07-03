import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold font-serif mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some RC gear before heading to checkout.</p>
        <Button asChild className="rounded-none uppercase tracking-widest font-bold px-8">
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl font-bold font-serif tracking-tight mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-card border border-border/50 p-4"
            >
              {/* Image */}
              <div className="w-24 h-24 bg-muted/10 flex items-center justify-center flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain p-2 mix-blend-screen"
                  />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold leading-snug line-clamp-2">{item.name}</h3>
                <p className="text-primary font-bold text-lg mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Qty + Remove */}
              <div className="flex flex-col items-end justify-between gap-3">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-border/50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 hover:bg-muted/10 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 py-1 text-sm font-bold min-w-[2rem] text-center border-x border-border/50">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-2 py-1 hover:bg-muted/10 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-bold text-right">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/50 p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button asChild className="w-full rounded-none uppercase tracking-widest font-bold text-sm">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-none uppercase tracking-widest font-bold text-xs mt-3"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
