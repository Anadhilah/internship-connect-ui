import { StatCard } from "@/components/StatCard";
import { Briefcase, Users, Eye, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentPosts = [
  { title: "Software Engineering Intern", applicants: 45, views: 230, date: "2026-02-28" },
  { title: "Product Design Intern", applicants: 22, views: 150, date: "2026-02-20" },
  { title: "Data Analyst Intern", applicants: 18, views: 95, date: "2026-02-15" },
];

export default function RecruiterOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Overview</h2>
        <p className="text-muted-foreground">Your internship posting statistics.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Postings" value={5} icon={Briefcase} trend="+2 this month" />
        <StatCard title="Total Applicants" value={85} icon={Users} />
        <StatCard title="Total Views" value={475} icon={Eye} />
        <StatCard title="Hired" value={3} icon={CheckCircle} />
      </div>
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Recent Postings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPosts.map((post, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-muted-foreground">Posted {post.date}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{post.applicants} applicants</p>
                  <p>{post.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
