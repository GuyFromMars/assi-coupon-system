// components/StudentTableSkeleton.js
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";

export default function StudentTableSkeleton() {
  const rows = Array.from({ length: 5 }); // 5 skeleton rows
  return (
    <div className="w-full px-4 lg:px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Enter student name..."
          className="max-w-sm"
        />
      </div>
    <div className="rounded-md border animate-pulse ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead className="hidden sm:table-cell">Coupon Code</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-10 bg-gray-300 rounded"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
