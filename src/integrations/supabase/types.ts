export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          business_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          end_time: string
          id: string
          notes: string | null
          service: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          business_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          end_time: string
          id?: string
          notes?: string | null
          service: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          business_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          service?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_connections: {
        Row: {
          created_at: string
          id: string
          message: string | null
          requester_business_id: string
          status: string
          target_business_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          requester_business_id: string
          status?: string
          target_business_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          requester_business_id?: string
          status?: string
          target_business_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_connections_requester_business_id_fkey"
            columns: ["requester_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_connections_target_business_id_fkey"
            columns: ["target_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_ideas: {
        Row: {
          business_context: string | null
          created_at: string | null
          id: string
          idea_description: string
          industry: string
          location: string
          updated_at: string | null
          user_id: string
          validation_result: Json | null
        }
        Insert: {
          business_context?: string | null
          created_at?: string | null
          id?: string
          idea_description: string
          industry: string
          location: string
          updated_at?: string | null
          user_id: string
          validation_result?: Json | null
        }
        Update: {
          business_context?: string | null
          created_at?: string | null
          id?: string
          idea_description?: string
          industry?: string
          location?: string
          updated_at?: string | null
          user_id?: string
          validation_result?: Json | null
        }
        Relationships: []
      }
      business_messages: {
        Row: {
          connection_id: string
          created_at: string
          id: string
          message: string
          read: boolean
          sender_business_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          id?: string
          message: string
          read?: boolean
          sender_business_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          sender_business_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "business_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_messages_sender_business_id_fkey"
            columns: ["sender_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_plan_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          idea_id: string
          notes: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          idea_id: string
          notes?: string | null
          task_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          idea_id?: string
          notes?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_plan_progress_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "business_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          business_type: Database["public"]["Enums"]["business_type"]
          contact_visibility: Database["public"]["Enums"]["contact_visibility"]
          created_at: string | null
          id: string
          location: string | null
          name: string
          setup_stage: Database["public"]["Enums"]["setup_stage"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_type: Database["public"]["Enums"]["business_type"]
          contact_visibility?: Database["public"]["Enums"]["contact_visibility"]
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          setup_stage?: Database["public"]["Enums"]["setup_stage"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_type?: Database["public"]["Enums"]["business_type"]
          contact_visibility?: Database["public"]["Enums"]["contact_visibility"]
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          setup_stage?: Database["public"]["Enums"]["setup_stage"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          business_id: string
          created_at: string | null
          email: string | null
          id: string
          last_visit: string | null
          name: string
          phone: string | null
          tags: string[] | null
          total_purchases: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name: string
          phone?: string | null
          tags?: string[] | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          phone?: string | null
          tags?: string[] | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          business_id: string
          category: string
          created_at: string | null
          expense_date: string | null
          id: string
          notes: string | null
          payment_method: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          business_id: string
          category: string
          created_at?: string | null
          expense_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          category?: string
          created_at?: string | null
          expense_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          id: string
          movement_date: string | null
          movement_type: string
          notes: string | null
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          movement_date?: string | null
          movement_type: string
          notes?: string | null
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          movement_date?: string | null
          movement_type?: string
          notes?: string | null
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          min_quantity: number | null
          price_per_unit: number | null
          product_name: string
          seller_business_id: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          price_per_unit?: number | null
          product_name: string
          seller_business_id: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          price_per_unit?: number | null
          product_name?: string
          seller_business_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_seller_business_id_fkey"
            columns: ["seller_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_requests: {
        Row: {
          buyer_business_id: string
          created_at: string | null
          deadline: string | null
          id: string
          max_budget: number | null
          product_needed: string
          quantity: number | null
          status: string | null
        }
        Insert: {
          buyer_business_id: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          max_budget?: number | null
          product_needed: string
          quantity?: number | null
          status?: string | null
        }
        Update: {
          buyer_business_id?: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          max_budget?: number | null
          product_needed?: string
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_requests_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_data: {
        Row: {
          available_time: string | null
          business_type: string | null
          company_description: string | null
          created_at: string | null
          employee_count: string | null
          id: string
          initial_budget: string | null
          main_challenge: string | null
          main_problem: string | null
          monthly_customers: string | null
          monthly_revenue: string | null
          problem_description: string | null
          stage: string
          target_customer: string | null
          time_in_business: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_time?: string | null
          business_type?: string | null
          company_description?: string | null
          created_at?: string | null
          employee_count?: string | null
          id?: string
          initial_budget?: string | null
          main_challenge?: string | null
          main_problem?: string | null
          monthly_customers?: string | null
          monthly_revenue?: string | null
          problem_description?: string | null
          stage: string
          target_customer?: string | null
          time_in_business?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_time?: string | null
          business_type?: string | null
          company_description?: string | null
          created_at?: string | null
          employee_count?: string | null
          id?: string
          initial_budget?: string | null
          main_challenge?: string | null
          main_problem?: string | null
          monthly_customers?: string | null
          monthly_revenue?: string | null
          problem_description?: string | null
          stage?: string
          target_customer?: string | null
          time_in_business?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      outbox_events: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          business_id: string
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          business_id: string
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          business_id?: string
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbox_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          business_id: string
          category: string | null
          cost_price: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          id: string
          image_url: string | null
          min_stock: number | null
          name: string
          selling_price: number
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          business_id: string
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name: string
          selling_price: number
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          business_id?: string
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name?: string
          selling_price?: number
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          onboarding_completed: boolean | null
          phone: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      regulatory_info: {
        Row: {
          business_type: string | null
          cost_estimate_ars: number | null
          description: string | null
          id: string
          last_updated: string | null
          official_link: string | null
          permit_name: string
          processing_days: number | null
          province: string
          required: boolean | null
        }
        Insert: {
          business_type?: string | null
          cost_estimate_ars?: number | null
          description?: string | null
          id?: string
          last_updated?: string | null
          official_link?: string | null
          permit_name: string
          processing_days?: number | null
          province: string
          required?: boolean | null
        }
        Update: {
          business_type?: string | null
          cost_estimate_ars?: number | null
          description?: string | null
          id?: string
          last_updated?: string | null
          official_link?: string | null
          permit_name?: string
          processing_days?: number | null
          province?: string
          required?: boolean | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          business_id: string
          created_at: string | null
          customer_id: string | null
          id: string
          items: Json
          notes: string | null
          payment_method: string
          sale_date: string | null
          total_amount: number
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items: Json
          notes?: string | null
          payment_method: string
          sale_date?: string | null
          total_amount: number
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json
          notes?: string | null
          payment_method?: string
          sale_date?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tools: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          tool_key: string
          tool_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          tool_key: string
          tool_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          tool_key?: string
          tool_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      appointments_safe: {
        Row: {
          appointment_date: string | null
          business_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string | null
          id: string | null
          notes: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date?: string | null
          business_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string | null
          id?: string | null
          notes?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string | null
          business_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string | null
          id?: string | null
          notes?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "entrepreneur" | "business" | "pyme_enterprise" | "admin"
      business_type:
        | "bakery"
        | "hair_salon"
        | "grocery_store"
        | "restaurant"
        | "pharmacy"
        | "other"
      contact_visibility: "public" | "marketplace_only" | "private"
      setup_stage: "idea_validation" | "blueprint" | "operational"
      user_type: "entrepreneur" | "business_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["entrepreneur", "business", "pyme_enterprise", "admin"],
      business_type: [
        "bakery",
        "hair_salon",
        "grocery_store",
        "restaurant",
        "pharmacy",
        "other",
      ],
      contact_visibility: ["public", "marketplace_only", "private"],
      setup_stage: ["idea_validation", "blueprint", "operational"],
      user_type: ["entrepreneur", "business_owner"],
    },
  },
} as const
