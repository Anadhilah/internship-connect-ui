import { StatCard } from "@/components/StatCard";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

const recentApps = [
  { company: "Google", role: "Software Engineering Intern", status: "pending" as const, date: "2026-02-28" },
  { company: "Microsoft", role: "Data Science Intern", status: "accepted" as const, date: "2026-02-25" },
  { company: "Amazon", role: "Cloud Engineering Intern", status: "rejected" as const, date: "2026-02-20" },
  { company: "Meta", role: "Product Design Intern", status: "reviewing" as const, date: "2026-02-18" },
];

export default function StudentOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Overview</h2>
        <p className="text-muted-foreground">Track your internship applications at a glance.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={12} icon={FileText} trend="+3 this week" />
        <StatCard title="Accepted" value={2} icon={CheckCircle} />
        <StatCard title="Pending" value={6} icon={Clock} />
        <StatCard title="Rejected" value={4} icon={XCircle} />
      </div>
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Recent Applications</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentApps.map((app, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{app.role}</p>
                  <p className="text-xs text-muted-foreground">{app.company} · {app.date}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
