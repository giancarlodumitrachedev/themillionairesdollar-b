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
      admin_log: {
        Row: {
          action: string
          admin_email: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          admin_email: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          admin_email?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      admin_whitelist: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      counters: {
        Row: {
          id: string
          updated_at: string
          value: number
        }
        Insert: {
          id: string
          updated_at?: string
          value?: number
        }
        Update: {
          id?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          participant_id: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          participant_id?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          participant_id?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_subscribers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "public_tiles"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          amount_paid_cents: number
          business_email: string | null
          city: string | null
          consent_future_contact: boolean
          consent_newsletter: boolean
          consent_participation: boolean
          country_code: string
          created_at: string
          display_as: string
          display_name: string
          email: string
          id: string
          is_highlighted: boolean
          is_public: boolean
          is_seed_participant: boolean
          latitude: number | null
          linkedin_url: string | null
          longitude: number | null
          personal_message: string | null
          phone_number: string | null
          removal_requested_at: string | null
          source_of_wealth: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          tier: string
          tile_number: number
          vetting_notes: Json
          vetting_status: string
          year_became_millionaire: number | null
        }
        Insert: {
          amount_paid_cents: number
          business_email?: string | null
          city?: string | null
          consent_future_contact?: boolean
          consent_newsletter?: boolean
          consent_participation?: boolean
          country_code: string
          created_at?: string
          display_as: string
          display_name: string
          email: string
          id?: string
          is_highlighted?: boolean
          is_public?: boolean
          is_seed_participant?: boolean
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          personal_message?: string | null
          phone_number?: string | null
          removal_requested_at?: string | null
          source_of_wealth?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          tier: string
          tile_number?: number
          vetting_notes?: Json
          vetting_status?: string
          year_became_millionaire?: number | null
        }
        Update: {
          amount_paid_cents?: number
          business_email?: string | null
          city?: string | null
          consent_future_contact?: boolean
          consent_newsletter?: boolean
          consent_participation?: boolean
          country_code?: string
          created_at?: string
          display_as?: string
          display_name?: string
          email?: string
          id?: string
          is_highlighted?: boolean
          is_public?: boolean
          is_seed_participant?: boolean
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          personal_message?: string | null
          phone_number?: string | null
          removal_requested_at?: string | null
          source_of_wealth?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          tier?: string
          tile_number?: number
          vetting_notes?: Json
          vetting_status?: string
          year_became_millionaire?: number | null
        }
        Relationships: []
      }
      press_coverage: {
        Row: {
          article_title: string
          article_url: string
          created_at: string
          display_order: number
          id: string
          is_featured: boolean
          publication_logo_url: string | null
          publication_name: string
          published_at: string | null
          quote: string | null
        }
        Insert: {
          article_title: string
          article_url: string
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          publication_logo_url?: string | null
          publication_name: string
          published_at?: string | null
          quote?: string | null
        }
        Update: {
          article_title?: string
          article_url?: string
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          publication_logo_url?: string | null
          publication_name?: string
          published_at?: string | null
          quote?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      public_stats: {
        Row: {
          by_country: Json | null
          countries: number | null
          last_24h: number | null
          last_week: number | null
          total_participants: number | null
        }
        Relationships: []
      }
      public_tiles: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          display_as: string | null
          display_name: string | null
          id: string | null
          is_highlighted: boolean | null
          latitude: number | null
          longitude: number | null
          personal_message: string | null
          tier: string | null
          tile_number: number | null
          year_became_millionaire: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      refresh_public_stats: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicTile = Database["public"]["Views"]["public_tiles"]["Row"]
export type PublicStats = Database["public"]["Views"]["public_stats"]["Row"]
export type Participant = Database["public"]["Tables"]["participants"]["Row"]
export type PressCoverage = Database["public"]["Tables"]["press_coverage"]["Row"]
