import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, Link } from "wouter";
import { CheckCircle2, Building2, ShoppingCart, Truck, Zap, Copy, MessageCircle } from "lucide-react";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka",
  "Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

type BankDetails = {
  accountNo: string; holderName: string; ifscCode: string; bankName: string; upiId?: string | null;
};

type ShippingForm = {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; postalCode: string;
};

const emptyForm: ShippingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", state: "", postalCode: "",
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingForm>(emptyForm);
  const [delivery, setDelivery] = useState<"free" | "fast">("free");
  const [payment, setPayment] = useState<"bank">("bank");
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [ordered, setOrdered] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/bank-details")
      .then((r) => r.json())
      .then(setBankDetails)
      .catch(() => {});
  }, []);

  const deliveryFee = delivery === "fast" ? 1500 : total >= 14999 ? 0 : 0;
  const grandTotal = total + deliveryFee;

  function handleShippingNext(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function handlePlaceOrder() {
    setOrdered(true);
    clearCart();
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  function sendWhatsApp() {
    const lines = [
      `🛒 *New Order from LA RC Cafe*`,
      ``,
      `*Customer:* ${shipping.firstName} ${shipping.lastName}`,
      `*Phone:* ${shipping.phone}`,
      `*Email:* ${shipping.email}`,
      `*Address:* ${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.postalCode}`,
      ``,
      `*Items:*`,
      ...items.map((i) => `• ${i.name} x${i.quantity} = ₹${(i.price * i.quantity).toLocaleString("en-IN")}`),
      ``,
      `*Delivery:* ${delivery === "fast" ? "Fast Shipping (1-3 days) - ₹1,500" : "Standard Free Shipping (3-5 days)"}`,
      `*Grand Total:* ₹${grandTotal.toLocaleString("en-IN")}`,
      `*Payment:* Bank Transfer`,
    ];
    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/918082010443?text=${msg}`, "_blank");
  }

  if (items.length === 0 && !ordered) {
    return (
      <div className="container py-24 flex flex-col items-center text-center min-h-[60vh]">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold font-serif mb-3">Your cart is empty</h1>
        <Button asChild className="rounded-none uppercase tracking-widest font-bold px-8 mt-4">
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="container py-16 max-w-2xl">
        <div className="bg-card border border-primary/30 p-8 text-center mb-8">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-serif mb-2">Order Placed!</h1>
          <p className="text-muted-foreground">
            Please complete your payment via bank transfer and send us confirmation on WhatsApp.
          </p>
        </div>

        {bankDetails && (
          <div className="bg-card border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Bank Transfer Details</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Account Holder", value: bankDetails.holderName, key: "name" },
                { label: "Account Number", value: bankDetails.accountNo, key: "acc" },
                { label: "IFSC Code", value: bankDetails.ifscCode, key: "ifsc" },
                { label: "Bank Name", value: bankDetails.bankName, key: "bank" },
                ...(bankDetails.upiId ? [{ label: "UPI ID", value: bankDetails.upiId, key: "upi" }] : []),
              ].map(({ label, value, key }) => (
                <div key={key} className="flex items-center justify-between border-b border-border/20 pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="font-bold font-mono">{value}</p>
                  </div>
                  <button
                    onClick={() => copyText(value, key)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    {copied === key ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-bold uppercase tracking-wider">
                Amount to Transfer: ₹{grandTotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={sendWhatsApp}
          className="w-full rounded-none uppercase tracking-widest font-bold text-sm bg-green-700 hover:bg-green-600 mb-3"
        >
          <MessageCircle className="w-4 h-4 mr-2" /> Send Payment Confirmation on WhatsApp
        </Button>
        <Button asChild variant="outline" className="w-full rounded-none uppercase tracking-widest text-xs">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <nav className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          <Link href="/">Home</Link> &rsaquo; <Link href="/cart">Cart</Link> &rsaquo; Checkout
        </nav>
        <h1 className="text-4xl font-bold font-serif">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your order securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step Indicators */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            {[1, 2, 3].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center font-bold text-[10px] border ${step >= s ? "bg-primary border-primary text-primary-foreground" : "border-border/50 text-muted-foreground"}`}>{s}</span>
                <span className={step >= s ? "text-foreground" : "text-muted-foreground"}>
                  {["Shipping", "Delivery", "Payment"][i]}
                </span>
                {i < 2 && <span className="text-border mx-1">›</span>}
              </span>
            ))}
          </div>

          {/* ─── Step 1: Shipping ─── */}
          {step === 1 && (
            <form onSubmit={handleShippingNext} className="bg-card border border-border/50 p-6 space-y-4">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Step 1 — Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">First Name *</Label>
                  <Input className="rounded-none" required value={shipping.firstName} onChange={e => setShipping(f => ({ ...f, firstName: e.target.value }))} placeholder="Rahul" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Last Name</Label>
                  <Input className="rounded-none" value={shipping.lastName} onChange={e => setShipping(f => ({ ...f, lastName: e.target.value }))} placeholder="Sharma" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Email *</Label>
                  <Input className="rounded-none" type="email" required value={shipping.email} onChange={e => setShipping(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Phone *</Label>
                  <Input className="rounded-none" required value={shipping.phone} onChange={e => setShipping(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxxxxxxx" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Address *</Label>
                <Input className="rounded-none" required value={shipping.address} onChange={e => setShipping(f => ({ ...f, address: e.target.value }))} placeholder="House/Flat, Street, Area" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">City *</Label>
                  <Input className="rounded-none" required value={shipping.city} onChange={e => setShipping(f => ({ ...f, city: e.target.value }))} placeholder="Leh" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">State *</Label>
                  <select required className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={shipping.state} onChange={e => setShipping(f => ({ ...f, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Postal Code *</Label>
                  <Input className="rounded-none" required value={shipping.postalCode} onChange={e => setShipping(f => ({ ...f, postalCode: e.target.value }))} placeholder="194101" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Country</Label>
                  <Input className="rounded-none bg-muted/10 text-muted-foreground" value="India (IN)" readOnly />
                </div>
              </div>
              <Button type="submit" className="rounded-none uppercase tracking-widest font-bold w-full mt-2">Continue to Delivery</Button>
            </form>
          )}

          {/* ─── Step 2: Delivery ─── */}
          {step === 2 && (
            <div className="bg-card border border-border/50 p-6 space-y-4">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Step 2 — Delivery Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between border p-4 cursor-pointer transition-colors ${delivery === "free" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" value="free" checked={delivery === "free"} onChange={() => setDelivery("free")} className="accent-primary" />
                    <div>
                      <p className="font-bold text-sm">Standard Free Shipping</p>
                      <p className="text-xs text-muted-foreground">3-5 days · Free delivery across India</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-500">Free</span>
                </label>
                <label className={`flex items-center justify-between border p-4 cursor-pointer transition-colors ${delivery === "fast" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" value="fast" checked={delivery === "fast"} onChange={() => setDelivery("fast")} className="accent-primary" />
                    <div>
                      <p className="font-bold text-sm">Fast Shipping</p>
                      <p className="text-xs text-muted-foreground">1-3 days · Priority delivery</p>
                    </div>
                  </div>
                  <span className="font-bold">₹1,500</span>
                </label>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs" onClick={() => setStep(1)}>Back</Button>
                <Button className="rounded-none uppercase tracking-widest font-bold flex-1" onClick={() => setStep(3)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Payment ─── */}
          {step === 3 && (
            <div className="bg-card border border-border/50 p-6 space-y-4">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Step 3 — Payment Method
              </h2>
              <label className="flex items-start gap-3 border border-primary bg-primary/5 p-4 cursor-pointer">
                <input type="radio" name="payment" value="bank" checked readOnly className="accent-primary mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">Place order now, transfer payment after.</p>
                </div>
              </label>

              {bankDetails && (
                <div className="border border-border/50 p-4 bg-muted/5 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Bank Account Details</p>
                  {[
                    { label: "Account Holder", value: bankDetails.holderName },
                    { label: "Account Number", value: bankDetails.accountNo },
                    { label: "IFSC Code", value: bankDetails.ifscCode },
                    { label: "Bank Name", value: bankDetails.bankName },
                    ...(bankDetails.upiId ? [{ label: "UPI ID", value: bankDetails.upiId }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm py-1 border-b border-border/20">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-bold font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handlePlaceOrder} className="rounded-none uppercase tracking-widest font-bold flex-1 bg-primary hover:bg-primary/90">
                  Place Order — ₹{grandTotal.toLocaleString("en-IN")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/50 p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-muted/10 flex-shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1 mix-blend-screen" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border/30 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={deliveryFee === 0 ? "text-green-500" : ""}>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toLocaleString("en-IN")}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border/30 pt-2 mt-2">
                <span>Payable Now</span>
                <span className="text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
