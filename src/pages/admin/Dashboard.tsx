import { StatCard } from "@/components/StatCard";
import { Users, Briefcase, Building2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">System-wide statistics at a glance.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={12450} icon={Users} trend="+120 this week" />
        <StatCard title="Total Recruiters" value={845} icon={Building2} trend="+15 this week" />
        <StatCard title="Active Internships" value={3200} icon={Briefcase} />
        <StatCard title="Applications Today" value={560} icon={TrendingUp} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><span>New student registration</span><span className="text-muted-foreground">2 min ago</span></div>
            <div className="flex justify-between py-2 border-b"><span>Internship posted by Google</span><span className="text-muted-foreground">15 min ago</span></div>
            <div className="flex justify-between py-2 border-b"><span>Application submitted</span><span className="text-muted-foreground">30 min ago</span></div>
            <div className="flex justify-between py-2"><span>Recruiter verified</span><span className="text-muted-foreground">1 hour ago</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">System Health</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><span>Server Status</span><span className="text-success font-medium">Operational</span></div>
            <div className="flex justify-between py-2 border-b"><span>Database</span><span className="text-success font-medium">Healthy</span></div>
            <div className="flex justify-between py-2 border-b"><span>API Response Time</span><span className="text-muted-foreground">45ms</span></div>
            <div className="flex justify-between py-2"><span>Uptime</span><span className="text-muted-foreground">99.9%</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
