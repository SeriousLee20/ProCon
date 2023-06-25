export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      announcement: {
        Row: {
          creation_timestamp: string
          creator_id: string
          description: string | null
          event_id: string
          id: string
          name: string
          receiver_ids: string[]
        }
        Insert: {
          creation_timestamp?: string
          creator_id: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          receiver_ids: string[]
        }
        Update: {
          creation_timestamp?: string
          creator_id?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          receiver_ids?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "announcement_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_announcement_event_id"
            columns: ["event_id"]
            referencedRelation: "event"
            referencedColumns: ["id"]
          }
        ]
      }
      department: {
        Row: {
          event_id: string
          id: string
          name: string | null
        }
        Insert: {
          event_id: string
          id?: string
          name?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_event_id"
            columns: ["event_id"]
            referencedRelation: "event"
            referencedColumns: ["id"]
          }
        ]
      }
      event: {
        Row: {
          creation_timestamp: string
          creator_id: string | null
          departments: Json[] | null
          description: string | null
          id: string
          name: string
          positions: Json[] | null
        }
        Insert: {
          creation_timestamp?: string
          creator_id?: string | null
          departments?: Json[] | null
          description?: string | null
          id?: string
          name: string
          positions?: Json[] | null
        }
        Update: {
          creation_timestamp?: string
          creator_id?: string | null
          departments?: Json[] | null
          description?: string | null
          id?: string
          name?: string
          positions?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "event_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      map_event: {
        Row: {
          department: string | null
          event_id: string
          is_show_in_overview: boolean | null
          position: string | null
          user_event_id: number
          user_id: string
          user_role: string
        }
        Insert: {
          department?: string | null
          event_id: string
          is_show_in_overview?: boolean | null
          position?: string | null
          user_event_id?: number
          user_id: string
          user_role: string
        }
        Update: {
          department?: string | null
          event_id?: string
          is_show_in_overview?: boolean | null
          position?: string | null
          user_event_id?: number
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_event_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_event_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      position: {
        Row: {
          event_id: string
          id: string
          name: string | null
        }
        Insert: {
          event_id: string
          id?: string
          name?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_position_event_id"
            columns: ["event_id"]
            referencedRelation: "event"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          contact_number: string | null
          created_at: string | null
          email: string
          end_working_hour: string | null
          id: string
          name: string | null
          start_working_hour: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string | null
          email?: string
          end_working_hour?: string | null
          id?: string
          name?: string | null
          start_working_hour: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string | null
          email?: string
          end_working_hour?: string | null
          id?: string
          name?: string | null
          start_working_hour?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      delete_member: {
        Args: {
          n_user_id: string
          n_event_id: string
        }
        Returns: Record<string, unknown>
      }
      get_all_event: {
        Args: Record<PropertyKey, never>
        Returns: {
          creation_timestamp: string
          creator_id: string | null
          departments: Json[] | null
          description: string | null
          id: string
          name: string
          positions: Json[] | null
        }[]
      }
      get_board_components: {
        Args: {
          n_event_id: string
        }
        Returns: Record<string, unknown>
      }
      get_department: {
        Args: {
          event_id: string
        }
        Returns: {
          creation_timestamp: string
          creator_id: string | null
          departments: Json[] | null
          description: string | null
          id: string
          name: string
          positions: Json[] | null
        }[]
      }
      get_full_data: {
        Args: {
          current_user_id: string
        }
        Returns: {
          user_id: string
          user_name: string
          email: string
          contact_number: string
          start_working_hour: string
          end_working_hour: string
          event_id: string
          user_role: string
          is_show_in_overview: boolean
          event_name: string
          event_desc: string
          event_creator_id: string
        }[]
      }
      get_management_board: {
        Args: {
          n_event_id: string
        }
        Returns: {
          user_id: string
          username: string
          user_role: string
          user_position: string
          user_department: string
        }[]
      }
      get_user: {
        Args: {
          user_id: string
        }
        Returns: {
          contact_number: string | null
          created_at: string | null
          email: string
          end_working_hour: string | null
          id: string
          name: string | null
          start_working_hour: string
        }[]
      }
      get_users_by_event_id: {
        Args: {
          n_event_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_department: {
        Args: {
          n_name: Json[]
          event_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_position: {
        Args: {
          n_name: Json[]
          event_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_user: {
        Args: {
          id: string
          name: string
          email: string
          start_working_hour: string
          end_working_hour: string
        }
        Returns: string
      }
      map_user_event: {
        Args: {
          n_user_id: string
          n_event_id: string
          n_role: string
        }
        Returns: Record<string, unknown>
      }
      new_project: {
        Args: {
          n_name: string
          n_description: string
          n_creator_id: string
        }
        Returns: Record<string, unknown>
      }
      update_event_user_map: {
        Args: {
          n_user_id: string
          n_event_id: string
          n_role: string
          n_department: string
          n_position: string
        }
        Returns: Record<string, unknown>
      }
      update_user: {
        Args: {
          user_id: string
          n_name: string
          n_email: string
          n_contact_number: string
          n_start_working_hour: string
          n_end_working_hour: string
        }
        Returns: {
          contact_number: string | null
          created_at: string | null
          email: string
          end_working_hour: string | null
          id: string
          name: string | null
          start_working_hour: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
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
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
