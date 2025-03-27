export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      parking_spots: {
        Row: {
          address: string
          amenities: string[] | null
          available: boolean
          created_at: string
          description: string | null
          host_id: string
          id: string
          image: string | null
          latitude: number
          longitude: number
          name: string
          price: number
          price_unit: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          available?: boolean
          created_at?: string
          description?: string | null
          host_id: string
          id?: string
          image?: string | null
          latitude: number
          longitude: number
          name: string
          price: number
          price_unit?: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          available?: boolean
          created_at?: string
          description?: string | null
          host_id?: string
          id?: string
          image?: string | null
          latitude?: number
          longitude?: number
          name?: string
          price?: number
          price_unit?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          Allergens: string | null
          "Available In": string | null
          Barcode: number
          Brand: string | null
          "Calories (kcal)": number | null
          "Carbohydrates (g)": number | null
          Category: string | null
          "Cross-Contaminants": string | null
          "Fat (g)": number | null
          Ingredients: string | null
          Labels: string | null
          "Nutrition Grade": string | null
          "Product Name": string | null
          "Proteins (g)": number | null
        }
        Insert: {
          Allergens?: string | null
          "Available In"?: string | null
          Barcode: number
          Brand?: string | null
          "Calories (kcal)"?: number | null
          "Carbohydrates (g)"?: number | null
          Category?: string | null
          "Cross-Contaminants"?: string | null
          "Fat (g)"?: number | null
          Ingredients?: string | null
          Labels?: string | null
          "Nutrition Grade"?: string | null
          "Product Name"?: string | null
          "Proteins (g)"?: number | null
        }
        Update: {
          Allergens?: string | null
          "Available In"?: string | null
          Barcode?: number
          Brand?: string | null
          "Calories (kcal)"?: number | null
          "Carbohydrates (g)"?: number | null
          Category?: string | null
          "Cross-Contaminants"?: string | null
          "Fat (g)"?: number | null
          Ingredients?: string | null
          Labels?: string | null
          "Nutrition Grade"?: string | null
          "Product Name"?: string | null
          "Proteins (g)"?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          allergens: string[] | null
          barcode: string
          created_at: string
          id: string
          ingredients: string | null
          product_name: string
        }
        Insert: {
          allergens?: string[] | null
          barcode: string
          created_at?: string
          id?: string
          ingredients?: string | null
          product_name: string
        }
        Update: {
          allergens?: string[] | null
          barcode?: string
          created_at?: string
          id?: string
          ingredients?: string | null
          product_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          profile_image: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          profile_image?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profile_image?: string | null
          role?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          date_range: Json
          download_url: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_range: Json
          download_url?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_range?: Json
          download_url?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          end_time: string
          id: string
          spot_id: string
          start_time: string
          status: string
          total_cost: number
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          spot_id: string
          start_time: string
          status?: string
          total_cost: number
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          spot_id?: string
          start_time?: string
          status?: string
          total_cost?: number
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reservation_id: string | null
          spot_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reservation_id?: string | null
          spot_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reservation_id?: string | null
          spot_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      scan_history: {
        Row: {
          detected_allergens: string[] | null
          id: string
          is_safe: boolean
          product_id: string
          scanned_at: string
          user_id: string | null
        }
        Insert: {
          detected_allergens?: string[] | null
          id?: string
          is_safe: boolean
          product_id: string
          scanned_at?: string
          user_id?: string | null
        }
        Update: {
          detected_allergens?: string[] | null
          id?: string
          is_safe?: boolean
          product_id?: string
          scanned_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_allergies: {
        Row: {
          allergies: string[]
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string
          created_at: string
          id: string
          license_plate: string
          make: string
          model: string
          user_id: string
          year: number
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          license_plate: string
          make: string
          model: string
          user_id: string
          year: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          license_plate?: string
          make?: string
          model?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
