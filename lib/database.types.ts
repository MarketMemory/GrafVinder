// Dit is een voorbeeld van hoe je database types eruit zouden kunnen zien.
// Je kunt dit genereren met de Supabase CLI: `supabase gen types typescript --project-id your-project-id --schema public > lib/database.types.ts`
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      graves: {
        Row: {
          id: string
          created_at: string
          name: string
          birth_date: string
          death_date: string
          biography: string | null
          grave_photo_url: string | null
          deceased_photo_url: string | null
          location_latitude: number | null
          location_longitude: number | null
          location_description: string | null
          user_id: string // De gebruiker die dit graf heeft toegevoegd/beheert
          share_on_twitter: boolean // NIEUW: voor de X/Twitter deeloptie
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          birth_date: string
          death_date: string
          biography?: string | null
          grave_photo_url?: string | null
          deceased_photo_url?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          location_description?: string | null
          user_id: string
          share_on_twitter?: boolean // NIEUW: voor de X/Twitter deeloptie
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          birth_date?: string
          death_date?: string
          biography?: string | null
          grave_photo_url?: string | null
          deceased_photo_url?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          location_description?: string | null
          user_id?: string
          share_on_twitter?: boolean // NIEUW: voor de X/Twitter deeloptie
        }
        Relationships: [
          {
            foreignKeyName: "graves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          id: string
          created_at: string
          text: string
          date: string
          author: string
          grave_id: string
          user_id: string | null // Optioneel: de gebruiker die de herinnering heeft toegevoegd
        }
        Insert: {
          id?: string
          created_at?: string
          text: string
          date: string
          author: string
          grave_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          text?: string
          date?: string
          author?: string
          grave_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_grave_id_fkey"
            columns: ["grave_id"]
            isOneToOne: false
            referencedRelation: "graves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          id: string
          created_at: string
          setting_name: string
          setting_value: string
        }
        Insert: {
          id?: string
          created_at?: string
          setting_name: string
          setting_value: string
        }
        Update: {
          id?: string
          created_at?: string
          setting_name?: string
          setting_value?: string
        }
        Relationships: []
      }
      // Supabase heeft standaard een 'users' tabel voor authenticatie
      users: {
        Row: {
          id: string // UUID van de auth.users tabel
          email: string
          // Voeg hier eventueel extra profielvelden toe, bijv. 'full_name'
        }
        Insert: {
          id: string
          email: string
        }
        Update: {
          id?: string
          email?: string
        }
        Relationships: []
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
