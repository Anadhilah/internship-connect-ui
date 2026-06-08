import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Briefcase, Users, Search, Shield, TrendingUp, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find internships that match your skills, interests, and career goals with powerful filters.",
  },
  {
    icon: Users,
    title: "Direct Connect",
    description: "Connect directly with recruiters and get real-time updates on your applications.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor application status, manage deadlines, and stay organized throughout your search.",
  },
  {
    icon: Shield,
    title: "Verified Companies",
    description: "All companies are verified to ensure safe and legitimate internship opportunities.",
  },
];

const stats = [
  { value: "5,000+", label: "Internships Posted" },
  { value: "12,000+", label: "Students Registered" },
  { value: "800+", label: "Partner Companies" },
  { value: "95%", label: "Satisfaction Rate" },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              <Briefcase className="h-3.5 w-3.5" />
              Your Career Starts Here
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Connect With Your <span className="text-gradient">Dream Internship</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              InternshipConnect bridges the gap between ambitious students and top companies. 
              Discover opportunities, apply with ease, and launch your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Why InternshipConnect?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to find, apply, and manage internship opportunities in one platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow duration-300 border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Join thousands of students and companies already using InternshipConnect.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-base">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
