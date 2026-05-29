export type Category = "All" | "Processors" | "Graphics Cards" | "Memory" | "Storage" | "Motherboards" | "Catalogs";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isNew?: boolean;
  specs?: string[];
}

export const CATEGORIES: Category[] = [
  "All",
  "Processors",
  "Graphics Cards",
  "Memory",
  "Storage",
  "Motherboards",
  "Catalogs",
];

export const PRODUCTS: Product[] = [
  {
    id: "cpu-1",
    name: "Intel Core i9-14900K",
    description: "24-Core, 32-Thread Desktop Processor. The ultimate processor for gaming and creating.",
    price: 589.99,
    category: "Processors",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isNew: true,
    specs: ["24 Cores (8P+16E)", "Up to 6.0 GHz", "LGA 1700"],
  },
  {
    id: "cpu-2",
    name: "AMD Ryzen 9 7950X3D",
    description: "16-Core, 32-Thread Desktop Processor featuring AMD 3D V-Cache Technology.",
    price: 649.00,
    category: "Processors",
    imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["16 Cores / 32 Threads", "Up to 5.7 GHz", "AM5 Socket"],
  },
  {
    id: "gpu-1",
    name: "NVIDIA GeForce RTX 4090",
    description: "24GB GDDR6X, Ada Lovelace Architecture, DLSS 3.",
    price: 1599.99,
    category: "Graphics Cards",
    imageUrl: "https://images.unsplash.com/photo-1616215330353-83ecb0ecad82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isNew: true,
    specs: ["24GB GDDR6X", "16384 CUDA Cores", "DLSS 3 Support"],
  },
  {
    id: "gpu-2",
    name: "AMD Radeon RX 7900 XTX",
    description: "24GB GDDR6, RDNA 3 Architecture, The Ultimate 4K Gaming Experience.",
    price: 999.99,
    category: "Graphics Cards",
    imageUrl: "https://images.unsplash.com/photo-1597116744525-4c01ff991d0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["24GB GDDR6", "DisplayPort 2.1", "RDNA 3"],
  },
  {
    id: "ram-1",
    name: "Corsair Dominator Platinum RGB 64GB",
    description: "2x32GB DDR5 6000MHz C30 Memory Kit.",
    price: 264.99,
    category: "Memory",
    imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["64GB (2x32GB)", "DDR5 6000MHz", "RGB Lighting"],
  },
  {
    id: "storage-1",
    name: "Samsung 990 PRO 2TB",
    description: "PCIe Gen4 NVMe M.2 Internal Solid State Drive.",
    price: 169.99,
    category: "Storage",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["2TB NVMe M.2", "Up to 7450 MB/s", "PCIe 4.0"],
  },
  {
    id: "mobo-1",
    name: "ASUS ROG Maximus Z790 Hero",
    description: "ATX Motherboard, LGA 1700, DDR5, PCIe 5.0.",
    price: 629.99,
    category: "Motherboards",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["Intel LGA 1700", "DDR5 Support", "PCIe 5.0 x16"],
  },
  {
    id: "catalog-1",
    name: "Laxmi 2026 Ultimate Workstation Build Guide",
    description: "A comprehensive catalog and guide for building the ultimate high-end workstation for 3D modeling and video editing.",
    price: 0,
    category: "Catalogs",
    imageUrl: "https://images.unsplash.com/photo-1588508065123-287b28e015ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isNew: true,
    specs: ["45 Pages", "Digital Download", "Free"],
  },
  {
    id: "catalog-2",
    name: "Laxmi Budget Gaming PC Part List",
    description: "Optimized part selections for high-performance 1080p and 1440p gaming under $1000.",
    price: 0,
    category: "Catalogs",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["12 Pages", "Digital Download", "Free"],
  }
];
