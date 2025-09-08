import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, BarChart3, Thermometer, ArrowRight, TrendingUp, Users, Ship, AlertTriangle } from "lucide-react";
import DockingReportPage from "./DockingReport";
import SurveyReportPage from "./SurveyReport";
import Reports from "./Reports";

const ReportsSelection = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedReportItem, setSelectedReportItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statsData = [
    {
      title: 'Total Reports',
      value: '156',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Vessels',
      value: '24',
      change: '+3',
      icon: Ship,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '-2',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed Surveys',
      value: '89%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const reportTypes = [
    {
      id: 'docking',
      title: 'Docking Reports',
      description: 'View and manage docking reports with vessel specifications and approval status',
      icon: FileText,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      reports: [
        { id: 1, name: 'INS Vikrant Docking Plan', date: '2024-01-15', status: 'Approved' },
        { id: 2, name: 'INS Delhi Maintenance Report', date: '2024-01-20', status: 'Pending' },
        { id: 3, name: 'INS Mumbai Refit Analysis', date: '2024-01-25', status: 'In Review' }
      ]
    },
    {
      id: 'survey',
      title: 'Survey Reports',
      description: 'Access quarterly hull survey reports with defect tracking and analysis',
      icon: BarChart3,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      reports: [
        { id: 1, name: 'Q1 2024 Hull Survey', date: '2024-03-31', status: 'Complete' },
        { id: 2, name: 'Q2 2024 Hull Survey', date: '2024-06-30', status: 'In Progress' },
        { id: 3, name: 'Q3 2024 Hull Survey', date: '2024-09-30', status: 'Scheduled' }
      ]
    },
    {
      id: 'hvac',
      title: 'HVAC Reports',
      description: 'Review HVAC trial reports and air flow measurements',
      icon: Thermometer,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      reports: [
        { id: 1, name: 'HVAC System Analysis', date: '2024-01-10', status: 'Complete' },
        { id: 2, name: 'Air Flow Measurements', date: '2024-01-18', status: 'Pending' },
        { id: 3, name: 'Temperature Control Report', date: '2024-01-22', status: 'In Review' }
      ]
    }
  ];

  const handleReportTypeClick = (reportType: string) => {
    setSelectedReport(reportType);
    setSelectedReportItem(null);
    setIsDialogOpen(true);
  };

  const handleReportItemClick = (reportType: string, reportItem: any) => {
    setSelectedReport(reportType);
    setSelectedReportItem(reportItem);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Complete':
        return 'text-green-600 bg-green-100';
      case 'Pending':
      case 'Scheduled':
        return 'text-yellow-600 bg-yellow-100';
      case 'In Review':
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderReportComponent = () => {
    if (selectedReportItem) {
      // Render individual report based on the selected item
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">{selectedReportItem.name}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">Date: {selectedReportItem.date}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReportItem.status)}`}>
                {selectedReportItem.status}
              </span>
            </div>
          </div>
          
          {/* Render the appropriate report component based on type */}
          {selectedReport === 'docking' && <DockingReportPage />}
          {selectedReport === 'survey' && <SurveyReportPage />}
          {selectedReport === 'hvac' && <Reports />}
        </div>
      );
    }

    // Render all reports of the selected type
    switch (selectedReport) {
      case 'docking':
        return <DockingReportPage />;
      case 'survey':
        return <SurveyReportPage />;
      case 'hvac':
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Reports Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access comprehensive reports and analytics for vessel management, surveys, and system performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card 
              key={report.id} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-[#00809D]"
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full ${report.color} ${report.hoverColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#00809D] transition-colors duration-300">
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {report.description}
                </p>
                
                {/* Report List */}
                <div className="space-y-2 mb-4">
                  {report.reports.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <Button
                          size="sm"
                          className={`${report.color} ${report.hoverColor} text-white text-xs px-3 py-1 h-auto`}
                          onClick={() => handleReportItemClick(report.id, item)}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedReportItem ? (
                selectedReportItem.name
              ) : (
                <>
                  {selectedReport === 'docking' && 'Docking Reports'}
                  {selectedReport === 'survey' && 'Survey Reports'}
                  {selectedReport === 'hvac' && 'HVAC Reports'}
                </>
              )}
            </DialogTitle>
            {selectedReportItem && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedReportItem.date} • {selectedReportItem.status}
              </p>
            )}
          </DialogHeader>
          <div className="mt-4">
            {renderReportComponent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsSelection;
