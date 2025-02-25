"use client";

import { useEffect, useState } from "react";
import AssetsTable from "@/components/AssetsTable";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

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

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets");
        if (!response.ok) {
          throw new Error(`Error loading assets: ${response.statusText}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Unknown error");
        }
        setAssets(result.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <BackButton text="Go Back" link="/" />
      <Link href="/add-asset">
        <Button size="sm" className="w-auto">Add New Asset</Button>
      </Link>
      <AssetsTable assets={assets} loading={loading} />
      <Toaster />
    </div>
  );
}