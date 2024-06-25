import React, { useState } from "react";
import { Button } from "flowbite-react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const ReportGenerator = ({ tasks }) => {
  const [csvDownloadStarted, setCsvDownloadStarted] = useState(false);

  // Prepare CSV data
  const prepareCsvData = () => {
    const data = tasks.map((task) => ({
      "Task Name": task.taskName,
      Description: task.taskDescription,
      Status: task.taskStatus,
      Priority: task.taskPriority,
      "Created Date": formatDate(task.taskCreatedDate),
      "Due Date": formatDate(task.taskDueDate),
      Username: task.user.username,
    }));
    return data;
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Download PDF function
  const downloadPdf = () => {
    const doc = new jsPDF();

    // Define table headers
    const headers = [
      "Task Name",
      "Description",
      "Status",
      "Priority",
      "Created Date",
      "Due Date",
      "Username",
    ];

    // Body rows for the table
    const body = tasks.map((task) => [
      task.taskName,
      task.taskDescription,
      task.taskStatus,
      task.taskPriority,
      formatDate(task.taskCreatedDate),
      formatDate(task.taskDueDate),
      task.user.username,
    ]);

    // Configuring autoTable plugin for jsPDF
    doc.autoTable({
      head: [headers],
      body: body,
      theme: "striped",
      styles: {
        halign: "center",
      },
      margin: { top: 20 },
      columnStyles: {
        0: { fontStyle: "bold" }, // Style the Task Name column
        6: { cellWidth: "auto" }, // Adjust column width for Username
      },
      didDrawCell: (data) => {
        if (data.column.index === 7) {
          const cell = data.cell;
          const text = cell.raw;
          doc.text(text, cell.textPos.x + 2, cell.textPos.y + 2);
        }
      },
    });

    // Save PDF and show success message
    doc.save("task_report.pdf");
    toast.success("Task Report saved successfully in PDF");
  };

  // Function to handle CSV download and show toast message
  const handleCsvDownload = () => {
    setCsvDownloadStarted(true);
    setTimeout(() => {
      toast.success("CSV Report Generated successfully");
      setCsvDownloadStarted(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center mr-3 space-x-4">
      {/* CSV download */}
      <CSVLink
        data={prepareCsvData()}
        headers={[
          { label: "Task Name", key: "Task Name" },
          { label: "Description", key: "Description" },
          { label: "Status", key: "Status" },
          { label: "Priority", key: "Priority" },
          { label: "Created Date", key: "Created Date" },
          { label: "Due Date", key: "Due Date" },
          { label: "Username", key: "Username" },
        ]}
        filename="task_report.csv"
        className="btn btn-primary"
        onClick={handleCsvDownload}
      >
        <Button
          gradientDuoTone="purpleToPink"
          pill
          outline
          className=" transform transition-transform duration-300 hover:scale-110 shadow-2xl dark:shadow-neutral-600" 
        >
          Download CSV
        </Button>
      </CSVLink>
      {/* PDF download */}
      <Button
        gradientDuoTone="purpleToPink"
        pill
        outline
        onClick={downloadPdf}
        className=" transform transition-transform duration-300 hover:scale-110 shadow-2xl dark:shadow-neutral-600"
      >
        Download PDF
      </Button>
    </div>
  );
};

export default ReportGenerator;
