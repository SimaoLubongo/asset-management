// components/AssetsTable.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Asset = {
  id: string;
  nome: string;
  price: number;
  autor: string;
};

type AssetsTableProps = {
  assets: Asset[] | null;
  loading: boolean;
};

export function AssetsTable({ assets, loading }: AssetsTableProps) {
  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle>Lists of Assets</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : assets && assets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Preço</TableHead>
                <TableHead className="hidden md:table-cell">Autor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">R{asset.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">{asset.autor}</TableCell>
                  <TableCell>
                    <Link href={`/assets/edit-asset?id=${asset.id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-xs">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">Nenhum ativo encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
}