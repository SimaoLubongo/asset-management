"use client";

import { useEffect, useState } from "react";
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
import { Toaster } from "@/components/ui/toaster";
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
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AssetsListTable from "./assets-list";

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
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("all");
  const itemsPerPage = 5;
  const router = useRouter();

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

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
        setTotalPages(Math.ceil(result.data.length / itemsPerPage));
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
  }, [mounted]);

  const handleEdit = (url: string) => {
    router.push(url);
  };

  const handleDelete = async (id: string) => {
    if (!mounted) return;
    
    try {
      const response = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete asset");
      }
      setAssets((prevAssets) => {
        const updatedAssets = prevAssets ? prevAssets.filter((asset) => asset.id !== id) : null;
        if (updatedAssets) {
          setTotalPages(Math.ceil(updatedAssets.length / itemsPerPage));
          if (currentPage > Math.ceil(updatedAssets.length / itemsPerPage)) {
            setCurrentPage(prev => Math.max(1, prev - 1));
          }
        }
        return updatedAssets;
      });
      toast({ title: "Asset deleted successfully", variant: "success" });
    } catch (error) {
      toast({
        title: "Error deleting asset",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const getFilteredAssets = () => {
    if (!assets || !mounted) return [];
    
    return assets.filter(asset => {
      const searchMatch = searchTerm.toLowerCase() === '' || 
        Object.values(asset).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const filterMatch = filterField === 'all' || 
        (filterField === 'highValue' && asset.purchasePrice > 10000) ||
        (filterField === 'lowValue' && asset.purchasePrice <= 10000) ||
        (filterField === 'highDepreciation' && asset.depreciation > 50) ||
        (filterField === 'lowDepreciation' && asset.depreciation <= 50);

      return searchMatch && filterMatch;
    });
  };

  const getPaginatedAssets = () => {
    const filteredAssets = getFilteredAssets();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssets.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (!mounted) return;

    const filteredAssets = getFilteredAssets();
    setTotalPages(Math.ceil(filteredAssets.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, filterField, assets, mounted]);

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

  if (!mounted) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <BackButton text="Go Back" link="/" />
      <Link href="/add-asset">
        <Button size="sm" className="w-auto">Add New Asset</Button>
      </Link>
        <AssetsListTable />
      
      <Toaster />
    </div>
  );
}