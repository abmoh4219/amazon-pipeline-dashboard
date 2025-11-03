import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: string, currency: string) => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum === 0) return "Price not available";
    
    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "CA$",
      BRL: "R$",
      PLN: "zł",
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${priceNum.toFixed(2)}`;
  };

  return (
    <Card className="group flex flex-col h-full border-0 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 rounded-xl">
      <CardHeader className="p-4 pb-2">
        <div className="relative w-full aspect-square mb-2 rounded-md overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-900">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No Image
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-2">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-slate-900 dark:text-slate-100">
          {product.title}
        </h3>

        {product.brand && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
            {product.brand}
          </p>
        )}

        <div className="space-y-2">
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {product.availability && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {product.availability}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {product.seller && (
          <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-1">
            Sold by: {product.seller}
          </p>
        )}
        <a
          href={`https://www.amazon.com/dp/${product.asin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2 px-4 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          View on Amazon
        </a>
      </CardFooter>
    </Card>
  );
}
