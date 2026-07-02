import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAdminLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";
import { useEffect } from "react";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (localStorage.getItem("rc_admin_token")) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (res) => {
          localStorage.setItem("rc_admin_token", res.token);
          toast({
            title: "Access Granted",
            description: "Welcome to the Pit Wall.",
          });
          setLocation("/admin");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Invalid credentials.",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-card via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 bg-card mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 ring-1 ring-inset ring-primary/50 rounded-full" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter font-serif">Admin Portal</h1>
          <p className="text-muted-foreground">Enter credentials to access the pit wall</p>
        </div>

        <div className="bg-card p-8 rounded-none border border-border/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} className="bg-background border-border/50 rounded-none h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-background border-border/50 rounded-none h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 rounded-none uppercase tracking-widest font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Initialize Engine"}
                <Car className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
