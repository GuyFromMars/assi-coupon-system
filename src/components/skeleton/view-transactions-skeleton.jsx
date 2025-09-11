import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function ViewTransactionsSkeleton() {
  const rows = Array.from({ length: 5 }); // 5 skeleton rows
  return (
    <div className="w-full px-4 lg:px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Enter date to filter..."
          className="max-w-sm"
        />
      </div>
    <div className="rounded-md border animate-pulse ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">Remaining Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-10 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10 bg-gray-300 rounded" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-10 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10 bg-gray-300 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
