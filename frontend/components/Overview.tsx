"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "./ProductCard";

export default function Overview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + parseFloat(p.price || "0"), 0),
    [products]
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).length,
    [products]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).length,
    [products]
  );

  const recent = useMemo(() => products.slice(0, 8), [products]);

  if (loading) {
    return (
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xl text-slate-600 dark:text-slate-400">Loading overview...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Snapshot of your Amazon products</p>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Products</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{products.length}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Value</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">${totalValue.toFixed(2)}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Categories</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{categories}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Brands</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{brands}</div></CardContent>
          </Card>
        </div>

        {/* Recent products */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recent.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </div>
  );
}
