import type { MenuItem, Order, OrderItem } from "./types";

const INITIAL_MENU: MenuItem[] = [
  {
    id: "vtea-1",
    name: "Trà Ô Long",
    price: 35000,
    category: "Trà Nguyên Chất",
    description: "Hương ô long rang nhẹ thanh mát, hậu ngọt dịu tự nhiên.",
    image: "/images/tra-o-long.jpg",
    badge: "Best Seller",
  },
  {
    id: "vtea-2",
    name: "Trà Nhài Sữa",
    price: 38000,
    category: "Trà Sữa",
    description: "Trà xanh ướp hoa nhài thơm ngát hòa quyện sữa béo mịn.",
    image: "/images/tra-nhai-sua.jpg",
    badge: "Yêu thích",
  },
  {
    id: "vtea-3",
    name: "Trà Sữa Trân Châu Đường Đen",
    price: 45000,
    category: "Trà Sữa",
    description: "Hồng trà đậm vị cùng trân châu nấu đường đen dẻo thơm.",
    image: "/images/tra-sua-tran-chau.jpg",
    badge: "Signature",
  },
  {
    id: "vtea-4",
    name: "Matcha Kem Cheese",
    price: 48000,
    category: "Macchiato",
    description: "Matcha Uji Nhật Bản phủ lớp kem phô mai mặn béo ngậy.",
    image: "/images/matcha-kem-cheese.jpg",
  },
  {
    id: "vtea-5",
    name: "Trà Đào Cam Sả",
    price: 40000,
    category: "Trà Trái Cây",
    description: "Đào miếng giòn ngọt kết hợp cam tươi và hương sả dịu nhẹ.",
    image: "/images/tra-dao-cam-sa.jpg",
  },
  {
    id: "vtea-6",
    name: "Hồng Trà Kem Muối",
    price: 39000,
    category: "Macchiato",
    description: "Hồng trà ủ lạnh đậm đà kết hợp lớp kem muối biển sánh mịn.",
    image: "/images/hong-tra-kem-muoi.jpg",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "842910",
    items: [
      {
        menuItemId: "vtea-1",
        name: "Trà Ô Long",
        price: 35000,
        quantity: 2,
        ice: "50%",
        sugar: "70%",
      },
      {
        menuItemId: "vtea-4",
        name: "Matcha Kem Cheese",
        price: 48000,
        quantity: 1,
        ice: "100%",
        sugar: "70%",
      },
    ],
    totalAmount: 118000,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "739415",
    items: [
      {
        menuItemId: "vtea-2",
        name: "Trà Nhài Sữa",
        price: 38000,
        quantity: 2,
        ice: "Ít đá",
        sugar: "50%",
      },
    ],
    totalAmount: 76000,
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
  },
  {
    id: "615824",
    items: [
      {
        menuItemId: "vtea-3",
        name: "Trà Sữa Trân Châu Đường Đen",
        price: 45000,
        quantity: 2,
        ice: "100%",
        sugar: "100%",
      },
      {
        menuItemId: "vtea-5",
        name: "Trà Đào Cam Sả",
        price: 40000,
        quantity: 1,
        ice: "50%",
        sugar: "70%",
      },
    ],
    totalAmount: 130000,
    createdAt: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
  },
  {
    id: "508271",
    items: [
      {
        menuItemId: "vtea-6",
        name: "Hồng Trà Kem Muối",
        price: 39000,
        quantity: 1,
        ice: "50%",
        sugar: "50%",
      },
      {
        menuItemId: "vtea-1",
        name: "Trà Ô Long",
        price: 35000,
        quantity: 1,
        ice: "100%",
        sugar: "70%",
      },
    ],
    totalAmount: 74000,
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
  },
  {
    id: "491603",
    items: [
      {
        menuItemId: "vtea-4",
        name: "Matcha Kem Cheese",
        price: 48000,
        quantity: 2,
        ice: "Ít đá",
        sugar: "70%",
      },
    ],
    totalAmount: 96000,
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
  },
];

interface VTeaStore {
  menu: MenuItem[];
  orders: Order[];
}

const globalForVTea = globalThis as typeof globalThis & {
  __vteaStore?: VTeaStore;
};

function getStore(): VTeaStore {
  if (!globalForVTea.__vteaStore) {
    globalForVTea.__vteaStore = {
      menu: [...INITIAL_MENU],
      orders: [...INITIAL_ORDERS],
    };
  }
  return globalForVTea.__vteaStore;
}

export function getMenuItems(): MenuItem[] {
  return getStore().menu;
}

export function addMenuItem(input: {
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
}): MenuItem {
  const store = getStore();
  const newItem: MenuItem = {
    id: `vtea-${Date.now()}`,
    name: input.name.trim(),
    price: Math.round(input.price),
    category: input.category?.trim() || "Món Mới",
    description:
      input.description?.trim() ||
      "Hương vị trà trái cây tươi mới, pha chế chuẩn vị VTea.",
    image: input.image?.trim() || "",
    badge: "Mới",
  };
  store.menu.unshift(newItem);
  return newItem;
}

export function updateMenuItem(
  id: string,
  input: {
    name?: string;
    price?: number;
    image?: string;
  }
): MenuItem | undefined {
  const store = getStore();
  const item = store.menu.find((entry) => entry.id === id);
  if (!item) return undefined;

  if (typeof input.name === "string" && input.name.trim()) {
    item.name = input.name.trim();
  }
  if (typeof input.price === "number" && Number.isFinite(input.price) && input.price > 0) {
    item.price = Math.round(input.price);
  }
  if (typeof input.image === "string" && input.image.trim()) {
    item.image = input.image.trim();
  }

  return item;
}

export function getOrders(): Order[] {
  return getStore().orders;
}

export function getOrderById(id: string): Order | undefined {
  return getStore().orders.find((order) => order.id === id);
}

export function createOrder(input: {
  items: OrderItem[];
  totalAmount: number;
}): Order {
  const store = getStore();
  const id = Math.floor(100000 + Math.random() * 900000).toString();
  const order: Order = {
    id,
    items: input.items,
    totalAmount: Math.round(input.totalAmount),
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(order);
  return order;
}

export function formatVND(amount: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}
