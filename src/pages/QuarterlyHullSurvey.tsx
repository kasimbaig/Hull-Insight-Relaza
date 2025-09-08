"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Save, Mail, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Types
interface HullSurvey {
  id: number;
  quarter: string;
  date_of_survey: string;
  ship: number;
  ship_name?: string;
  reporting_officer: string;
  return_delayed: boolean;
  entire_ship_surveyed: boolean;
  email_sent_delayed: boolean;
  email_sent_incomplete: boolean;
  created_at: string;
  updated_at: string;
  status: "Delayed" | "Incomplete" | "Complete";
}

interface Ship {
  id: number;
  name: string;
}

interface Defect {
  id: number;
  description: string;
  status: "Resolved" | "Unresolved";
  markings: string[];
  compartment: string;
  remarks?: string;
  isEditing?: boolean;
  isSaved?: boolean;
  survey_id: number;
  created_at: string;
}

interface Compartment {
  id: number;
  name: string;
}

// Constants
const QUARTERS = ["31 Mar", "30 Jun", "30 Sep", "31 Dec"];
const MARKINGS = ["Rust", "Cracks", "Pits", "Corrosion", "Undulation"];

const QuarterlyHullSurvey = () => {
  const { toast } = useToast();
  
  // State management
  const [surveys, setSurveys] = useState<HullSurvey[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [compartments, setCompartments] = useState<Compartment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<HullSurvey | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [surveyForm, setSurveyForm] = useState({
    quarter: "",
    date_of_survey: "",
    ship: "",
    reporting_officer: "",
    return_delayed: false,
    entire_ship_surveyed: true,
    email_sent_delayed: false,
    email_sent_incomplete: false,
    status: "Complete" as "Delayed" | "Incomplete" | "Complete",
  });

  const [defectForm, setDefectForm] = useState<Defect>({
    id: -1,
    description: "",
    status: "Unresolved",
    markings: [],
    compartment: "",
    survey_id: 0,
    created_at: new Date().toISOString(),
  });

  // Static data initialization
  useEffect(() => {
    // Mock ships data
    const mockShips: Ship[] = [
      { id: 1, name: "INS Vikrant" },
      { id: 2, name: "INS Vikramaditya" },
      { id: 3, name: "INS Delhi" },
      { id: 4, name: "INS Mumbai" },
      { id: 5, name: "INS Kolkata" },
      { id: 6, name: "INS Chennai" },
      { id: 7, name: "INS Kochi" },
      { id: 8, name: "INS Visakhapatnam" },
      { id: 9, name: "INS Mormugao" },
      { id: 10, name: "INS Imphal" }
    ];

    // Mock compartments data
    const mockCompartments: Compartment[] = [
      { id: 1, name: "Engine Room" },
      { id: 2, name: "Bridge" },
      { id: 3, name: "Cargo Hold" },
      { id: 4, name: "Crew Quarters" },
      { id: 5, name: "Galley" },
      { id: 6, name: "Mess Deck" },
      { id: 7, name: "Medical Bay" },
      { id: 8, name: "Weapons Bay" },
      { id: 9, name: "Control Room" },
      { id: 10, name: "Storage Compartment" }
    ];

    // Mock surveys data
    const mockSurveys: HullSurvey[] = [
      {
        id: 1,
        quarter: "31 Mar",
        date_of_survey: "2024-03-31",
        ship: 1,
        ship_name: "INS Vikrant",
        reporting_officer: "Lt. Cdr. Rajesh Kumar",
        return_delayed: false,
        entire_ship_surveyed: true,
        email_sent_delayed: false,
        email_sent_incomplete: false,
        created_at: "2024-03-31T10:00:00Z",
        updated_at: "2024-03-31T10:00:00Z",
        status: "Complete"
      },
      {
        id: 2,
        quarter: "30 Jun",
        date_of_survey: "2024-06-30",
        ship: 2,
        ship_name: "INS Vikramaditya",
        reporting_officer: "Cdr. Priya Sharma",
        return_delayed: true,
        entire_ship_surveyed: true,
        email_sent_delayed: false,
        email_sent_incomplete: false,
        created_at: "2024-06-30T14:30:00Z",
        updated_at: "2024-07-02T09:15:00Z",
        status: "Delayed"
      },
      {
        id: 3,
        quarter: "30 Sep",
        date_of_survey: "2024-09-30",
        ship: 3,
        ship_name: "INS Delhi",
        reporting_officer: "Lt. Cdr. Amit Singh",
        return_delayed: false,
        entire_ship_surveyed: false,
        email_sent_delayed: false,
        email_sent_incomplete: false,
        created_at: "2024-09-30T11:45:00Z",
        updated_at: "2024-09-30T11:45:00Z",
        status: "Incomplete"
      },
      {
        id: 4,
        quarter: "31 Dec",
        date_of_survey: "2024-12-31",
        ship: 4,
        ship_name: "INS Mumbai",
        reporting_officer: "Cdr. Neha Patel",
        return_delayed: false,
        entire_ship_surveyed: true,
        email_sent_delayed: false,
        email_sent_incomplete: false,
        created_at: "2024-12-31T16:20:00Z",
        updated_at: "2024-12-31T16:20:00Z",
        status: "Complete"
      }
    ];

    // Mock defects data
    const mockDefects: Defect[] = [
      {
        id: 1,
        description: "Corrosion on port side hull plating",
        status: "Unresolved",
        markings: ["Rust", "Corrosion"],
        compartment: "1",
        remarks: "Requires immediate attention",
        survey_id: 1,
        created_at: "2024-03-31T10:30:00Z"
      },
      {
        id: 2,
        description: "Crack in engine room bulkhead",
        status: "Resolved",
        markings: ["Cracks"],
        compartment: "1",
        remarks: "Repaired during last maintenance",
        survey_id: 1,
        created_at: "2024-03-31T11:00:00Z"
      },
      {
        id: 3,
        description: "Undulation in deck plating",
        status: "Unresolved",
        markings: ["Undulation"],
        compartment: "2",
        remarks: "Monitor for progression",
        survey_id: 2,
        created_at: "2024-06-30T15:00:00Z"
      },
      {
        id: 4,
        description: "Pitting in cargo hold area",
        status: "Unresolved",
        markings: ["Pits", "Corrosion"],
        compartment: "3",
        remarks: "Surface treatment required",
        survey_id: 3,
        created_at: "2024-09-30T12:00:00Z"
      }
    ];

    setShips(mockShips);
    setCompartments(mockCompartments);
    setSurveys(mockSurveys);
    setDefects(mockDefects);
  }, []);

  // Event handlers
  const handleOpenNewSurvey = () => {
    setEditingSurvey(null);
    setSurveyForm({
      quarter: "",
      date_of_survey: "",
      ship: "",
      reporting_officer: "",
      return_delayed: false,
      entire_ship_surveyed: true,
      email_sent_delayed: false,
      email_sent_incomplete: false,
      status: "Complete",
    });
    setIsDialogOpen(true);
  };

  const handleSurveySave = () => {
    const ship = ships.find(s => s.id === parseInt(surveyForm.ship));
    const surveyData: HullSurvey = {
      id: editingSurvey?.id || Date.now(),
      quarter: surveyForm.quarter,
      date_of_survey: surveyForm.date_of_survey,
      ship: parseInt(surveyForm.ship) || 0,
      ship_name: ship?.name || "",
      reporting_officer: surveyForm.reporting_officer,
      return_delayed: surveyForm.return_delayed,
      entire_ship_surveyed: surveyForm.entire_ship_surveyed,
      email_sent_delayed: surveyForm.email_sent_delayed,
      email_sent_incomplete: surveyForm.email_sent_incomplete,
      created_at: editingSurvey?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: surveyForm.status,
    };

    if (editingSurvey) {
      setSurveys(prev => prev.map(s => s.id === editingSurvey.id ? surveyData : s));
      toast({
        title: "Survey Updated",
        description: "Survey updated successfully",
        duration: 3000,
      });
    } else {
      setSurveys(prev => [...prev, surveyData]);
      setEditingSurvey(surveyData);
      toast({
        title: "Survey Created",
        description: "New survey created successfully",
        duration: 3000,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteSurvey = (surveyId: number) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;
    
    setSurveys(prev => prev.filter(s => s.id !== surveyId));
    setDefects(prev => prev.filter(d => d.survey_id !== surveyId));
    toast({
      title: "Survey Deleted",
      description: "Survey deleted successfully",
      duration: 3000,
    });
  };

  const handleForwardToAuthorities = (surveyId: number) => {
    const authorities = ["MoD(N)/DNA", "Refitting Authority", "HITU", "INSMA"];
    toast({
      title: "Survey Forwarded",
      description: `Survey forwarded to ${authorities.join(", ")}`,
      duration: 3000,
    });
  };

  const handleSendDelayedEmail = (surveyId: number) => {
    toast({
      title: "Email Sent",
      description: "Delayed return email sent to authorities",
      duration: 3000,
    });
    setSurveys(prev => prev.map(s => 
      s.id === surveyId ? { ...s, email_sent_delayed: true } : s
    ));
  };

  const handleSendIncompleteEmail = (surveyId: number) => {
    toast({
      title: "Email Sent",
      description: "Incomplete survey email sent to authorities",
      duration: 3000,
    });
    setSurveys(prev => prev.map(s => 
      s.id === surveyId ? { ...s, email_sent_incomplete: true } : s
    ));
  };

  // Defect handlers
  const handleAddNewDefect = () => {
    const surveyId = editingSurvey?.id || Date.now();
    
    const newDefect: Defect = {
      ...defectForm,
      id: Date.now(),
      isEditing: true,
      isSaved: false,
      survey_id: surveyId,
      created_at: new Date().toISOString(),
    };
    
    setDefects(prev => [...prev, newDefect]);
    
    // Reset defect form
    setDefectForm({
      id: -1,
      description: "",
      status: "Unresolved",
      markings: [],
      compartment: "",
      survey_id: 0,
      created_at: new Date().toISOString(),
    });
    
    toast({
      title: "Defect Added",
      description: "New defect added to the survey",
      duration: 2000,
    });
  };

  const handleDefectChange = (id: number, field: keyof Defect, value: any) => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleDefectEdit = (defectId: number) => {
    setDefects(prev => prev.map(d =>
      d.id === defectId ? { ...d, isEditing: true, isSaved: false } : d
    ));
  };

  const handleDefectSave = (defectId: number) => {
    setDefects(prev => prev.map(d =>
      d.id === defectId ? { ...d, isEditing: false, isSaved: true } : d
    ));
    toast({
      title: "Defect Saved",
      description: "Defect saved successfully",
      duration: 2000,
    });
  };

  const handleDeleteDefect = (id: number) => {
    if (!confirm("Are you sure you want to delete this defect?")) return;
    
    setDefects(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Defect Deleted",
      description: "Defect deleted successfully",
      duration: 2000,
    });
  };

  // Table body templates
  const shipBodyTemplate = (rowData: HullSurvey) => {
    const ship = ships.find(s => s.id === rowData.ship);
    return ship?.name || rowData.ship_name || `Ship ${rowData.ship}`;
  };

  const statusBodyTemplate = (rowData: HullSurvey) => {
    if (rowData.return_delayed) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Delayed
        </Badge>
      );
    }
    if (!rowData.entire_ship_surveyed) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-3 w-3" />
          Incomplete
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="flex items-center gap-1 text-white bg-green-500 hover:bg-green-500/90">
        <CheckCircle className="h-3 w-3" />
        Complete
      </Badge>
    );
  };

  const actionsBodyTemplate = (rowData: HullSurvey) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        title="Edit Survey"
        onClick={() => {
          setEditingSurvey(rowData);
          setSurveyForm({
            quarter: rowData.quarter,
            date_of_survey: rowData.date_of_survey,
            ship: rowData.ship.toString(),
            reporting_officer: rowData.reporting_officer,
            return_delayed: rowData.return_delayed,
            entire_ship_surveyed: rowData.entire_ship_surveyed,
            email_sent_delayed: rowData.email_sent_delayed,
            email_sent_incomplete: rowData.email_sent_incomplete,
            status: rowData.status,
          });
          setIsDialogOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {rowData.return_delayed && !rowData.email_sent_delayed && (
        <Button
          size="sm"
          variant="destructive"
          title="Send Delayed Email"
          onClick={() => handleSendDelayedEmail(rowData.id)}
        >
          <Mail className="h-4 w-4" />
        </Button>
      )}
      {!rowData.entire_ship_surveyed && !rowData.email_sent_incomplete && (
        <Button
          size="sm"
          variant="destructive"
          title="Send Incomplete Email"
          onClick={() => handleSendIncompleteEmail(rowData.id)}
        >
          <Mail className="h-4 w-4" />
        </Button>
      )}
      <Button
        size="sm"
        className="bg-[#00809D] hover:bg-[#00809D]/90 text-white"
        title="Forward to Authorities"
        onClick={() => handleForwardToAuthorities(rowData.id)}
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        title="Delete Survey"
        onClick={() => handleDeleteSurvey(rowData.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // Defect table body templates
  const defectDescriptionBodyTemplate = (rowData: Defect) => {
    if (rowData.isEditing) {
      return (
        <Input
          className="border-2 border-[#00809D] focus:border-[#00809D]/80"
          value={rowData.description}
          onChange={(e) => handleDefectChange(rowData.id, "description", e.target.value)}
          placeholder="Enter description"
        />
      );
    }
    return (
      <span className={`p-2 text-sm ${rowData.status === "Unresolved" ? "text-red-600" : ""}`}>
        {rowData.description}
      </span>
    );
  };

  const defectStatusBodyTemplate = (rowData: Defect) => {
    if (rowData.isEditing) {
      return (
        <Select value={rowData.status} onValueChange={(val) => handleDefectChange(rowData.id, "status", val)}>
          <SelectTrigger className="border-2 border-[#00809D] focus:border-[#00809D]/80">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Unresolved">Unresolved</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    return (
      <Badge
        variant={rowData.status === "Resolved" ? "default" : "destructive"}
        className={`${rowData.status === "Resolved" ? "text-white bg-green-500 hover:bg-green-500/90" : "text-white"}`}
      >
        {rowData.status}
      </Badge>
    );
  };

  const defectMarkingsBodyTemplate = (rowData: Defect) => {
    if (rowData.isEditing) {
      return (
        <div className="flex flex-wrap gap-1 items-center min-h-[40px] border-2 border-[#00809D] focus:border-[#00809D]/80 rounded-md p-2">
          {rowData.markings.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {rowData.markings.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-[#00809D]/10 text-[#00809D] text-xs"
                >
                  {m}
                  <button
                    type="button"
                    className="ml-1 text-[#00809D] hover:text-[#00809D]/80"
                    onClick={() => handleDefectChange(rowData.id, "markings", rowData.markings.filter(mark => mark !== m))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <Select
            value=""
            onValueChange={(val) => {
              if (val && !rowData.markings.includes(val)) {
                handleDefectChange(rowData.id, "markings", [...rowData.markings, val]);
              }
            }}
          >
            <SelectTrigger className="border-2 border-[#00809D] focus:border-[#00809D]/80">
              <SelectValue placeholder="Add marking..." />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {MARKINGS.filter((m) => !rowData.markings.includes(m)).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-1 p-2">
        {rowData.markings.length > 0 ? (
          rowData.markings.map((m) => (
            <span
              key={m}
              className="inline-flex items-center px-2 py-1 rounded-md bg-[#00809D]/10 text-[#00809D] text-xs"
            >
              {m}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No markings</span>
        )}
      </div>
    );
  };

  const defectCompartmentBodyTemplate = (rowData: Defect) => {
    if (rowData.isEditing) {
      return (
        <Select value={rowData.compartment} onValueChange={(val) => handleDefectChange(rowData.id, "compartment", val)}>
          <SelectTrigger className="border-2 border-[#00809D] focus:border-[#00809D]/80">
            <SelectValue placeholder="Select Compartment" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {compartments.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <span className="p-2 text-sm">
        {compartments.find(c => c.id.toString() === rowData.compartment)?.name || rowData.compartment || "Not specified"}
      </span>
    );
  };

  const defectRemarksBodyTemplate = (rowData: Defect) => {
    if (rowData.isEditing) {
      return (
        <Input
          className="border-2 border-[#00809D] focus:border-[#00809D]/80"
          value={rowData.remarks || ""}
          onChange={(e) => handleDefectChange(rowData.id, "remarks", e.target.value)}
          placeholder="Enter remarks"
        />
      );
    }
    return (
      <span className="p-2 text-sm">{rowData.remarks || "No remarks"}</span>
    );
  };

  const defectActionsBodyTemplate = (rowData: Defect) => (
    <div className="flex gap-2">
      {rowData.isEditing ? (
        <Button
          size="sm"
          className="bg-[#00809D] hover:bg-[#00809D]/90 text-white"
          title="Save Defect"
          onClick={() => handleDefectSave(rowData.id)}
        >
          <Save className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          title="Edit Defect"
          onClick={() => handleDefectEdit(rowData.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        title="Delete Defect"
        onClick={() => handleDeleteDefect(rowData.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // Filter data
  const filtered = (Array.isArray(surveys) ? surveys : []).filter((s) => {
    const ship = ships.find((v) => v.id === s.ship);
    const shipName = ship?.name || s.ship_name || "";
    return shipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.quarter.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.reporting_officer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quarterly Hull Survey</h1>
        <Button
          onClick={handleOpenNewSurvey}
          className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
        >
          <Plus className="mr-2 h-4 w-4" /> New Survey
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search surveys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#00809D]" />
            Survey Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            value={Array.isArray(filtered) ? filtered : []}
            paginator
            rows={10}
            emptyMessage="No surveys found"
            className="vessel-datatable"
          >
            <Column 
              field="quarter" 
              header="Quarter" 
              className="min-w-[120px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="date_of_survey" 
              header="Date" 
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="ship_name" 
              header="Ship" 
              body={shipBodyTemplate}
              className="min-w-[200px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="reporting_officer" 
              header="Reporting Officer" 
              className="min-w-[200px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="status" 
              header="Status" 
              body={statusBodyTemplate}
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="actions" 
              header="Actions" 
              body={actionsBodyTemplate}
              className="w-[200px] text-center"
              headerClassName="master-table-header-no-border"
            />
          </DataTable>
        </CardContent>
      </Card>

      {/* Survey Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-[#00809D] p-6 text-white rounded-t-lg">
            <DialogTitle className="text-xl font-bold">
              {editingSurvey ? "Edit Survey" : "New Survey"}
            </DialogTitle>
            <p className="text-white/80 mt-1">
              Enter survey details and add defects
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Survey Form */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">1</span>
                  </div>
                  Survey Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quarter *</Label>
                  <Select value={surveyForm.quarter} onValueChange={(val) => setSurveyForm(f => ({ ...f, quarter: val }))}>
                    <SelectTrigger className="h-10 border-2 border-[#00809D] focus:border-[#00809D]/80">
                      <SelectValue placeholder="Select Quarter" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {QUARTERS.map(q => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date of Survey *</Label>
                  <Input
                    type="date"
                    className="h-10 border-2 border-[#00809D] focus:border-[#00809D]/80"
                    value={surveyForm.date_of_survey}
                    onChange={(e) => setSurveyForm(f => ({ ...f, date_of_survey: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ship *</Label>
                  <Select value={surveyForm.ship} onValueChange={(val) => setSurveyForm(f => ({ ...f, ship: val }))}>
                    <SelectTrigger className="h-10 border-2 border-[#00809D] focus:border-[#00809D]/80">
                      <SelectValue placeholder="Select Ship" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {ships.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Reporting Officer *</Label>
                  <Input
                    className="h-10 border-2 border-[#00809D] focus:border-[#00809D]/80"
                    value={surveyForm.reporting_officer}
                    onChange={(e) => setSurveyForm(f => ({ ...f, reporting_officer: e.target.value }))}
                    placeholder="Enter officer name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="return_delayed"
                      checked={surveyForm.return_delayed}
                      onCheckedChange={(checked) => setSurveyForm(f => ({ ...f, return_delayed: !!checked }))}
                    />
                    <Label htmlFor="return_delayed" className="text-sm">Return Delayed</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="entire_ship_surveyed"
                      checked={surveyForm.entire_ship_surveyed}
                      onCheckedChange={(checked) => setSurveyForm(f => ({ ...f, entire_ship_surveyed: !!checked }))}
                    />
                    <Label htmlFor="entire_ship_surveyed" className="text-sm">Entire Ship Surveyed</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Defects Table */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">2</span>
                    </div>
                    Defects & Observations
                  </CardTitle>
                  <Button
                    onClick={handleAddNewDefect}
                    className="bg-[#00809D] hover:bg-[#00809D]/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Defect
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <DataTable
                  value={Array.isArray(defects) ? defects.filter(d => d.survey_id === editingSurvey?.id) : []}
                  paginator
                  rows={5}
                  emptyMessage="No defects found"
                  className="vessel-datatable min-w-[1200px]"
                >
                  <Column 
                    field="description" 
                    header="Description" 
                    body={defectDescriptionBodyTemplate}
                    className="min-w-[300px]"
                    headerClassName="master-table-header"
                  />
                  <Column 
                    field="status" 
                    header="Status" 
                    body={defectStatusBodyTemplate}
                    className="min-w-[120px]"
                    headerClassName="master-table-header"
                  />
                  <Column 
                    field="markings" 
                    header="Markings" 
                    body={defectMarkingsBodyTemplate}
                    className="min-w-[200px]"
                    headerClassName="master-table-header"
                  />
                  <Column 
                    field="compartment" 
                    header="Compartment" 
                    body={defectCompartmentBodyTemplate}
                    className="min-w-[150px]"
                    headerClassName="master-table-header"
                  />
                  <Column 
                    field="remarks" 
                    header="Remarks" 
                    body={defectRemarksBodyTemplate}
                    className="min-w-[200px]"
                    headerClassName="master-table-header"
                  />
                  <Column 
                    field="actions" 
                    header="Actions" 
                    body={defectActionsBodyTemplate}
                    className="w-[140px] text-center"
                    headerClassName="master-table-header-no-border"
                  />
                </DataTable>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex justify-between p-6 bg-gray-50">
            <div className="flex gap-2">
              {surveyForm.return_delayed && !surveyForm.email_sent_delayed && (
                <Button
                  variant="destructive"
                  onClick={() => handleSendDelayedEmail(editingSurvey?.id || 0)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Delayed Email
                </Button>
              )}
              {!surveyForm.entire_ship_surveyed && !surveyForm.email_sent_incomplete && (
                <Button
                  variant="destructive"
                  onClick={() => handleSendIncompleteEmail(editingSurvey?.id || 0)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Incomplete Email
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-2 rounded-md font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSurveySave}
                className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Survey
              </Button>
              <Button
                className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
                onClick={() => {
                  handleSurveySave();
                  handleForwardToAuthorities(editingSurvey?.id || Date.now());
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Forward to Authorities
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuarterlyHullSurvey;
