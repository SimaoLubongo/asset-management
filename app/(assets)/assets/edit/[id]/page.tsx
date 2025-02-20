'use client';

import BackButton from '@/components/BackButton';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { use, useEffect, useState } from 'react';

// Define the Zod schema based on the Asset model
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
  serialNumber: z.string().min(1, { message: 'Serial Number is required' }),
  purchaseDate: z.string().min(1, { message: 'Purchase Date is required' }),
  purchasePrice: z.number().min(0, { message: 'Purchase Price must be a positive number' }),
  depreciation: z.number().min(0, { message: 'Depreciation must be a positive number' }),
  disposeValue: z.number().min(0, { message: 'Dispose Value must be a positive number' }),
  assignedTo: z.string().min(1, { message: 'Assigned To is required' }),
});

interface AssetEditPageProps {
  params: Promise<{ id: string }>;
}

const AssetEditPage = ({ params }: AssetEditPageProps) => {
  const { toast } = useToast();
  const resolvedParams = use(params); // ✅ Unwrap params
  const assetId = resolvedParams.id;
  
  const [asset, setAsset] = useState<any>(null);

  // Fetch the asset data from API
  useEffect(() => {
    const fetchAsset = async () => {
      const res = await fetch(`/api/assets/${assetId}`);
      const data = await res.json();
      setAsset(data);
    };
    fetchAsset();
  }, [assetId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      manufacturer: '',
      color: '',
      serialNumber: '',
      purchaseDate: '',
      purchasePrice: 0,
      depreciation: 0,
      disposeValue: 0,
      assignedTo: '',
    },
  });

  // Reset form when asset is loaded
  useEffect(() => {
    if (asset) {
      form.reset(asset);
    }
  }, [asset, form.reset]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: 'Asset has been updated successfully',
      description: `Updated asset: ${data.title}`,
    });
  };

  if (!asset) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BackButton text='Back To Assets' link='/assets' />
      <h3 className='text-2xl mb-4'>Edit Asset</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          {/* Title Field */}
          <FormField control={form.control} name='title' render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter Title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Manufacturer Field */}
          <FormField control={form.control} name='manufacturer' render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder='Enter Manufacturer' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button className='w-full dark:bg-slate-800 dark:text-white'>
            Update Asset
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AssetEditPage;
