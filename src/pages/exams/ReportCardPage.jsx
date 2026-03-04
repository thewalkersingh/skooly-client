import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Printer, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import { examApi } from "@/api/examApi";
import { studentApi } from "@/api/studentApi";
import { formatDate, formatPercentage, getFullName } from "@/utils/formatters";

export default function ReportCardPage () {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [reportCard, setReportCard] = useState(null);
  const [academicYear, setAcademicYear] = useState("");
  const [loading, setLoading] = useState(false);
  
  const years = ["2024-2025", "2023-2024", "2022-2023"];
  
  useEffect(() => {
    studentApi.getById(studentId)
       .then((res) => setStudent(res.data))
       .catch(() => toast.error("Failed to load student"));
  }, [studentId]);
  
  useEffect(() => {
    if (!academicYear) return;
    setLoading(true);
    examApi.getReportCard(studentId, { academicYear })
       .then((res) => setReportCard(res.data))
       .catch(() => toast.error("Failed to load report card"))
       .finally(() => setLoading(false));
  }, [studentId, academicYear]);
  
  const handlePrint = () => window.print();
  
  return (
     <div className="space-y-5 max-w-3xl">
       <PageHeader
          title="Report Card"
          subtitle={student ? getFullName(student.firstName, student.lastName) : ""}
          backTo="/students"
          breadcrumbs={[
            { label: "Students", path: "/students" },
            { label: "Report Card" },
          ]}
          actions={
             reportCard && (
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2"/> Print
                </Button>
             )
          }
       />
       
       {/* Year filter */}
       <Card>
         <CardContent className="p-4">
           <div className="flex items-center gap-3">
             <Label className="text-sm shrink-0">Academic Year</Label>
             <Select value={academicYear} onValueChange={setAcademicYear}>
               <SelectTrigger className="w-40">
                 <SelectValue placeholder="Select year"/>
               </SelectTrigger>
               <SelectContent>
                 {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </CardContent>
       </Card>
       
       {/* Report Card */}
       {!academicYear ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Select an academic year to view the report card.
            </CardContent>
          </Card>
       ) : loading ? (
          <Skeleton className="h-96 rounded-xl"/>
       ) : !reportCard ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No report card data for {academicYear}.
            </CardContent>
          </Card>
       ) : (
          <Card className="print:shadow-none">
            {/* Header */}
            <CardHeader className="text-center border-b">
              <p className="text-lg font-bold text-blue-600">Skooly School</p>
              <CardTitle className="text-2xl">Report Card</CardTitle>
              <p className="text-sm text-muted-foreground">
                Academic Year: {academicYear}
              </p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="text-muted-foreground text-xs">Student Name</p>
                  <p className="font-semibold">
                    {getFullName(student?.firstName, student?.lastName)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Roll Number</p>
                  <p className="font-semibold">{student?.rollNumber ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Class</p>
                  <p className="font-semibold">
                    {student?.className} - {student?.sectionName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Academic Year</p>
                  <p className="font-semibold">{academicYear}</p>
                </div>
              </div>
              
              {/* Results Table */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Subject-wise Performance</h3>
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-blue-50 dark:bg-blue-900/20">
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="text-left px-4 py-2.5 font-medium">Subject</th>
                    <th className="text-left px-4 py-2.5 font-medium">Exam</th>
                    <th className="text-center px-4 py-2.5 font-medium">Marks</th>
                    <th className="text-center px-4 py-2.5 font-medium">%</th>
                    <th className="text-center px-4 py-2.5 font-medium">Grade</th>
                    <th className="text-center px-4 py-2.5 font-medium">Result</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(reportCard.results ?? []).map((r) => (
                     <tr key={r.resultId}
                         className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                       <td className="px-4 py-2.5 font-medium">{r.subjectName}</td>
                       <td className="px-4 py-2.5 text-muted-foreground">{r.examName}</td>
                       <td className="px-4 py-2.5 text-center">
                         {r.marksObtained}/{r.totalMarks}
                       </td>
                       <td className="px-4 py-2.5 text-center">
                         {formatPercentage(r.percentage)}
                       </td>
                       <td className="px-4 py-2.5 text-center">
                         <span className="font-bold text-blue-600">{r.grade}</span>
                       </td>
                       <td className="px-4 py-2.5 text-center">
                         <StatusBadge status={r.isPassing ? "PASS" : "FAIL"}/>
                       </td>
                     </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              
              {/* Overall Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {[
                  { label: "Total Marks", value: `${reportCard.totalObtained}/${reportCard.totalMaxMarks}` },
                  { label: "Overall %", value: formatPercentage(reportCard.overallPercentage) },
                  { label: "Overall Grade", value: reportCard.overallGrade },
                  { label: "Overall Result", value: <StatusBadge status={reportCard.isPassing ? "PASS" : "FAIL"}/> },
                ].map(({ label, value }) => (
                   <div key={label}
                        className="text-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                     <p className="text-xs text-muted-foreground mb-1">{label}</p>
                     <p className="font-bold text-gray-900 dark:text-white">{value}</p>
                   </div>
                ))}
              </div>
              
              {/* Remarks */}
              {reportCard.remarks && (
                 <div className="border rounded-lg p-4">
                   <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                   <p className="text-sm">{reportCard.remarks}</p>
                 </div>
              )}
            </CardContent>
          </Card>
       )}
     </div>
  );
}