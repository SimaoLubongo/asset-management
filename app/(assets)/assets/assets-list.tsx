import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationEllipsis, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Search, Table, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Input } from "postcss";

export default function AssetsListTable() {
    return (
        <div>
   <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterField} onValueChange={setFilterField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="highValue">High Value ({">"}R10,000)</SelectItem>
                <SelectItem value="lowValue">Low Value (≤R10,000)</SelectItem>
                <SelectItem value="highDepreciation">High Depreciation ({">"}50%)</SelectItem>
                <SelectItem value="lowDepreciation">Low Depreciation (≤50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : assets && assets.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Manufacturer</TableHead>
                    <TableHead className="hidden md:table-cell">Color</TableHead>
                    <TableHead className="hidden md:table-cell">Serial Number</TableHead>
                    <TableHead className="hidden md:table-cell">Purchase Price</TableHead>
                    <TableHead className="hidden md:table-cell">Depreciation</TableHead>
                    <TableHead className="hidden md:table-cell">Dispose Value</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaginatedAssets().map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{asset.manufacturer}</TableCell>
                      <TableCell className="hidden md:table-cell">{asset.color}</TableCell>
                      <TableCell className="hidden md:table-cell">{asset.serialNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">R{asset.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">{asset.depreciation.toFixed(2)}%</TableCell>
                      <TableCell className="hidden md:table-cell">R{asset.disposeValue.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">{asset.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(`/assets/edit/${asset.id}`)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(asset.id)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
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
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No assets found</p>
          )}
        </CardContent>
      </Card>
        </div>
    )
  }
   



