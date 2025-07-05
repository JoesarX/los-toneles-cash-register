// Product types
export interface ProductOption {
    title: string;
    additionalPrice: number;
}

export interface Product {
    id: string;
    title: string;
    desc: string;
    img?: string | null;
    price: number;
    isFeatured: boolean;
    isVisible: boolean;
    options?: ProductOption[];
    catSlug: string;
    createdAt: Date;
}

// Order types
export interface OrderItem {
    id: string;
    productId: string;
    product?: Product;
    quantity: number;
    price: number;
    options?: ProductOption | null;
}

export interface Order {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    totalAmount: number;
    status: string;
    paymentType: string;
    userId: string;
    orderItems: OrderItem[];
    cashGiven?: number | null;
    change?: number | null;
    sessionId?: string | null;
}

// Cart types
export interface CartItem {
    id: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    options?: ProductOption | null;
    img?: string | null;
}

export interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

// Cash session types
export interface CashSession {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date | null;
    startingCash: number;
    endingCash?: number | null;
    totalSales: number;
    isActive: boolean;
    notes?: string | null;
}

// User types
export interface User {
    id: string;
    name?: string | null;
    email: string;
    isAdmin: boolean;
    isCashier: boolean;
}

// Report types
export interface DailySummary {
    date: Date;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topProducts: {
        productId: string;
        productName: string;
        quantity: number;
        revenue: number;
    }[];
}

export interface SalesReport {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    salesByCategory: {
        category: string;
        revenue: number;
        orderCount: number;
    }[];
    salesByDay?: {
        date: string;
        revenue: number;
        orders: number;
    }[];
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    error?: string;
    user?: User;
}