"use client";
 
import BackButton from "@/components/BackButton";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
// Define the Zod schema based on the Asset model
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  serialNumber: z.string().min(1, { message: "Serial Number is required" }),
  purchaseDate: z.string().min(1, { message: "Purchase Date is required" }),
  purchasePrice: z
    .string()
    .min(1, { message: "Purchase Price is required" })
    .transform((val) => parseFloat(val)),
  depreciation: z
    .string()
    .min(1, { message: "Depreciation is required" })
    .transform((val) => parseFloat(val)),
  disposeValue: z
    .string()
    .min(1, { message: "Dispose Value is required" })
    .transform((val) => parseFloat(val)),
  assignedTo: z.string().min(1, { message: "Assigned To is required" }),
});
 
interface AssetEditPageProps {
  params: Promise<{ id: string }>;
}
 
const AssetEditPage = ({ params }: AssetEditPageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params); // ✅ Unwrap params
  const assetId = resolvedParams.id;
 
  const [asset, setAsset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
 
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      manufacturer: "",
      color: "",
      serialNumber: "",
      purchaseDate: "",
      purchasePrice: "0",
      depreciation: "0",
      disposeValue: "0",
      assignedTo: "",
    },
  });
 
  // Fetch the asset data from API
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/assets/${assetId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
 
        // Format the asset data for the form
        const formattedAsset = {
          ...data.data,
          purchasePrice: data.data.purchasePrice.toString(),
          depreciation: data.data.depreciation.toString(),
          disposeValue: data.data.disposeValue.toString(),
        };
 
        setAsset(formattedAsset);
        form.reset(formattedAsset);
      } catch (error) {
        console.error("Error fetching asset:", error);
        toast({
          title: "Error",
          description: "Failed to load asset.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchAsset();
  }, [assetId, toast, form]);
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
 
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
 
      const updatedAsset = await res.json();
 
      toast({
        title: "Asset Updated",
        description: `Successfully updated ${updatedAsset.data.title}`,
      });
 
      // Navigate back to the assets page after successful update
      router.push("/assets");
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update asset",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
 
  if (isLoading && !asset) {
    return <div>Loading...</div>;
  }
 
  if (!asset && !isLoading) {
    return <div>Asset not found.</div>;
  }
 
  return (
    <div className="container mx-auto py-8">
      <BackButton text="Go Back" link="/" />
      <h1 className="text-2xl font-bold mb-6">Edit Asset</h1>
 
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Asset title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="Manufacturer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Serial number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="depreciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depreciation (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="disposeValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispose Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
 
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/assets")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 dark:bg-slate-800 dark:text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Asset"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
 
export default AssetEditPage;