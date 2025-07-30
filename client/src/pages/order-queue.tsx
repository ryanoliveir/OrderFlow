import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusColor(status: string) {
  switch (status) {
    case "ready":
      return "bg-emerald-400";
    case "preparing":
      return "bg-yellow-400";
    case "received":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "ready":
      return "Ready to serve";
    case "preparing":
      return "Preparing";
    case "received":
      return "Order received";
    default:
      return "Unknown";
  }
}

function getAvatarColor(index: number) {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-green-100 text-green-600",
    "bg-indigo-100 text-indigo-600",
    "bg-pink-100 text-pink-600",
    "bg-orange-100 text-orange-600",
    "bg-teal-100 text-teal-600",
    "bg-red-100 text-red-600",
  ];
  return colors[index % colors.length];
}

function getTypeColor(type: string) {
  if (type.includes("Sobremesa") && type.includes("Lanche")) {
    return ["bg-blue-100 text-blue-700", "bg-orange-100 text-orange-700"];
  } else if (type.includes("Sobremesa")) {
    return ["bg-emerald-100 text-emerald-700"];
  } else if (type.includes("Lanche")) {
    return ["bg-blue-100 text-blue-700"];
  }
  return ["bg-gray-100 text-gray-700"];
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const typeColors = getTypeColor(order.orderType);
  const types = order.orderType.split("/");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut",
        layout: { duration: 0.3 }
      }}
    >
      <Card className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAvatarColor(index)}`}>
                <span className="font-medium text-sm">
                  {getInitials(order.studentName)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{order.studentName}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {types.map((type, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${typeColors[idx] || typeColors[0]}`}
                    >
                      {type.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-slate-600 mb-3">
              {order.details}
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-xs text-slate-400 mb-1">Ordered</div>
            <div className="text-sm font-medium text-slate-700">
              {formatTime(order.createdAt)}
            </div>
            <div className="text-xs text-slate-400">Today</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
            <span className="text-xs font-medium text-slate-600">
              {getStatusText(order.status)}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            #{String(index + 1).padStart(3, '0')}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No orders in queue</h3>
        <p className="text-slate-400">All orders have been processed</p>
      </div>
    </motion.div>
  );
}

export default function OrderQueue() {
  const queryClient = useQueryClient();
  
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const nextOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest("POST", `/api/orders/${orderId}/next`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  const visibleOrders = orders.slice(0, 5);
  const totalOrders = orders.length;

  const handleNextOrder = () => {
    if (visibleOrders.length > 0) {
      nextOrderMutation.mutate(visibleOrders[0].id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Order Queue</h1>
              <p className="text-sm text-slate-400">Manage student orders</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{totalOrders}</div>
              <div className="text-xs text-slate-400">Total Orders</div>
            </div>
          </div>
        </div>
      </header>

      {/* Order List */}
      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="max-w-md mx-auto">
          {visibleOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {visibleOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
        <div className="max-w-md mx-auto p-4">
          <Button
            onClick={handleNextOrder}
            disabled={visibleOrders.length === 0 || nextOrderMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {nextOrderMutation.isPending ? "Processing..." : "Next Order"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
