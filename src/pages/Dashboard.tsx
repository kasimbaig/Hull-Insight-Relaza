import { useState } from "react";
import { 
  Ship, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Users,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import navalHero from "@/assets/naval-hero.jpg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, PolarArea, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Mock data for dashboard
const dashboardData = {
  kpis: [
    { title: "Total Vessels", value: "24", icon: Ship, trend: "+2", color: "bg-primary" },
    { title: "Pending Plans", value: "8", icon: Clock, trend: "-1", color: "bg-warning" },
    { title: "Plans Approved", value: "15", icon: CheckCircle, trend: "+3", color: "bg-success" },
    { title: "Overdue Surveys", value: "3", icon: AlertTriangle, trend: "0", color: "bg-destructive" },
  ],
  recentActivities: [
    { id: 1, type: "Plan Approved", vessel: "INS Vikrant", user: "Adm. Sharma", time: "2 hours ago", status: "approved" },
    { id: 2, type: "Survey Submitted", vessel: "INS Vikramaditya", user: "Capt. Patel", time: "4 hours ago", status: "pending" },
    { id: 3, type: "Plan Created", vessel: "INS Kolkata", user: "Lt. Kumar", time: "6 hours ago", status: "draft" },
    { id: 4, type: "Survey Approved", vessel: "INS Chennai", user: "Adm. Singh", time: "1 day ago", status: "approved" },
  ],
  pendingApprovals: [
    { id: 1, title: "Docking Plan - INS Shivalik", type: "Dockyard Plan", priority: "High", dueDate: "Today" },
    { id: 2, title: "Hull Survey - INS Kolkata", type: "Survey", priority: "Medium", dueDate: "Tomorrow" },
    { id: 3, title: "Docking Plan - INS Kochi", type: "Dockyard Plan", priority: "Low", dueDate: "3 days" },
  ]
};

// Chart data configurations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

// 1. Line Chart - Survey Compliance Trend
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Survey Compliance %',
      data: [75, 78, 82, 79, 85, 87, 90, 88, 86, 89, 87, 91],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 2. Bar Chart - Vessel Maintenance Status
const barChartData = {
  labels: ['INS Vikrant', 'INS Kolkata', 'INS Chennai', 'INS Kochi', 'INS Vikramaditya'],
  datasets: [
    {
      label: 'Completed Maintenance',
      data: [85, 78, 92, 65, 88],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    },
    {
      label: 'Pending Maintenance',
      data: [15, 22, 8, 35, 12],
      backgroundColor: 'rgba(234, 179, 8, 0.8)',
    },
  ],
};

// 3. Doughnut Chart - Survey Status Distribution
const doughnutChartData = {
  labels: ['Completed', 'In Progress', 'Overdue', 'Scheduled'],
  datasets: [
    {
      label: 'Surveys',
      data: [45, 25, 10, 20],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
};

// 4. Polar Area Chart - Priority Distribution
const polarAreaChartData = {
  labels: ['Critical', 'High', 'Medium', 'Low'],
  datasets: [
    {
      label: 'Tasks by Priority',
      data: [8, 12, 20, 15],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
    },
  ],
};

// 5. Radar Chart - Vessel Readiness Assessment
const radarChartData = {
  labels: ['Hull Integrity', 'Engine Performance', 'Weapon Systems', 'Navigation', 'Communications', 'Crew Readiness'],
  datasets: [
    {
      label: 'INS Vikrant',
      data: [90, 85, 95, 88, 92, 87],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
    },
    {
      label: 'INS Kolkata',
      data: [85, 88, 82, 90, 85, 90],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgb(34, 197, 94)',
      pointBackgroundColor: 'rgb(34, 197, 94)',
    },
  ],
};

export default function Dashboard() {
  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-success text-success-foreground",
      pending: "bg-warning text-warning-foreground", 
      draft: "bg-muted text-muted-foreground",
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      High: "bg-destructive text-destructive-foreground",
      Medium: "bg-warning text-warning-foreground",
      Low: "bg-success text-success-foreground",
    };
    return variants[priority as keyof typeof variants] || variants.Low;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 mx-6 mt-6 border border-gray-300"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7)), url(${navalHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 p-6 flex items-center">
          <div className="text-primary-foreground">
            <h1 className="text-4xl font-bold mb-2">Hull Insight Command Center</h1>
            <p className="text-lg opacity-90">
              Welcome back. Monitoring {dashboardData.kpis[0].value} vessels across all naval commands.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="gap-2 border-gray-300 hover:border-violet-400">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Calendar className="w-4 h-4" />
            Schedule Survey
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.kpis.map((kpi, index) => (
            <Card key={index} className="transition-smooth border border-gray-300 hover:border-violet-400 hover:shadow-soft rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{kpi.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-3xl font-bold">{kpi.value}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {kpi.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center ring-1 ring-white/30`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Survey Compliance Trend */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Survey Compliance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line options={chartOptions} data={lineChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Vessel Maintenance Status */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Vessel Maintenance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar options={chartOptions} data={barChartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doughnut Chart - Survey Status Distribution */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Survey Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut options={chartOptions} data={doughnutChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Polar Area Chart - Priority Distribution */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Task Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PolarArea options={chartOptions} data={polarAreaChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart - Vessel Readiness Assessment */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="w-5 h-5" />
                Vessel Readiness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Radar options={chartOptions} data={radarChartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border border-gray-200 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-300 hover:border-violet-300">
                    <div>
                      <p className="font-medium text-sm">{activity.type}</p>
                      <p className="text-muted-foreground text-xs">
                        {activity.vessel} • by {activity.user}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadge(activity.status)}>
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pendingApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-violet-300 transition-colors bg-white">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-muted-foreground text-xs">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityBadge(item.priority)}>
                        {item.priority}
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs font-medium">{item.dueDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-gray-300 hover:border-violet-400">
                View All Pending Items
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Status Overview */}
        <Card className="border border-gray-300 hover:border-violet-400 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Fleet Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Survey Compliance</span>
                  <span className="text-sm text-muted-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Approval Rate</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">On-time Delivery</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}