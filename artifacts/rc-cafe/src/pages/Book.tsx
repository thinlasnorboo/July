import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBooking, useListServices } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, CarFront, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  experienceType: z.string({
    required_error: "Please select an experience.",
  }),
  specialRequests: z.string().optional(),
});

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", 
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

export default function Book() {
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const { data: services = [] } = useListServices();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    // API expects string date
    const payload = {
      ...data,
      date: format(data.date, "yyyy-MM-dd")
    };

    createBooking.mutate(
      { data: payload },
      {
        onSuccess: () => {
          toast({
            title: "Booking Confirmed",
            description: "Redirecting you to WhatsApp to confirm your slot!",
          });
          const d = form.getValues();
          const msg = encodeURIComponent(
            `Hi LA RC Cafe! I just booked a track slot.\n\nName: ${d.firstName} ${d.lastName}\nDate: ${format(d.date, "dd MMM yyyy")}\nTime: ${d.time}\nExperience: ${d.experienceType}\n\nPlease confirm my booking. Thank you!`
          );
          window.open(`https://wa.me/918082010443?text=${msg}`, "_blank");
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Could not complete reservation. Please try again.",
          });
        },
      }
    );
  };

  const trackServices = services.filter(s => s.category.includes("track") || s.category.includes("rental"));

  return (
    <div className="container py-12 md:py-20 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 uppercase">Reserve Track Time</h1>
        <p className="text-muted-foreground text-lg">Secure your spot on the grid. Bookings are recommended for weekends.</p>
      </div>

      <div className="bg-card border border-border/50 p-6 md:p-10 rounded-none shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold uppercase tracking-widest border-b border-border/50 pb-2">Driver Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lewis" {...field} className="bg-background/50 border-border/50 rounded-none h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Hamilton" {...field} className="bg-background/50 border-border/50 rounded-none h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="lewis@example.com" {...field} className="bg-background/50 border-border/50 rounded-none h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" {...field} className="bg-background/50 border-border/50 rounded-none h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-serif font-bold uppercase tracking-widest border-b border-border/50 pb-2">Session Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField
                  control={form.control}
                  name="experienceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Experience / Package</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50 rounded-none h-12">
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border/50">
                          {trackServices.length > 0 ? (
                            trackServices.map(s => (
                              <SelectItem key={s.id} value={s.name}>{s.name} - ₹{s.priceFrom}</SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="Track Session - 30 Min">Track Session (30 Min) - ₹150</SelectItem>
                              <SelectItem value="Track Session - 1 Hr">Track Session (1 Hr) - ₹250</SelectItem>
                              <SelectItem value="Basic Drift Rental">Basic Drift Rental - ₹150/15min</SelectItem>
                              <SelectItem value="4x4 Off-Road Rental">4x4 Off-Road Rental - ₹200/15min</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-background/50 border-border/50 rounded-none h-12",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-none border-border/50" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 rounded-none h-12">
                              <SelectValue placeholder="Time" />
                              <Clock className="ml-auto h-4 w-4 opacity-50" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-border/50 h-[200px]">
                            {TIME_SLOTS.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Special Requests / Group Info</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Need extra batteries? Bringing your own cars? Let us know."
                        className="resize-none bg-background/50 border-border/50 rounded-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/10 p-4 border border-border/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Payment is collected at the venue. Please arrive 15 minutes prior to your booking for briefing and gear setup.
              </p>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 rounded-none uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-lg group"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? "Processing..." : "Confirm Booking"}
              <CarFront className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
