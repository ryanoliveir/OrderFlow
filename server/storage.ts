import { type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  moveOrderToEnd(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private orders: Map<string, Order>;

  constructor() {
    this.orders = new Map();
    
    // Initialize with some sample orders
    this.initializeOrders();
  }

  private initializeOrders() {
    const sampleOrders: Omit<Order, 'id'>[] = [
      {
        studentName: "Rafael Pinto",
        orderType: "Sobremesa",
        details: "Chocolate cake slice with vanilla ice cream",
        status: "ready",
        createdAt: new Date("2024-07-30T21:00:34Z"),
      },
      {
        studentName: "Fernanda Rezende",
        orderType: "Sobremesa",
        details: "Tiramisu with coffee and mascarpone",
        status: "preparing",
        createdAt: new Date("2024-07-30T21:00:39Z"),
      },
      {
        studentName: "Larissa Silva",
        orderType: "Lanche",
        details: "Club sandwich with fries and pickle",
        status: "received",
        createdAt: new Date("2024-07-30T21:00:44Z"),
      },
      {
        studentName: "Felipe Antunes",
        orderType: "Lanche/Sobremesa",
        details: "Burger combo with brownie dessert",
        status: "preparing",
        createdAt: new Date("2024-07-30T21:00:49Z"),
      },
      {
        studentName: "Larissa Borges",
        orderType: "Lanche",
        details: "Caesar salad with grilled chicken",
        status: "received",
        createdAt: new Date("2024-07-30T21:00:55Z"),
      },
      {
        studentName: "João Silva",
        orderType: "Sobremesa",
        details: "Strawberry cheesecake",
        status: "ready",
        createdAt: new Date("2024-07-30T21:01:02Z"),
      },
      {
        studentName: "Maria Santos",
        orderType: "Lanche",
        details: "Grilled chicken wrap",
        status: "preparing",
        createdAt: new Date("2024-07-30T21:01:08Z"),
      },
      {
        studentName: "Pedro Lima",
        orderType: "Lanche",
        details: "Beef burger with onion rings",
        status: "received",
        createdAt: new Date("2024-07-30T21:01:15Z"),
      },
    ];

    sampleOrders.forEach(order => {
      const id = randomUUID();
      this.orders.set(id, { ...order, id });
    });
  }



  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "received",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async moveOrderToEnd(id: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    // Update the timestamp to move it to the end
    const updatedOrder = { ...order, createdAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
