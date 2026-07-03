import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const contactMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "We've received your message and will get back to you shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send message. Please try again or call us.",
          });
        },
      }
    );
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4">Contact Pit Crew</h1>
        <p className="text-muted-foreground text-lg">
          Questions about track rules, private events, or RC repairs? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-card border border-border/50 p-8 rounded-none">
            <h3 className="text-xl font-bold mb-6 font-serif uppercase tracking-widest text-primary border-b border-border/50 pb-4">HQ Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Address</h4>
                  <p className="text-muted-foreground">LA RC Cafe</p>
                  <p className="text-muted-foreground">India</p>
                  <a href="https://maps.app.goo.gl/3S5WxWXwAi9S7ThK6" target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline mt-2 inline-block font-medium">Get Directions &rarr;</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Phone / WhatsApp</h4>
                  <p className="text-muted-foreground"><a href="tel:+919622340933" className="hover:text-primary transition-colors">+91 96223 40933</a></p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-muted-foreground">info@larccafe.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Track Hours</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Mon - Thu: 10:00 AM - 10:00 PM</li>
                    <li>Fri - Sat: 9:00 AM - Midnight</li>
                    <li>Sunday: 9:00 AM - 10:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border/50 p-8 md:p-10 rounded-none relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          <h3 className="text-2xl font-bold mb-8 font-serif">Send a Message</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Driver Name" {...field} className="bg-background border-border/50 rounded-none h-12" />
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
                        <Input placeholder="driver@example.com" {...field} className="bg-background border-border/50 rounded-none h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Subject (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Track rental inquiry..." {...field} className="bg-background border-border/50 rounded-none h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How can we help?" className="min-h-[150px] bg-background border-border/50 rounded-none resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 rounded-none uppercase tracking-widest font-bold text-sm bg-primary hover:bg-primary/90 transition-all duration-300 group"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Sending..." : "Transmit Message"}
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </Form>
        </div>

      </div>
    </div>
  );
}
