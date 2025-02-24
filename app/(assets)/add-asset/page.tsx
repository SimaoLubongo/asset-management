"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

// Defining the asset form fields based on Prisma model
type AssetFormData = {
  title: string;
  manufacturer: string;
  color: string;
  serialNumber: string;
  purchasePrice: number;
  depreciation: number;
  disposeValue: number;
  assignedTo: string;
};

export default function AddAssetPage() {
  const { register, handleSubmit, reset } = useForm<AssetFormData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: AssetFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          manufacturer: data.manufacturer,
          color: data.color,
          serialNumber: data.serialNumber,
          purchasePrice: parseFloat(data.purchasePrice.toString()),
          depreciation: parseFloat(data.depreciation.toString()),
          disposeValue: parseFloat(data.disposeValue.toString()),
          assignedTo: data.assignedTo,
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success!",
          description: "Asset added successfully!",
          variant: "default",
        });
        reset();
        router.push("/assets");
      } else {
        toast({
          title: "Error!",
          description: result.error || "Failed to add the asset.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding asset:", error); // Logs the error to the console
  
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Error connecting to the server.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <BackButton text='Go Back' link="/" />

      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Add New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: true })} placeholder="Asset title" />
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" {...register("manufacturer", { required: true })} placeholder="Manufacturer" />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" {...register("color", { required: true })} placeholder="Color" />
            </div>
            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" {...register("serialNumber", { required: true })} placeholder="Serial Number" />
            </div>
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register("purchasePrice", { required: true })} placeholder="Purchase Price" />
            </div>
            <div>
              <Label htmlFor="depreciation">Depreciation</Label>
              <Input id="depreciation" type="number" step="0.01" {...register("depreciation", { required: true })} placeholder="Depreciation" />
            </div>
            <div>
              <Label htmlFor="disposeValue">Dispose Value</Label>
              <Input id="disposeValue" type="number" step="0.01" {...register("disposeValue", { required: true })} placeholder="Dispose Value" />
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" {...register("assignedTo", { required: true })} placeholder="Assigned to" />
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="" disabled={loading}>
                {loading ? "Adding..." : "Add Asset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}