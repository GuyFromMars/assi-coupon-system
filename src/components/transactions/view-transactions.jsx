"use client";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown ,MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Example columns
const columns = [
  {
  accessorKey: "date",
  header: "Date",
  cell: ({ row }) => {
    const dateValue = row.getValue("date");
    const date = new Date(dateValue);
    const isValidDate = dateValue && !isNaN(date);
    const shortDate = isValidDate
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(date)
      : "Invalid Date";
    const longDate = isValidDate
      ? new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(date)
      : "Invalid Date";
    return (
      <div className="font-medium">
        <span className="block sm:hidden">{shortDate}</span>
        <span className="hidden sm:block">{longDate}</span>
      </div>
    );
  },
},
  {
    accessorKey: "amount",
    header:() => (
    <div className="hidden sm:block">Amount</div>
  ),
    cell: ({ row }) => (
    <div className="font-medium hidden sm:block">GHS {row.getValue("amount")}</div>
    ),
  },
  {
  accessorKey: "balanceRemaining",
  header: "Balance Remaining",
  cell: ({ row }) => {
  const balance = row.getValue("balanceRemaining");
  return (
    <div className={balance < 0 ? "text-red-500 font-semibold" : ""}>
      GHS {balance}
    </div>
  );
},
},
  {
  id: "actions",
  header: "Actions",
  enableHiding: false,
  cell: () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This is just a placeholder dialog. No action will be performed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
},

];

// Example static data
const defaultData = [
  { id: "1", date: "September 10, 2025", amount: 20, balanceRemaining: 200 },
  { id: "2", date: "September 11, 2025", amount: 20, balanceRemaining: 180 },
  { id: "3", date: "September 12, 2025", amount: 20, balanceRemaining: 160 },
  { id: "4", date: "September 13, 2025", amount: 20, balanceRemaining: 140 },
  { id: "5", date: "September 14, 2025", amount: 20, balanceRemaining: 120 },
  { id: "6", date: "September 15, 2025", amount: 20, balanceRemaining: 100 },
];

export function ViewTransactions() {
  const [data] = useState(() => [...defaultData]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="w-full px-4 lg:px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Enter date to filter..."
          value={table.getColumn("date")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("date")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}