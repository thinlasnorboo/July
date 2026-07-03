import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  const links = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Services", href: "/services" },
    { label: "Menu", href: "/menu" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="LA RC Cafe" className="h-10 w-10 rounded-full object-cover border border-primary/20" />
          <span className="font-serif text-lg font-bold tracking-wider text-primary">LA RC CAFE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <Button asChild className="ml-2 font-bold tracking-wide uppercase rounded-none">
            <Link href="/book">Book Now</Link>
          </Button>
        </div>

        {/* Mobile: cart + menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-b bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-2 font-bold uppercase rounded-none">
            <Link href="/book" onClick={() => setMobileOpen(false)}>Book Now</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
