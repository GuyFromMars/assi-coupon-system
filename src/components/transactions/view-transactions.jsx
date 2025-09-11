"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchStudentInfo } from "@/lib/store/slices/infoSlice";
import { deleteTransaction } from "@/lib/store/slices/infoSlice";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
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
import ViewTransactionsSkeleton from "../skeleton/view-transactions-skeleton";
import { toast } from "sonner";

export function ViewTransactions() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.info);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentInfo(id));
    }
  }, [id, dispatch]);

  // Custom filter function
const dateFilterFn = (row, columnId, filterValue) => {
  const tsObj = row.getValue(columnId);
  if (!tsObj || typeof tsObj.seconds !== "number") return false;

  const date = new Date(tsObj.seconds * 1000);
  // Format the date the same way you display it
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return formattedDate.toLowerCase().includes(filterValue.toLowerCase());
};

  const columns = [
    {
  accessorKey: "timestamp",
  header: "Date",
  cell: ({ row }) => {
    const tsObj = row.getValue("timestamp");

    // Check if timestamp exists and has seconds
    if (!tsObj || typeof tsObj.seconds !== "number") {
      return <div>Invalid Date</div>;
    }

    // Reconstruct Firestore Timestamp and convert to JS Date
    const date = new Date(tsObj.seconds * 1000); // ignore nanoseconds for display

    // Format for small and large screens
    const shortDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    const longDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return (
      <div className="font-medium">
        <span className="block sm:hidden">{shortDate}</span>
        <span className="hidden sm:block">{longDate}</span>
      </div>
    );
  },
  filterFn : dateFilterFn, // attach your custom filter
    },
    {
      accessorKey: "amount",
      header: () => <div className="hidden sm:block">Amount</div>,
      cell: ({ row }) => (
        <div className="font-medium hidden sm:block">
          GHS {row.getValue("amount")}
        </div>
      ),
    },
    {
      accessorKey: "remainingBalance",
      header: "Balance Remaining",
      cell: ({ row }) => {
        const balance = row.getValue("remainingBalance");
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
      cell: ({ row }) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const transactionId = row.original.id;
        const amount = row.original.amount;

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
                    This will delete the transaction and restore its amount of <span className="font-semibold">GHS {amount}</span> to
                    the balance.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                      onClick={async () => {
                      let toastId = toast.loading("Deleting Transaction...");
                      try {
                      await dispatch(
                      deleteTransaction({ studentId: id, transactionId: transactionId })
                      ).unwrap();
                      setIsDialogOpen(false);
                      toast.success("Success", {
                          description: `Transaction Deleted`,
                          id: toastId,
                        });
                      } catch (err) {
                      toast.error("Error", {
                        description: err.message || "Failed to update balance",
                        id: toastId,
                        });
                      }
                      }}
                      >
                      Confirm
                      </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
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

  if (loading) return <ViewTransactionsSkeleton />;

  return (
    <div className="w-full px-4 lg:px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Enter date to filter..."
          value={table.getColumn("timestamp")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("timestamp")?.setFilterValue(event.target.value)
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
