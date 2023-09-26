export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          id: string
          name: string
          project_id: string
          receiver_ids: string[]
        }
        Insert: {
          creation_timestamp?: string
          creator_id: string
          description?: string | null
          id?: string
          name: string
          project_id: string
          receiver_ids: string[]
        }
        Update: {
          creation_timestamp?: string
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string
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
            foreignKeyName: "announcement_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          }
        ]
      }
      filters: {
        Row: {
          board_name: string
          filter: Json | null
          id: number
          modified_at: string
          user_id: string
        }
        Insert: {
          board_name: string
          filter?: Json | null
          id?: number
          modified_at?: string
          user_id: string
        }
        Update: {
          board_name?: string
          filter?: Json | null
          id?: number
          modified_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filters_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      map_project: {
        Row: {
          department: string | null
          is_show_in_overview: boolean | null
          position: string | null
          project_id: string
          user_event_id: number
          user_id: string
          user_role: string
        }
        Insert: {
          department?: string | null
          is_show_in_overview?: boolean | null
          position?: string | null
          project_id: string
          user_event_id?: number
          user_id: string
          user_role: string
        }
        Update: {
          department?: string | null
          is_show_in_overview?: boolean | null
          position?: string | null
          project_id?: string
          user_event_id?: number
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_project_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_project_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      parameters: {
        Row: {
          created_at: string
          id: number
          param_list: Json[]
          param_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          param_list: Json[]
          param_name: string
        }
        Update: {
          created_at?: string
          id?: number
          param_list?: Json[]
          param_name?: string
        }
        Relationships: []
      }
      project: {
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
            foreignKeyName: "project_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      task: {
        Row: {
          creation_timestamp: string
          creator_id: string
          description: string | null
          due_date_time: string | null
          id: string
          importance: number | null
          importance_rate: number | null
          modified_at: string | null
          modified_by: string | null
          name: string
          owner_ids: string[]
          project_id: string
          status_code: number
          urgent_date: string | null
        }
        Insert: {
          creation_timestamp?: string
          creator_id: string
          description?: string | null
          due_date_time?: string | null
          id?: string
          importance?: number | null
          importance_rate?: number | null
          modified_at?: string | null
          modified_by?: string | null
          name: string
          owner_ids: string[]
          project_id: string
          status_code?: number
          urgent_date?: string | null
        }
        Update: {
          creation_timestamp?: string
          creator_id?: string
          description?: string | null
          due_date_time?: string | null
          id?: string
          importance?: number | null
          importance_rate?: number | null
          modified_at?: string | null
          modified_by?: string | null
          name?: string
          owner_ids?: string[]
          project_id?: string
          status_code?: number
          urgent_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project"
            referencedColumns: ["id"]
          }
        ]
      }
      task_status: {
        Row: {
          created_at: string
          id: number
          status_code: number
          status_icon: string | null
          status_name: string
          status_severity: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status_code?: number
          status_icon?: string | null
          status_name: string
          status_severity?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status_code?: number
          status_icon?: string | null
          status_name?: string
          status_severity?: string | null
        }
        Relationships: []
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
          n_project_id: string
        }
        Returns: Record<string, unknown>
      }
      get_all_project: {
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
      get_announcement: {
        Args: {
          n_user_id: string
          n_project_id: string
        }
        Returns: {
          creation_timestamp: string
          creator_id: string
          description: string | null
          id: string
          name: string
          project_id: string
          receiver_ids: string[]
        }[]
      }
      get_board_components: {
        Args: {
          n_project_id: string
        }
        Returns: Record<string, unknown>
      }
      get_department: {
        Args: {
          project_id: string
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
      get_filters: {
        Args: {
          n_user_id: string
        }
        Returns: {
          board_name: string
          filter: Json
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
          project_id: string
          user_role: string
          is_show_in_overview: boolean
          project_name: string
          project_desc: string
          project_creator_id: string
        }[]
      }
      get_management_board: {
        Args: {
          n_project_id: string
        }
        Returns: {
          user_id: string
          username: string
          user_role: string
          user_position: string
          user_department: string
        }[]
      }
      get_parameter_bridge: {
        Args: {
          ref1: unknown
          ref2: unknown
        }
        Returns: undefined
      }
      get_parameters: {
        Args: Record<PropertyKey, never>
        Returns: {
          param_name: string
          param_list: Json[]
        }[]
      }
      get_parameters_1: {
        Args: {
          ref1: unknown
          ref2: unknown
        }
        Returns: unknown[]
      }
      get_task_by_project: {
        Args: {
          n_project_id: string
        }
        Returns: {
          task_id: string
          task_name: string
          task_desc: string
          creator_id: string
          creator_name: string
          creation_timestamp: string
          owner_ids: string[]
          status: string
          status_code: number
          due_date_time: string
          urgent_date: string
          importance: number
          importance_rate: number
          user_name: string[]
          status_icon: string
          status_severity: string
        }[]
      }
      get_user: {
        Args: {
          user_id: string[]
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
      get_users_by_project_id: {
        Args: {
          n_project_id: string
        }
        Returns: {
          user_id: string
          user_role: string
          user_position: string
          user_department: string
          username: string
        }[]
      }
      insert_announcement: {
        Args: {
          n_name: string
          n_description: string
          n_project_id: string
          n_creator_id: string
          n_creation_timestamp: string
          n_receiver_ids: string[]
        }
        Returns: Record<string, unknown>
      }
      insert_department: {
        Args: {
          n_name: Json[]
          project_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_position: {
        Args: {
          n_name: Json[]
          project_id: string
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
      map_user_project: {
        Args: {
          n_user_id: string
          n_project_id: string
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
      update_filter: {
        Args: {
          n_user_id: string
          n_board_name: string
          n_filter: Json
        }
        Returns: {
          board_name: string
          filter: Json | null
          id: number
          modified_at: string
          user_id: string
        }[]
      }
      update_project_user_map: {
        Args: {
          n_user_id: string
          n_project_id: string
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
      upsert_task: {
        Args: {
          n_task_id: string
          n_name: string
          n_description: string
          n_creator_id: string
          n_owner_ids: string[]
          n_due_date_time: string
          n_urgent_date: string
          n_project_id: string
          n_importance: number
          n_importance_rate: number
          n_status_code: number
          n_modified_at: string
          n_modified_by: string
        }
        Returns: Record<string, unknown>[]
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
