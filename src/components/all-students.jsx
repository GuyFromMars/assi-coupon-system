"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  updateStudentBalance,
  editStudent,
} from "@/lib/store/slices/studentsSlice";
import StudentTableSkeleton from "@/components/skeleton/student-table-skeleton";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { fetchCoupons } from "@/lib/store/slices/couponsSlice";
import { toast } from "sonner"

export function AllStudents() {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.students);
  const { data: coupons, cloading, cerror } = useSelector(
    (state) => state.coupons
  );

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [selectedStudent, setSelectedStudent] = useState(null);

  // Balance
  const [balanceInput, setBalanceInput] = useState("");
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isConfirmBalanceDialogOpen, setIsConfirmBalanceDialogOpen] =
    useState(false);

  // Edit student
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCoupon, setEditCoupon] = useState("");
  const [isConfirmEditDialogOpen, setIsConfirmEditDialogOpen] = useState(false);

  // Refs (hold temp input values until confirmed)
  const balanceInputRef = useRef("");
  const editNameRef = useRef("");
  const editCouponRef = useRef("");

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCoupons());
  }, [dispatch]);

  // ------------------- Balance -------------------
  const handleOpenBalanceDialog = (student) => {
    setSelectedStudent(student);
    balanceInputRef.current = "";
    setIsBalanceDialogOpen(true);
  };

  const handleAddBalanceClick = () => {
    setBalanceInput(balanceInputRef.current);
    setIsBalanceDialogOpen(false);
    setIsConfirmBalanceDialogOpen(true);
  };

  const handleConfirmBalanceUpdate = async () => {
    if (selectedStudent && balanceInput) {
      try {
        await dispatch(
          updateStudentBalance({
            id: selectedStudent.id,
            amount: Number(balanceInput),
          })
        ).unwrap();

        toast.success("Balance Updated", {
        description: `${selectedStudent.name}'s balance increased by GHS ${balanceInput}`,
        });
      } catch (err) {
        toast.error("Error", {
        description: err.message || "Failed to update balance",
        });
      }
    }
    setIsConfirmBalanceDialogOpen(false);
  };

  // ------------------- Edit Student -------------------
  const handleOpenDrawer = (student) => {
    setSelectedStudent(student);
    editNameRef.current = student.name;
    editCouponRef.current = student.couponcode;
    setIsDrawerOpen(true);
  };

  const handleEditSubmit = () => {
    setEditName(editNameRef.current);
    setEditCoupon(editCouponRef.current);
    setIsDrawerOpen(false);
    setIsConfirmEditDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (selectedStudent) {
      try {
        await dispatch(
          editStudent({
            id: selectedStudent.id,
            data: {
              name: editName,
              couponcode: editCoupon,
              balance: selectedStudent.balance, // ✅ preserve balance
            },
          })
        ).unwrap();

        toast.success("Student Updated", {
        description: `${selectedStudent.name}'s info has been updated.`,
        });
      } catch (err) {
        toast.error("Error", {
        description: err.message || "Could not update student",
        });
      }
    }
    setIsConfirmEditDialogOpen(false);
  };

  if (cloading) return <p>Loading coupons...</p>;
  if (cerror) return <p>Error loading coupons</p>;

  // ------------------- Columns -------------------
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <span
          className="flex cursor-pointer"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Balance <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: ({ row }) => {
        const balance = row.getValue("balance");
        return (
          <div
            className={balance < 60 ? "text-red-500 font-semibold" : ""}
          >
            GHS {balance}
          </div>
        );
      },
    },
    {
      accessorKey: "couponcode",
      header: () => <div className="hidden sm:block">Coupon Code</div>,
      cell: ({ row }) => (
        <div className="hidden sm:block text-primary uppercase">
          {row.getValue("couponcode")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original;
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
                <DropdownMenuItem
                  onClick={() => handleOpenBalanceDialog(student)}
                >
                  Update Balance
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenDrawer(student)}
                >
                  Edit Student Info
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = `/dashboard/transactions/${student.id}`)
                  }
                >
                  View Transactions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Balance Dialog */}
            <AlertDialog
              open={isBalanceDialogOpen}
              onOpenChange={setIsBalanceDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update Balance</AlertDialogTitle>
                  <AlertDialogDescription>
                    Student: {selectedStudent?.name}
                  </AlertDialogDescription>
                  <Input
                    type="number"
                    defaultValue={balanceInputRef.current}
                    onChange={(e) =>
                      (balanceInputRef.current = e.target.value)
                    }
                    placeholder="Enter amount to add"
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddBalanceClick}>
                    Add Balance
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Confirm Balance */}
            <AlertDialog
              open={isConfirmBalanceDialogOpen}
              onOpenChange={setIsConfirmBalanceDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Add GHS{" "}
                    <span className="font-semibold">{balanceInput}</span> to{" "}
                    {selectedStudent?.name}?<br />
                    Current: GHS {selectedStudent?.balance} → New: GHS{" "}
                    {selectedStudent
                      ? selectedStudent.balance + Number(balanceInput)
                      : ""}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmBalanceUpdate}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Edit Drawer */}
            <Drawer
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
              direction="right"
            >
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Edit Student Info</DrawerTitle>
                  <DrawerDescription>
                    Update name and coupon code
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 py-2">
                  <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                      defaultValue={editNameRef.current}
                      onChange={(e) =>
                        (editNameRef.current = e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Coupon Code</Label>
                    <Select
                      defaultValue={editCouponRef.current}
                      onValueChange={(v) => (editCouponRef.current = v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Coupon" />
                      </SelectTrigger>
                      <SelectContent>
                        {coupons.map((c) => (
                          <SelectItem key={c.id} value={c.codename}>
                            {c.codename} ({c.amount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleEditSubmit}>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Confirm Edit */}
            <AlertDialog
              open={isConfirmEditDialogOpen}
              onOpenChange={setIsConfirmEditDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Edit</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update{" "}
                    {selectedStudent?.name}'s info?<br />
                    Name: {selectedStudent?.name} → {editName}
                    <br />
                    Coupon: {selectedStudent?.couponcode} → {editCoupon}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmEdit}>
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

  if (loading) return <StudentTableSkeleton />;

  return (
    <div className="w-full px-4 lg:px-6">
      {/* Search input */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Enter student name..."
          value={table.getColumn("name")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* Table */}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} record(s) available.
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
