import { Product } from "@/lib/laxmi-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] relative">
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <Badge variant="secondary" className="bg-slate-800/80 text-cyan-400 border-none backdrop-blur-md">
          {product.category}
        </Badge>
        {product.isNew && (
          <Badge className="bg-emerald-500/80 text-white hover:bg-emerald-600/80 backdrop-blur-md">
            New
          </Badge>
        )}
      </div>

      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      <CardHeader className="flex-none pt-4 pb-2">
        <CardTitle className="text-xl text-slate-100 line-clamp-1">{product.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">{product.description}</p>
        {product.specs && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {product.specs.map((spec, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-300 border border-slate-700/50">
                {spec}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-none flex items-center justify-between pt-0 mt-auto border-t border-slate-800/50 bg-slate-950/20 p-4">
        <div className="text-xl font-bold text-cyan-400">
          {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800 hover:text-cyan-400">
            <Eye className="w-4 h-4" />
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.category === "Catalogs" ? "Get Catalog" : "Add to Cart"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
