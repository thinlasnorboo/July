import { useListServices } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Timer, CarFront, Users, GraduationCap, CheckCircle2 } from "lucide-react";

export default function Services() {
  const { data: services = [], isLoading } = useListServices();

  const getIconForCategory = (category: string) => {
    const lowercase = category.toLowerCase();
    if (lowercase.includes("track") || lowercase.includes("racing")) return <Timer className="w-10 h-10 text-primary" />;
    if (lowercase.includes("rental") || lowercase.includes("car")) return <CarFront className="w-10 h-10 text-primary" />;
    if (lowercase.includes("event") || lowercase.includes("party")) return <Users className="w-10 h-10 text-primary" />;
    if (lowercase.includes("coach") || lowercase.includes("lesson")) return <GraduationCap className="w-10 h-10 text-primary" />;
    return <CarFront className="w-10 h-10 text-primary" />;
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4">Track Services</h1>
        <p className="text-muted-foreground text-lg">
          Whether you're a seasoned racer with your own gear or a beginner looking to rent, 
          we have the perfect package to get you on the track.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-none animate-pulse border-border/50">
              <CardHeader className="h-32 bg-muted/20"></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="h-4 bg-muted/40 w-full" />
                <div className="h-4 bg-muted/40 w-5/6" />
                <div className="h-4 bg-muted/40 w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="rounded-none border-border/50 bg-card hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="border-b border-border/30 bg-muted/5 relative overflow-hidden pb-8">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  {getIconForCategory(service.category)}
                </div>
                <div className="mb-4">{getIconForCategory(service.category)}</div>
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">{service.category}</div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹{service.priceFrom}</span>
                  <span className="text-sm text-muted-foreground">/{service.priceUnit}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 flex-1">
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">Professional grade tracks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">Timing system included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">Pit space and power access</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6 pb-8">
                <Button asChild className="w-full rounded-none h-12 uppercase tracking-widest font-bold group">
                  <Link href={`/book?service=${service.id}`}>
                    Reserve Session
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-20 bg-primary/10 border border-primary/20 p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511516246830-73f1d39281a8?q=80&w=2940&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-serif mb-4">Host Your Next Event</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            From birthday parties to corporate team building, LA RC Cafe offers exclusive track rental and catered packages for groups.
          </p>
          <Button asChild variant="outline" className="rounded-none border-primary/50 hover:bg-primary hover:text-primary-foreground h-12 px-8 uppercase tracking-widest font-bold">
            <Link href="/contact">Inquire Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
