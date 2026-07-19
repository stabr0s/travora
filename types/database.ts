export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// TODO: Replace these manually maintained table types with generated Supabase
// types once the schema stabilizes and the generation workflow is configured.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          destination: string | null;
          start_date: string | null;
          end_date: string | null;
          cover_image_url: string | null;
          status: "planning" | "upcoming" | "archived" | null;
          description: string | null;
          currency: string | null;
          public_share_enabled: boolean;
          public_share_token: string | null;
          public_share_created_at: string | null;
          public_share_updated_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          destination?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          cover_image_url?: string | null;
          status?: "planning" | "upcoming" | "archived" | null;
          description?: string | null;
          currency?: string | null;
          public_share_enabled?: boolean;
          public_share_token?: string | null;
          public_share_created_at?: string | null;
          public_share_updated_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "trips_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_members: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          role: "owner" | "editor" | "viewer";
          status: "active" | "invited" | "pending";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          role: "owner" | "editor" | "viewer";
          status: "active" | "invited" | "pending";
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["trip_members"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      places: {
        Row: {
          id: string;
          trip_id: string;
          title: string;
          category: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          map_order: number | null;
          status: "idea" | "planned" | "visited" | "rejected" | null;
          priority: "must-see" | "recommended" | "optional" | null;
          notes: string | null;
          website_url: string | null;
          image_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          title: string;
          category?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          map_order?: number | null;
          status?: "idea" | "planned" | "visited" | "rejected" | null;
          priority?: "must-see" | "recommended" | "optional" | null;
          notes?: string | null;
          website_url?: string | null;
          image_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["places"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "places_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      planner_items: {
        Row: {
          id: string;
          trip_id: string;
          place_id: string | null;
          title: string;
          description: string | null;
          date: string | null;
          start_time: string | null;
          end_time: string | null;
          type: string | null;
          status: "planned" | "completed" | "cancelled" | null;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          place_id?: string | null;
          title: string;
          description?: string | null;
          date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          type?: string | null;
          status?: "planned" | "completed" | "cancelled" | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["planner_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "planner_items_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planner_items_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
        ];
      };
      reservations: {
        Row: {
          id: string;
          trip_id: string;
          type: string | null;
          title: string;
          provider: string | null;
          reservation_number: string | null;
          start_date: string | null;
          end_date: string | null;
          location: string | null;
          total_price: number | null;
          currency: string | null;
          status: "paid" | "deposit" | "unpaid" | null;
          payer_name: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          type?: string | null;
          title: string;
          provider?: string | null;
          reservation_number?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          location?: string | null;
          total_price?: number | null;
          currency?: string | null;
          status?: "paid" | "deposit" | "unpaid" | null;
          payer_name?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reservations_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      budget_expenses: {
        Row: {
          id: string;
          trip_id: string;
          category: string | null;
          title: string;
          amount: number;
          currency: string | null;
          paid_by_name: string | null;
          participants_count: number | null;
          status: "paid" | "deposit" | "unpaid" | null;
          expense_date: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category?: string | null;
          title: string;
          amount: number;
          currency?: string | null;
          paid_by_name?: string | null;
          participants_count?: number | null;
          status?: "paid" | "deposit" | "unpaid" | null;
          expense_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["budget_expenses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "budget_expenses_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      packing_items: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          category: string | null;
          assigned_to_name: string | null;
          is_shared: boolean | null;
          is_packed: boolean | null;
          priority: "essential" | "recommended" | "optional" | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          category?: string | null;
          assigned_to_name?: string | null;
          is_shared?: boolean | null;
          is_packed?: boolean | null;
          priority?: "essential" | "recommended" | "optional" | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["packing_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "packing_items_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      packing_presets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["packing_presets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "packing_presets_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      packing_preset_items: {
        Row: {
          id: string;
          preset_id: string;
          name: string;
          category: string | null;
          priority: "essential" | "recommended" | "optional" | null;
          notes: string | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          preset_id: string;
          name: string;
          category?: string | null;
          priority?: "essential" | "recommended" | "optional" | null;
          notes?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["packing_preset_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "packing_preset_items_preset_id_fkey";
            columns: ["preset_id"];
            isOneToOne: false;
            referencedRelation: "packing_presets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_trip_participants: {
        Args: { target_trip_id: string };
        Returns: Array<{
          member_id: string;
          trip_id: string;
          user_id: string;
          role: string;
          status: string;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
        }>;
      };
      add_trip_member_by_email: {
        Args: {
          target_trip_id: string;
          target_email: string;
          target_role: string;
          target_status: string;
        };
        Returns: string;
      };
      get_public_trip_share: {
        Args: { target_token: string };
        Returns: Json | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
