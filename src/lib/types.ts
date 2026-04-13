// Database types matching the Supabase schema
export interface Profile {
  id: string
  email: string | null
  username: string
  full_name: string | null
  role: 'tour_manager' | 'crew'
  tour_id: string | null
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  user_id: string
  name: string
  artist_name: string
  start_date: string
  end_date: string
  tm_name: string | null
  tm_email: string | null
  booking_agent: string | null
  vehicle_type: 'bus' | 'van' | 'suv' | 'other'
  drive_speed_mph: number
  status: 'upcoming' | 'active' | 'completed'
  created_at: string
  updated_at: string
}

export interface DaySheet {
  id: string
  tour_id: string
  day_date: string
  city: string | null
  venue_name: string | null
  venue_address: string | null
  promoter_contact: string | null
  hotel_info: string | null
  notes: string | null
  is_show: boolean
  entries: DaySheetEntry[]
  created_at: string
  updated_at: string
}

export interface DaySheetEntry {
  time: string
  title: string
  notes?: string
  type: 'travel' | 'soundcheck' | 'show' | 'meeting' | 'other'
}

export interface Expense {
  id: string
  tour_id: string
  user_id: string
  date: string
  category: string
  description: string
  amount: number
  currency: string
  receipt_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  tour_id: string
  category: string
  limit_amount: number
  currency: string
  created_at: string
  updated_at: string
}

export interface MerchItem {
  id: string
  tour_id: string
  name: string
  sku: string | null
  unit_cost: number
  unit_price: number
  initial_stock: number
  current_stock: number
  created_at: string
  updated_at: string
}

export interface MerchSale {
  id: string
  tour_id: string
  item_id: string
  day_sheet_id: string | null
  quantity: number
  unit_price: number
  total: number
  venue_cut_pct: number
  notes: string | null
  created_at: string
}

export interface Settlement {
  id: string
  tour_id: string
  day_sheet_id: string | null
  venue_name: string
  show_date: string
  guarantee: number
  door_sales: number
  expenses_deducted: number
  net_payment: number
  currency: string
  paid: boolean
  paid_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CrewMember {
  id: string
  tour_id: string
  profile_id: string | null
  name: string
  email: string | null
  role: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface GuestListRequest {
  id: string
  tour_id: string
  requested_by: string
  guest_name: string
  guest_email: string | null
  guest_count: number
  pass_type: 'guest' | 'industry' | 'comp' | 'vip'
  notes: string | null
  status: 'pending' | 'approved' | 'denied'
  created_at: string
  updated_at: string
}

export interface Advance {
  id: string
  tour_id: string
  day_sheet_id: string | null
  venue_name: string
  show_date: string
  status: 'not_sent' | 'sent' | 'received' | 'confirmed'
  promoter_name: string | null
  promoter_email: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  tour_id: string | null
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  bucket: string
  created_at: string
  updated_at: string
}

export interface RoutingStop {
  id: string
  tour_id: string
  order_index: number
  city: string
  venue_name: string | null
  date: string
  distance_miles: number | null
  drive_time_hours: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TourInvitation {
  id: string
  tour_id: string
  invited_by: string
  email: string
  role: 'tour_manager' | 'crew'
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}
