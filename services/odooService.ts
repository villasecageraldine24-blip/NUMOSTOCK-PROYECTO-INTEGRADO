import { Product, Order } from '../types';

/**
 * Simulates the backend logic connecting to Odoo ERP.
 * In a real app, this would be an API client interacting with Odoo's XML-RPC or REST API.
 */

export const OdooService = {
  // Simulate checking real-time stock
  checkStock: async (productId: string, requestedQty: number, currentProducts: Product[]): Promise<boolean> => {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return false;
    
    return product.stock >= requestedQty;
  },

  // Simulate creating a Sale Order in Odoo
  createSaleOrder: async (order: Order): Promise<{ success: boolean; orderId: string }> => {
    console.log("Creating Odoo Sale Order for:", order.customerName);
    console.log("Items:", order.items);
    
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate Order ID from Odoo
    return { success: true, orderId: `SO-${Math.floor(Math.random() * 10000)}` };
  },

  // Check Reorder Points (ROP) and simulate creating a Purchase Order if needed
  checkAndTriggerReplenishment: async (updatedProducts: Product[]) => {
    updatedProducts.forEach(product => {
      if (product.stock <= product.rop) {
        console.warn(`⚠️ STOCK ALERT: ${product.name} (ID: ${product.id}) is below ROP (${product.rop}). Current: ${product.stock}`);
        console.log(`🔄 Generating Auto-Purchase Order in Odoo for supplier...`);
        // In real life, this triggers a PO creation in Odoo
      }
    });
  }
};