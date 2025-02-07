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
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          email?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forums: {
        Row: {
          id: string
          title: string
          description: string
          tags: string[]
          created_at: string | null
          user_id: string
          likes: number
          status: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          tags?: string[]
          created_at?: string | null
          user_id: string
          likes?: number
          status?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          tags?: string[]
          created_at?: string | null
          user_id?: string
          likes?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "forums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      replies: {
        Row: {
          id: string
          content: string
          created_at: string | null
          forum_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          content: string
          created_at?: string | null
          forum_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          content?: string
          created_at?: string | null
          forum_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forum_likes: {
        Row: {
          id: string
          user_id: string
          forum_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          forum_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          forum_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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

// Helper types for components
export interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  user_id: string;
  likes: number;
  status: string;
  profiles?: {
    email: string | null;
  } | null;
}

export interface Reply {
  id: string;
  content: string;
  created_at: string;
  forum_id: string | null;
  user_id: string;
  profiles?: {
    email: string | null;
  } | null;
}