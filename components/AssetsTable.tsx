"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Asset = {
  id: string;
  title: string;
  manufacturer: string;
  color: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciation: number;
  disposeValue: number;
  assignedTo: string;
};

type AssetsTableProps = {
  assets: Asset[] | null;
  loading: boolean;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AssetsTable({ assets, loading }: AssetsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("all");
  const itemsPerPage = 5;
  const router = useRouter();

  const handleEdit = (url: string) => {
    router.push(url);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete asset");
      }
      toast({ title: "Asset deleted successfully", variant: "default" });
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      toast({
        title: "Error deleting asset",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const getFilteredAssets = () => {
    if (!assets) return [];

    return assets.filter((asset) => {
      const searchMatch =
        searchTerm.toLowerCase() === "" ||
        Object.values(asset).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const filterMatch =
        filterField === "all" ||
        (filterField === "highValue" && asset.purchasePrice > 10000) ||
        (filterField === "lowValue" && asset.purchasePrice <= 10000) ||
        (filterField === "highDepreciation" && asset.depreciation > 50) ||
        (filterField === "lowDepreciation" && asset.depreciation <= 50);

      return searchMatch && filterMatch;
    });
  };

  const getPaginatedAssets = () => {
    const filteredAssets = getFilteredAssets();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssets.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredAssets().length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Assets List</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <Input
              placeholder="Search assets..."
              className="pl-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterField} onValueChange={setFilterField}>
            <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:hover:bg-gray-700 dark:text-white">
                All Assets
              </SelectItem>
              <SelectItem value="highValue" className="dark:hover:bg-gray-700 dark:text-white">
                High Value ({">"}R10,000)
              </SelectItem>
              <SelectItem value="lowValue" className="dark:hover:bg-gray-700 dark:text-white">
                Low Value (≤R10,000)
              </SelectItem>
              <SelectItem value="highDepreciation" className="dark:hover:bg-gray-700 dark:text-white">
                High Depreciation ({">"}50%)
              </SelectItem>
              <SelectItem value="lowDepreciation" className="dark:hover:bg-gray-700 dark:text-white">
                Low Depreciation (≤50%)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full dark:bg-gray-800" />
        ) : assets && assets.length > 0 ? (
          <>
            <Table className="dark:bg-gray-900">
              <TableHeader className="dark:bg-gray-800">
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-white">Title</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Manufacturer</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Color</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Serial Number</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Purchase Date</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Purchase Price</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Depreciation</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Dispose Value</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-white">Assigned To</TableHead>
                  <TableHead className="text-right dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="dark:bg-gray-900">
                {getPaginatedAssets().map((asset) => (
                  <TableRow key={asset.id} className="dark:border-gray-700">
                    <TableCell className="dark:text-white">{asset.title}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{asset.manufacturer}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{asset.color}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{asset.serialNumber}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{formatDate(asset.purchaseDate)}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">R{asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{asset.depreciation.toFixed(2)}%</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">R{asset.disposeValue.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">{asset.assignedTo}</TableCell>
                    <TableCell className="text-right dark:text-white">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 dark:hover:bg-gray-700">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 dark:text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                          <DropdownMenuItem
                            onClick={() => handleEdit(`/assets/edit/${asset.id}`)}
                            className="cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                          >
                            <Pencil className="mr-2 h-4 w-4 dark:text-white" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(asset.id)}
                            className="cursor-pointer text-red-600 dark:hover:bg-gray-700"
                          >
                            <Trash className="mr-2 h-4 w-4 dark:text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer dark:text-white"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(Number(page))}
                          isActive={currentPage === page}
                          className="cursor-pointer dark:text-white"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer dark:text-white"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No assets found</p>
        )}
      </CardContent>
    </Card>
  );
}