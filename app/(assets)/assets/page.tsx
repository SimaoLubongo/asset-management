"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Asset = {
  id: string;
  title: string;
  manufacturer: string;
  color: string;
  serialNumber: string;
  purchasePrice: number;
  depreciation: number;
  disposeValue: number;
  assignedTo: string;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets");

        if (!response.ok) {
          throw new Error(`Error loading assets.: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Unknown error");
        }

        setAssets(result.data);
      } catch (error) {
        toast({
          title: "Error!",
          description: error instanceof Error ? error.message : "Error loading assets.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <BackButton text='Go Back' link="/" />
      <Link href="/add-asset">
        <Button size="sm" className="w-auto">Add New Asset</Button>
      </Link>

      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : assets && assets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className='hidden md:table-cell'>Manufacturer</TableHead>
                  <TableHead className='hidden md:table-cell'>Color</TableHead>
                  <TableHead className='hidden md:table-cell'>Serial Number</TableHead>
                  <TableHead className='hidden md:table-cell'>Purchase Price</TableHead>
                  <TableHead className='hidden md:table-cell'>Depreciation</TableHead>
                  <TableHead className='hidden md:table-cell'>Dispose Value</TableHead>
                  <TableHead className='hidden md:table-cell'>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.title}</TableCell>
                    <TableCell>{asset.manufacturer}</TableCell>
                    <TableCell>{asset.color}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>R{asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell>R{asset.depreciation.toFixed(2)}%</TableCell>
                    <TableCell>R{asset.disposeValue.toFixed(2)}</TableCell>
                    <TableCell>{asset.assignedTo}</TableCell>
                    <TableCell>
                      <Link href={`/assets/edit/${asset.id}`}>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>Edit</button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">No assets found</p>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
