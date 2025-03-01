// import React, { useState } from "react";
// import { Button, Select, Card, CardContent } from "@/components/ui";

// const GenerateReport = () => {
//   const [selectedSection, setSelectedSection] = useState("");
//   const [report, setReport] = useState("");

//   const sections = ["Orders", "Products", "Users", "Payments", "Inventory"];

//   const generateReport = () => {
//     if (!selectedSection) {
//       alert("Please select a section");
//       return;
//     }
    
//     // Simulating report generation
//     setReport(`Report generated for ${selectedSection} on ${new Date().toLocaleString()}`);
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h1 className="text-2xl font-bold mb-4">Report Generation</h1>
//       <Card className="w-full max-w-md p-4">
//         <CardContent>
//           <label className="block text-lg font-semibold mb-2">Select Section:</label>
//           <Select
//             value={selectedSection}
//             onChange={(e) => setSelectedSection(e.target.value)}
//             className="w-full p-2 border rounded-md mb-4"
//           >
//             <option value="">-- Choose Section --</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>{section}</option>
//             ))}
//           </Select>
//           <Button onClick={generateReport} className="w-full">Generate Report</Button>
//         </CardContent>
//       </Card>
//       {report && (
//         <div className="mt-6 p-4 border rounded-md bg-gray-100 w-full max-w-md">
//           <h2 className="text-lg font-semibold">Generated Report</h2>
//           <p>{report}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateReport;
