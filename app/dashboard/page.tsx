"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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

export default function Dashboard() {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDisposeValue, setTotalDisposeValue] = useState(0);
  const [averageDepreciationRate, setAverageDepreciationRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets");

        if (!response.ok) {
          throw new Error("Error when searching for assets");
        }

        const result = await response.json();

        if (result.success) {
          // Array of assets from the API
          const assets = result.data as Asset[];

          // Total number of assets
          const total = assets.length;

          // Total purchase price (amount invested)
          const totalPurchasePrice = assets.reduce(
            (acc, asset) => acc + asset.purchasePrice, 
            0
          );

          // Total dispose value
          const totalDispose = assets.reduce(
            (acc, asset) => acc + asset.disposeValue, 
            0
          );

          // Average depreciation rate
          const totalDepreciation = assets.reduce(
            (acc, asset) => acc + asset.depreciation, 
            0
          );
          const avgDepreciation = assets.length > 0 ? 
            (totalDepreciation / assets.length) : 0;

          setAssets(assets);
          setTotalAssets(total);
          setTotalAmount(totalPurchasePrice);
          setTotalDisposeValue(totalDispose);
          setAverageDepreciationRate(avgDepreciation);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        toast({
          title: "Error!",
          description: error instanceof Error ? error.message : "Error loading data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
  {/* Container for the cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {/* Total number of assets */}
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardHeader className="pb-0">
        <CardTitle>Number of Assets</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <p className="text-xl font-medium">
            {totalAssets}
          </p>
        )}
      </CardContent>
    </Card>

    {/* Total Amount invested */}
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardHeader className="pb-0">
        <CardTitle>Total Amount Invested</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <p className="text-xl font-medium">
            R$ {totalAmount.toFixed(2)}
          </p>
        )}
      </CardContent>
    </Card>

    {/* Total dispose value */}
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardHeader className="pb-0">
        <CardTitle>Dispose Value Total</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <p className="text-xl font-medium">
            R$ {totalDisposeValue.toFixed(2)}
          </p>
        )}
      </CardContent>
    </Card>

    {/* Average Depreciation rate */}
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardHeader className="pb-0">
        <CardTitle>Average Depreciation Rate</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <p className="text-xl font-medium">
            {averageDepreciationRate.toFixed(2)}%
          </p>
        )}
      </CardContent>
    </Card>
  </div>

      {/* Assets Table */}
      <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Depreciation</TableHead>
                    <TableHead>Dispose Value</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No assets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.title}</TableCell>
                        <TableCell>{asset.manufacturer}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                        <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                        <TableCell>R {asset.purchasePrice.toFixed(2)}</TableCell>
                        <TableCell>{asset.depreciation.toFixed(2)}%</TableCell>
                        <TableCell>R {asset.disposeValue.toFixed(2)}</TableCell>
                        <TableCell>{asset.assignedTo}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}
 