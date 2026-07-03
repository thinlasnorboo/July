import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  useGetStats,
  useListBookings, useUpdateBooking, useDeleteBooking,
  useListMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem,
  useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useListContactMessages,
  getListBookingsQueryKey, getListMenuItemsQueryKey, getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  LogOut, Activity, Calendar, Package, Utensils, MessageSquare,
  Trash2, Edit2, Plus, X, Images, CheckCircle2, XCircle, Link2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: number; name: string; description: string; price: number;
  category: string; featured: boolean; inStock: boolean; stock: number;
  imageUrl: string | null;
};
type Slide = { id: number; imageUrl: string; title: string; subtitle: string; sortOrder: number; active: boolean };

// ─── Reusable dialog-like overlay ─────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="font-bold uppercase tracking-widest text-sm">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
const PRODUCT_CATEGORIES = ["RC Cars", "Parts", "Accessories", "Apparel", "Other"];

function ProductForm({ initial, onSave, onCancel }: {
  initial?: Partial<Product>;
  onSave: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: String(initial?.price ?? ""),
    category: initial?.category ?? "RC Cars",
    featured: initial?.featured ?? false,
    inStock: initial?.inStock ?? true,
    stock: String(initial?.stock ?? "0"),
    imageUrl: initial?.imageUrl ?? "",
  });

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onSave({
      name: form.name,
      description: form.description,
      price: parseInt(form.price) || 0,
      category: form.category,
      featured: form.featured,
      inStock: form.inStock,
      stock: parseInt(form.stock) || 0,
      imageUrl: form.imageUrl || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Product Name *</Label>
        <Input className="rounded-none" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Drift RC Car" />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Description</Label>
        <Input className="rounded-none" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Price (₹) *</Label>
          <Input className="rounded-none" type="number" value={form.price} onChange={e => set("price", e.target.value)} required min={0} placeholder="0" />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Stock Qty</Label>
          <Input className="rounded-none" type="number" value={form.stock} onChange={e => set("stock", e.target.value)} min={0} placeholder="0" />
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Category</Label>
        <select
          className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          value={form.category}
          onChange={e => set("category", e.target.value)}
        >
          {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block flex items-center gap-1">
          <Link2 className="w-3 h-3" /> Image URL
        </Label>
        <Input
          className="rounded-none"
          value={form.imageUrl}
          onChange={e => set("imageUrl", e.target.value)}
          placeholder="https://... (paste image link)"
        />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-full object-cover border border-border/30" onError={e => (e.currentTarget.style.display = "none")} />
        )}
      </div>
      <div className="flex gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="accent-primary" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.inStock} onChange={e => set("inStock", e.target.checked)} className="accent-primary" />
          In Stock
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="rounded-none uppercase tracking-widest text-xs font-bold flex-1 bg-primary hover:bg-primary/90">Save Product</Button>
        <Button type="button" variant="outline" className="rounded-none uppercase tracking-widest text-xs" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Slide Form ───────────────────────────────────────────────────────────────
function SlideForm({ initial, onSave, onCancel }: {
  initial?: Partial<Slide>;
  onSave: (data: Omit<Slide, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    imageUrl: initial?.imageUrl ?? "",
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    sortOrder: String(initial?.sortOrder ?? "0"),
    active: initial?.active ?? true,
  });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) return;
    onSave({ imageUrl: form.imageUrl, title: form.title, subtitle: form.subtitle, sortOrder: parseInt(form.sortOrder) || 0, active: form.active });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block flex items-center gap-1">
          <Link2 className="w-3 h-3" /> Image URL *
        </Label>
        <Input className="rounded-none" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} required placeholder="https://... image link" />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" className="mt-2 h-32 w-full object-cover border border-border/30" onError={e => (e.currentTarget.style.display = "none")} />
        )}
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Heading Text</Label>
        <Input className="rounded-none" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Race. Relax. Repeat." />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Subheading Text</Label>
        <Input className="rounded-none" value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="India's Premier RC Experience" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Order (0 = first)</Label>
          <Input className="rounded-none" type="number" value={form.sortOrder} onChange={e => set("sortOrder", e.target.value)} min={0} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="accent-primary" />
            Visible on site
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="rounded-none uppercase tracking-widest text-xs font-bold flex-1 bg-primary hover:bg-primary/90">Save Slide</Button>
        <Button type="button" variant="outline" className="rounded-none uppercase tracking-widest text-xs" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!localStorage.getItem("rc_admin_token")) setLocation("/admin/login");
  }, [setLocation]);

  const handleLogout = () => { localStorage.removeItem("rc_admin_token"); setLocation("/admin/login"); };

  const { data: stats } = useGetStats();
  const { data: bookings = [] } = useListBookings();
  const { data: products = [] } = useListProducts();
  const { data: menuItems = [] } = useListMenuItems();
  const { data: messages = [] } = useListContactMessages();

  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  // Slides state (manual fetch, no codegen needed)
  const [slides, setSlides] = useState<Slide[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const fetchSlides = () => { setSlidesLoading(true); fetch("/api/slides").then(r => r.json()).then(setSlides).finally(() => setSlidesLoading(false)); };
  useEffect(() => { if (activeTab === "slides") fetchSlides(); }, [activeTab]);

  // Product modal state
  const [productModal, setProductModal] = useState<{ mode: "add" | "edit"; product?: Product } | null>(null);
  // Menu modal state
  const [menuModal, setMenuModal] = useState<{ mode: "add" | "edit"; item?: typeof menuItems[0] } | null>(null);
  // Slide modal state
  const [slideModal, setSlideModal] = useState<{ mode: "add" | "edit"; slide?: Slide } | null>(null);

  // ── Booking handlers ──
  const handleUpdateBookingStatus = (id: number, status: string) => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => { toast({ title: "Status Updated" }); queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() }); }
    });
  };
  const handleDeleteBooking = (id: number) => {
    if (!confirm("Delete this booking?")) return;
    deleteBooking.mutate({ id }, { onSuccess: () => { toast({ title: "Booking Deleted" }); queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() }); } });
  };

  // ── Product handlers ──
  const handleSaveProduct = (data: Omit<Product, "id">) => {
    const payload = { ...data, imageUrl: data.imageUrl ?? undefined };
    if (productModal?.mode === "edit" && productModal.product) {
      updateProduct.mutate({ id: productModal.product.id, data: payload }, {
        onSuccess: () => { toast({ title: "Product Updated" }); queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); setProductModal(null); }
      });
    } else {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => { toast({ title: "Product Added" }); queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); setProductModal(null); }
      });
    }
  };
  const handleDeleteProduct = (id: number) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct.mutate({ id }, { onSuccess: () => { toast({ title: "Product Deleted" }); queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); } });
  };

  // ── Menu handlers ──
  const MENU_CATEGORIES = ["coffee","cold_drinks","snacks","pizza","rc_track","rc_rental","combo"] as const;
  type MenuCat = typeof MENU_CATEGORIES[number];
  const [menuForm, setMenuForm] = useState({ name: "", description: "", price: "", category: "coffee" as MenuCat, featured: false });

  const handleSaveMenu = () => {
    if (!menuForm.name || !menuForm.price) return;
    const data = { name: menuForm.name, description: menuForm.description, price: parseInt(menuForm.price) || 0, category: menuForm.category as MenuCat, featured: menuForm.featured };
    if (menuModal?.mode === "edit" && menuModal.item) {
      updateMenuItem.mutate({ id: menuModal.item.id, data }, {
        onSuccess: () => { toast({ title: "Item Updated" }); queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() }); setMenuModal(null); }
      });
    } else {
      createMenuItem.mutate({ data }, {
        onSuccess: () => { toast({ title: "Item Added" }); queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() }); setMenuModal(null); }
      });
    }
  };
  const handleDeleteMenu = (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    deleteMenuItem.mutate({ id }, { onSuccess: () => { toast({ title: "Item Deleted" }); queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() }); } });
  };

  // ── Slide handlers ──
  const token = localStorage.getItem("rc_admin_token") ?? "";
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const handleSaveSlide = async (data: Omit<Slide, "id">) => {
    const url = slideModal?.mode === "edit" && slideModal.slide ? `/api/slides/${slideModal.slide.id}` : "/api/slides";
    const method = slideModal?.mode === "edit" ? "PATCH" : "POST";
    await fetch(url, { method, headers: authHeader, body: JSON.stringify(data) });
    toast({ title: slideModal?.mode === "edit" ? "Slide Updated" : "Slide Added" });
    setSlideModal(null);
    fetchSlides();
  };
  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/slides/${id}`, { method: "DELETE", headers: authHeader });
    toast({ title: "Slide Deleted" });
    fetchSlides();
  };
  const handleToggleSlide = async (slide: Slide) => {
    await fetch(`/api/slides/${slide.id}`, { method: "PATCH", headers: authHeader, body: JSON.stringify({ active: !slide.active }) });
    fetchSlides();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Modals */}
      {productModal && (
        <Modal title={productModal.mode === "add" ? "Add New Product" : "Edit Product"} onClose={() => setProductModal(null)}>
          <ProductForm initial={productModal.product} onSave={handleSaveProduct} onCancel={() => setProductModal(null)} />
        </Modal>
      )}
      {menuModal && (
        <Modal title={menuModal.mode === "add" ? "Add Menu Item" : "Edit Menu Item"} onClose={() => setMenuModal(null)}>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Name *</Label>
              <Input className="rounded-none" value={menuForm.name} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Description</Label>
              <Input className="rounded-none" value={menuForm.description} onChange={e => setMenuForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Price (₹)</Label>
                <Input className="rounded-none" type="number" value={menuForm.price} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))} min={0} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Category</Label>
                <select className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm" value={menuForm.category} onChange={e => setMenuForm(f => ({ ...f, category: e.target.value as MenuCat }))}>
                  {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c.replace("_"," ")}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={menuForm.featured} onChange={e => setMenuForm(f => ({ ...f, featured: e.target.checked }))} className="accent-primary" />
              Featured item
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSaveMenu} className="rounded-none uppercase tracking-widest text-xs font-bold flex-1 bg-primary hover:bg-primary/90">Save Item</Button>
              <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs" onClick={() => setMenuModal(null)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
      {slideModal && (
        <Modal title={slideModal.mode === "add" ? "Add Hero Slide" : "Edit Slide"} onClose={() => setSlideModal(null)}>
          <SlideForm initial={slideModal.slide} onSave={handleSaveSlide} onCancel={() => setSlideModal(null)} />
        </Modal>
      )}

      {/* Header */}
      <header className="border-b border-border/50 bg-card px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-bold text-lg tracking-widest text-primary uppercase">Pit Wall Control</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="uppercase tracking-widest text-xs font-bold text-muted-foreground hover:text-destructive rounded-none">
          <LogOut className="w-4 h-4 mr-2" /> Disconnect
        </Button>
      </header>

      <div className="flex-1 container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-auto p-0 mb-8 overflow-x-auto">
            {[
              { value: "overview", icon: <Activity className="w-4 h-4 mr-2" />, label: "Overview" },
              { value: "bookings", icon: <Calendar className="w-4 h-4 mr-2" />, label: "Bookings" },
              { value: "products", icon: <Package className="w-4 h-4 mr-2" />, label: "Shop" },
              { value: "menu", icon: <Utensils className="w-4 h-4 mr-2" />, label: "Menu" },
              { value: "slides", icon: <Images className="w-4 h-4 mr-2" />, label: "Slider" },
              { value: "messages", icon: <MessageSquare className="w-4 h-4 mr-2" />, label: "Messages" },
            ].map(t => (
              <TabsTrigger key={t.value} value={t.value} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-5 py-3 uppercase tracking-widest text-xs font-bold whitespace-nowrap flex items-center">
                {t.icon}{t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: <Calendar className="w-4 h-4 text-primary" /> },
                { label: "Pending", value: stats?.pendingBookings ?? 0, icon: <Activity className="w-4 h-4 text-amber-500" />, color: "text-amber-500" },
                { label: "Products", value: stats?.totalProducts ?? 0, icon: <Package className="w-4 h-4 text-primary" /> },
                { label: "Active Members", value: stats?.memberCount ?? 0, icon: <Activity className="w-4 h-4 text-primary" /> },
              ].map(s => (
                <Card key={s.label} className="rounded-none border-border/50 bg-card">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</CardTitle>{s.icon}</CardHeader>
                  <CardContent><div className={`text-3xl font-bold font-serif ${s.color ?? ""}`}>{s.value}</div></CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Bookings ── */}
          <TabsContent value="bookings" className="animate-in fade-in">
            <Card className="rounded-none border-border/50 bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/10 text-muted-foreground uppercase tracking-widest text-xs border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-muted/5">
                        <td className="px-6 py-4"><div className="font-bold">{b.date}</div><div className="text-xs text-muted-foreground">{b.time}</div></td>
                        <td className="px-6 py-4"><div className="font-bold">{b.firstName} {b.lastName}</div><div className="text-xs text-muted-foreground">{b.phone}</div></td>
                        <td className="px-6 py-4">{b.experienceType}</td>
                        <td className="px-6 py-4">
                          <Badge className="rounded-none uppercase tracking-widest text-[10px]" variant={b.status === "confirmed" ? "default" : b.status === "cancelled" ? "destructive" : "secondary"}>{b.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {b.status === "pending" && (
                            <Button size="sm" variant="outline" className="h-8 rounded-none text-xs uppercase" onClick={() => handleUpdateBookingStatus(b.id, "confirmed")}>Confirm</Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteBooking(b.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No bookings yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* ── Shop / Products ── */}
          <TabsContent value="products" className="animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold uppercase tracking-widest text-sm">Shop Inventory ({products.length} items)</h2>
              <Button className="rounded-none uppercase tracking-widest text-xs font-bold bg-primary hover:bg-primary/90" onClick={() => setProductModal({ mode: "add" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <Card key={p.id} className="rounded-none border-border/50 bg-card overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-36 object-cover border-b border-border/30" />
                  ) : (
                    <div className="w-full h-36 bg-muted/20 border-b border-border/30 flex items-center justify-center">
                      <Package className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-bold leading-tight">{p.name}</span>
                      <span className="font-serif font-bold text-primary whitespace-nowrap">₹{p.price}</span>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</span>
                      <span className={`text-xs font-bold ${p.inStock ? "text-green-500" : "text-destructive"}`}>{p.inStock ? `In Stock (${p.stock})` : "Out of Stock"}</span>
                      {p.featured && <span className="text-xs bg-primary/20 text-primary px-1">Featured</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-none text-xs flex-1" onClick={() => { setProductModal({ mode: "edit", product: p as Product }); }}>
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Menu ── */}
          <TabsContent value="menu" className="animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold uppercase tracking-widest text-sm">Cafe Menu ({menuItems.length} items)</h2>
              <Button className="rounded-none uppercase tracking-widest text-xs font-bold bg-primary hover:bg-primary/90" onClick={() => { setMenuForm({ name: "", description: "", price: "", category: "coffee", featured: false }); setMenuModal({ mode: "add" }); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
            <Card className="rounded-none border-border/50 bg-card divide-y divide-border/20">
              {menuItems.map(m => (
                <div key={m.id} className="flex justify-between items-center px-6 py-3 hover:bg-muted/5">
                  <div>
                    <span className="font-bold">{m.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">{m.category.replace("_"," ")}</span>
                    {m.featured && <span className="ml-2 text-xs bg-primary/20 text-primary px-1">Featured</span>}
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="font-serif font-bold text-primary">₹{m.price}</span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none" onClick={() => { setMenuForm({ name: m.name, description: m.description, price: String(m.price), category: m.category as MenuCat, featured: m.featured }); setMenuModal({ mode: "edit", item: m }); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMenu(m.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {menuItems.length === 0 && <div className="px-6 py-8 text-center text-muted-foreground">No menu items yet.</div>}
            </Card>
          </TabsContent>

          {/* ── Hero Slider ── */}
          <TabsContent value="slides" className="animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold uppercase tracking-widest text-sm">Homepage Slider ({slides.length} slides)</h2>
              <Button className="rounded-none uppercase tracking-widest text-xs font-bold bg-primary hover:bg-primary/90" onClick={() => setSlideModal({ mode: "add" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Slide
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mb-6">Paste any image URL (Google Photos, Unsplash, your own hosting, etc.) to set as a hero slide.</p>
            {slidesLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slides.map(slide => (
                  <Card key={slide.id} className="rounded-none border-border/50 bg-card overflow-hidden">
                    <div className="relative">
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-40 object-cover" onError={e => { e.currentTarget.src = ""; e.currentTarget.className = "hidden"; }} />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold uppercase ${slide.active ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>
                        {slide.active ? "Live" : "Hidden"}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm leading-tight mb-1 truncate">{slide.title || "(No heading)"}</p>
                      <p className="text-xs text-muted-foreground mb-3 truncate">{slide.subtitle || "(No subheading)"}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 rounded-none text-xs flex-1" onClick={() => setSlideModal({ mode: "edit", slide })}>
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className={`h-8 w-8 p-0 rounded-none ${slide.active ? "text-amber-500 hover:bg-amber-500/10" : "text-green-500 hover:bg-green-500/10"}`} onClick={() => handleToggleSlide(slide)} title={slide.active ? "Hide slide" : "Show slide"}>
                          {slide.active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSlide(slide.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {slides.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border/50">
                    No slides yet. Click "Add Slide" to add your first hero image.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ── Messages ── */}
          <TabsContent value="messages" className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map(msg => (
                <Card key={msg.id} className="rounded-none border-border/50 bg-card">
                  <CardHeader className="pb-2 border-b border-border/20">
                    <CardTitle className="text-base font-bold">{msg.subject || "No Subject"}</CardTitle>
                    <div className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), "PP p")}</div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm">{msg.message}</p>
                    <div className="text-xs text-muted-foreground border-t border-border/20 pt-2">
                      <span className="font-bold text-foreground">{msg.name}</span> &bull; {msg.email}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {messages.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border/50">No messages yet.</div>}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
