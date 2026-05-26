export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          product_id: number
          quantity: number
          size: string
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          quantity?: number
          size?: string
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string | null
          name: string
          price: number
          restaurant_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name: string
          price: number
          restaurant_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          price?: number
          restaurant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          delivery_fee: number
          id: number
          image: string | null
          name: string
          rating: number
        }
        Insert: {
          created_at?: string
          delivery_fee?: number
          id?: number
          image?: string | null
          name: string
          rating?: number
        }
        Update: {
          created_at?: string
          delivery_fee?: number
          id?: number
          image?: string | null
          name?: string
          rating?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          expo_push_token: string | null
          full_name: string | null
          group: string
          id: string
          stripe_customer_id: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}