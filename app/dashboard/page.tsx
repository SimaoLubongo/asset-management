"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

type Asset = {
  id: string;
  price: number;
};

export default function Dashboard() {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalPreco, setTotalPreco] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0); // Exemplo de total de usuários
  const [usuariosOnline, setUsuariosOnline] = useState(0); // Exemplo de total de usuários online
  const [loading, setLoading] = useState(true);
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
          const total = result.data.length; // Total de produtos
          const totalPrice = result.data.reduce((acc: number, asset: Asset) => acc + asset.price, 0); // Soma dos preços

          setTotalProdutos(total);
          setTotalPreco(totalPrice);
        } else {
          throw new Error(result.error || "Erro desconhecido");
        }
      } catch (error) {
        toast({
          title: "Erro!",
          description: error instanceof Error ? error.message : "Erro ao carregar dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Funções de exemplo para total de usuários e usuários online
    const fetchUserData = () => {
      setTotalUsuarios(50); // Simulando total de usuários
      setUsuariosOnline(10); // Simulando total de usuários online
    };

    fetchAssets();
    fetchUserData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Container Flexbox para os cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total de Produtos */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <p className="text-xl">{totalProdutos}</p>
            )}
          </CardContent>
        </Card>

        {/* Total de Preços */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Total de Preços</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <p className="text-xl">R$ {totalPreco.toFixed(2)}</p>
            )}
          </CardContent>
        </Card>

        {/* Total de Usuários */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl">{totalUsuarios}</p>
          </CardContent>
        </Card>

        {/* Total de Usuários Online */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Usuários Online</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl">{usuariosOnline}</p>
          </CardContent>
        </Card>
      </div>

      {/* Toaster do shadcn para exibir notificações */}
      <Toaster />
    </div>
  );
}
