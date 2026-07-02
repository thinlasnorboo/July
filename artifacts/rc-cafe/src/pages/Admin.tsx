import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { 
  useGetStats, 
  useListBookings, 
  useUpdateBooking, 
  useDeleteBooking,
  useListMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useListContactMessages
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  getListBookingsQueryKey, 
  getListMenuItemsQueryKey,
  getListProductsQueryKey
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { LogOut, Activity, Calendar, Package, Utensils, MessageSquare, Trash2, Edit2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!localStorage.getItem("rc_admin_token")) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("rc_admin_token");
    setLocation("/admin/login");
  };

  const { data: stats } = useGetStats();
  const { data: bookings = [] } = useListBookings();
  const { data: products = [] } = useListProducts();
  const { data: menuItems = [] } = useListMenuItems();
  const { data: messages = [] } = useListContactMessages();

  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  const handleUpdateBookingStatus = (id: number, status: string) => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Status Updated" });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      }
    });
  };

  const handleDeleteBooking = (id: number) => {
    if(confirm("Delete this booking?")) {
      deleteBooking.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Booking Deleted" });
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-card px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-bold text-lg tracking-widest text-primary uppercase">Pit Wall Control</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="uppercase tracking-widest text-xs font-bold text-muted-foreground hover:text-destructive rounded-none">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </header>

      <div className="flex-1 container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-auto p-0 mb-8 overflow-x-auto">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold">
              <Activity className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold">
              <Calendar className="w-4 h-4 mr-2" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold">
              <Package className="w-4 h-4 mr-2" /> Shop
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold">
              <Utensils className="w-4 h-4 mr-2" /> Menu
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-none border-border/50 bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Total Bookings</CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-serif">{stats?.totalBookings || 0}</div>
                </CardContent>
              </Card>
              <Card className="rounded-none border-border/50 bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Pending</CardTitle>
                  <Activity className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-serif text-amber-500">{stats?.pendingBookings || 0}</div>
                </CardContent>
              </Card>
              <Card className="rounded-none border-border/50 bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Products</CardTitle>
                  <Package className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-serif">{stats?.totalProducts || 0}</div>
                </CardContent>
              </Card>
              <Card className="rounded-none border-border/50 bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Active Members</CardTitle>
                  <Activity className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-serif">{stats?.memberCount || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="animate-in fade-in">
            <Card className="rounded-none border-border/50 bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/10 text-muted-foreground uppercase tracking-widest text-xs border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                      <th className="px-6 py-4 font-bold">Driver</th>
                      <th className="px-6 py-4 font-bold">Experience</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-muted/5">
                        <td className="px-6 py-4">
                          <div className="font-bold">{booking.date}</div>
                          <div className="text-xs text-muted-foreground">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold">{booking.firstName} {booking.lastName}</div>
                          <div className="text-xs text-muted-foreground">{booking.phone}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">{booking.experienceType}</td>
                        <td className="px-6 py-4">
                          <Badge className="rounded-none uppercase tracking-widest text-[10px]" variant={
                            booking.status === "confirmed" ? "default" : 
                            booking.status === "cancelled" ? "destructive" : "secondary"
                          }>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {booking.status === "pending" && (
                            <Button size="sm" variant="outline" className="h-8 rounded-none text-xs uppercase" onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}>
                              Confirm
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteBooking(booking.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
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
              {messages.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border/50">
                  No messages yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Simple placeholders for Menu/Shop CRUD to meet requirements without huge forms */}
          <TabsContent value="products" className="animate-in fade-in">
            <Card className="rounded-none border-border/50 bg-card p-6 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Shop Inventory</h3>
              <p className="text-muted-foreground mb-4">Manage parts, cars, and apparel here.</p>
              <Button className="rounded-none uppercase tracking-widest font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
              <div className="mt-8 text-left border-t border-border/50 pt-8">
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-3 border-b border-border/20">
                    <div>
                      <span className="font-bold">{p.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground uppercase">{p.category}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="font-serif">₹{p.price}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none"><Edit2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="animate-in fade-in">
            <Card className="rounded-none border-border/50 bg-card p-6 text-center">
              <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Cafe Menu</h3>
              <p className="text-muted-foreground mb-4">Manage food and drinks available at the cafe.</p>
              <Button className="rounded-none uppercase tracking-widest font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Menu Item
              </Button>
              <div className="mt-8 text-left border-t border-border/50 pt-8">
                {menuItems.map(m => (
                  <div key={m.id} className="flex justify-between items-center py-3 border-b border-border/20">
                    <div>
                      <span className="font-bold">{m.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground uppercase">{m.category}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="font-serif">₹{m.price}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none"><Edit2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
