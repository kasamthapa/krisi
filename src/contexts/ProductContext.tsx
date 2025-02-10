'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Status } from '@prisma/client';

interface Product {
  id: string;
  farmerId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: 'KG' | 'PIECE' | 'DOZEN';
  category: 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'DAIRY' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  expiryDate: Date;
  createdAt: Date;
  images: string[];
  isUrgent: boolean;
  location: string;
}

interface ProductContextType {
  listProduct: (data: ProductData) => Promise<void>;
  updateProduct: (id: string, data: Partial<ProductData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProducts: (filters?: ProductFilters) => Promise<Product[]>;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  expiryDate?: Date;
  isUrgent: boolean;
  forDonation: boolean;
  imageUrl?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const ProductContext = createContext<ProductContextType>({
  listProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  getProducts: async () => [],
});

// Demo data
const demoProducts: Product[] = [
  {
    id: '1',
    farmerId: '1',
    name: 'Fresh Tomatoes',
    description: 'Organic tomatoes freshly harvested',
    price: 2.5,
    quantity: 100,
    unit: 'KG',
    category: 'VEGETABLES',
    status: 'APPROVED',
    expiryDate: new Date('2024-02-20'),
    createdAt: new Date('2024-02-10'),
    images: ['/demo/tomatoes.jpg'],
    isUrgent: false,
    location: 'Rural County',
  },
  {
    id: '2',
    farmerId: '1',
    name: 'Organic Apples',
    description: 'Sweet and crispy apples',
    price: 3.0,
    quantity: 50,
    unit: 'KG',
    category: 'FRUITS',
    status: 'PENDING',
    expiryDate: new Date('2024-02-25'),
    createdAt: new Date('2024-02-10'),
    images: ['/demo/apples.jpg'],
    isUrgent: false,
    location: 'Rural County',
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(demoProducts);

  const listProduct = async (data: ProductData) => {
    // Implementation of listProduct
  };

  const updateProduct = async (id: string, data: Partial<ProductData>) => {
    // Implementation of updateProduct
  };

  const deleteProduct = async (id: string) => {
    // Implementation of deleteProduct
  };

  const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
    // Implementation of getProducts
    return [];
  };

  return (
    <ProductContext.Provider 
      value={{
        listProduct,
        updateProduct,
        deleteProduct,
        getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext); 