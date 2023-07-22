export function exportTablesToFile(selectedTables, globalTables) {

  if (selectedTables.length === 0) {
    // You can show an error message or notification if no tables are selected.
    return;
  }

  const tablesToExport = selectedTables.map((index) => globalTables[index]);

  // Create an XLSX workbook with multiple sheets, one for each selected table
  const XLSX = require("xlsx");
  const workbook = XLSX.utils.book_new();

  tablesToExport.forEach((tableData, index) => {
    const sheetName = `Sheet${index + 1}`;
    const worksheet = XLSX.utils.json_to_sheet(tableData.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Generate the Excel file and make the user's browser download it
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const fileName = "exported_tables.xlsx";
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
