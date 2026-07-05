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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
