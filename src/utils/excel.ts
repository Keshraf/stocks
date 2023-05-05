import * as XLSX from "xlsx";

type Props = {
  data: [key: string];
  filename: string;
  sheetname?: string;
};

export default function exportExcel({
  data,
  filename,
  sheetname = "Sheet1",
}: Props) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetname);
  XLSX.writeFile(workbook, filename);
}
