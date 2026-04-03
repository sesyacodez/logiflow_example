// TypeScript type definitions matching the API contracts for LogiFlow AI

export interface DeliveryPoint {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  priority: 1 | 2 | 3;
  stock_level: number;
  stock_capacity: number;
  demand_ratio: number;
  last_delivery_at: string; // ISO 8601
  score: number;
  recent_events?: PriorityEvent[];
  pending_routes?: string[];
}

export interface Route {
  id: string;
  truck_id: string;
  from: string;
  to: string;
  status: 'planned' | 'in_transit' | 'redirected' | 'delivered';
  is_ghost: boolean;
  redirected_to: string | null;
  eta_minutes: number;
}

export interface InventoryItem {
  delivery_point_id: string;
  resource_type: string;
  quantity: number;
  unit: string;
  updated_at: string;
}

export interface PrioritySuggestion {
  action: 'redirect';
  truck_id: string;
  from_destination: string;
  to_destination: string;
  reason: string;
  require_approval: boolean;
}

export interface PriorityScore {
  delivery_point_id: string;
  score: number;
  demand_ratio: number;
  priority_multiplier: number;
  time_since_last_delivery: number;
  calculated_at: string;
}

export interface PriorityEvent {
  type: 'priority_change';
  from: number;
  to: number;
  at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'dispatcher' | 'warehouse' | 'manager';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export type SyncStatus = 'live' | 'offline' | 'syncing';

export interface WsInventoryUpdate {
  type: 'inventory_update';
  delivery_point_id: string;
  new_stock: number;
  new_priority: 1 | 2 | 3;
  timestamp: string;
}

export interface WsPriorityAlert {
  type: 'priority_alert';
  delivery_point_id: string;
  previous_priority: number;
  new_priority: number;
  message: string;
}

export type WsEvent = WsInventoryUpdate | WsPriorityAlert;
