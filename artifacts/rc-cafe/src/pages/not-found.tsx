import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-center px-4">
      <div className="max-w-md space-y-6">
        <h1 className="text-9xl font-extrabold text-primary font-serif">404</h1>
        <h2 className="text-3xl font-bold tracking-tight">Track Not Found</h2>
        <p className="text-muted-foreground text-lg">
          Looks like you drifted off course. The page you're looking for doesn't exist.
        </p>
        <Button asChild size="lg" className="rounded-none uppercase font-bold tracking-wide">
          <Link href="/">Back to Pits</Link>
        </Button>
      </div>
    </div>
  );
}
