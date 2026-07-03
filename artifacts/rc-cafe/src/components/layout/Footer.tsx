import { Link } from "wouter";
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="LA RC Cafe" className="h-12 w-12 rounded-full object-cover border border-primary/20" />
              <span className="font-serif text-xl font-bold tracking-wider text-primary">LA RC CAFE</span>
            </div>
            <p className="text-muted-foreground text-sm">
              India's premier RC car racing cafe. Race, relax, and repeat.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://wa.me/918082010443" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
              <Link href="/book" className="hover:text-primary transition-colors">Book Now</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/3S5WxWXwAi9S7ThK6" target="_blank" rel="noreferrer" className="hover:text-primary">
                  LA RC Cafe, India
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+919622340933" className="hover:text-primary">+91 96223 40933</a>
              </li>
              <li className="flex items-center gap-3">
                <SiWhatsapp className="h-4 w-4 text-primary shrink-0" />
                <a href="https://wa.me/918082010443" target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp Us</a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground">Hours</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Mon-Thu: 10:00 - 22:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Fri-Sat: 09:00 - 00:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Sun: 09:00 - 22:00</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LA RC Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
