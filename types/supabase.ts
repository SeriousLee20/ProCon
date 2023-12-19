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
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_group: {
        Row: {
          created_at: string
          group_description: string | null
          group_id: string
          group_name: string
          profile_photo_url: string | null
        }
        Insert: {
          created_at?: string
          group_description?: string | null
          group_id?: string
          group_name: string
          profile_photo_url?: string | null
        }
        Update: {
          created_at?: string
          group_description?: string | null
          group_id?: string
          group_name?: string
          profile_photo_url?: string | null
        }
        Relationships: []
      }
      chat_log: {
        Row: {
          chat_log_id: string
          chatroom_id: string | null
          created_at: string
          media_content_url: string | null
          sender_id: string
          text_content: string
        }
        Insert: {
          chat_log_id?: string
          chatroom_id?: string | null
          created_at?: string
          media_content_url?: string | null
          sender_id: string
          text_content: string
        }
        Update: {
          chat_log_id?: string
          chatroom_id?: string | null
          created_at?: string
          media_content_url?: string | null
          sender_id?: string
          text_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_log_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatroom"
            referencedColumns: ["chatroom_id"]
          },
          {
            foreignKeyName: "chat_log_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      chatroom: {
        Row: {
          chatroom_id: string
          created_at: string
          group_id: string | null
          last_update_time: string | null
          project_id: string | null
          user_ids: string[] | null
        }
        Insert: {
          chatroom_id?: string
          created_at?: string
          group_id?: string | null
          last_update_time?: string | null
          project_id?: string | null
          user_ids?: string[] | null
        }
        Update: {
          chatroom_id?: string
          created_at?: string
          group_id?: string | null
          last_update_time?: string | null
          project_id?: string | null
          user_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "chatroom_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_group"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "chatroom_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
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
          project_id: string | null
          user_id: string
        }
        Insert: {
          board_name: string
          filter?: Json | null
          id?: number
          modified_at?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          board_name?: string
          filter?: Json | null
          id?: number
          modified_at?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      notification: {
        Row: {
          content: string | null
          created_at: string
          notification_id: string
          project_id: string | null
          target: string[] | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          notification_id?: string
          project_id?: string | null
          target?: string[] | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          notification_id?: string
          project_id?: string | null
          target?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          }
        ]
      }
      parameters: {
        Row: {
          created_at: string
          id: number
          param_list: Json | null
          param_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          param_list?: Json | null
          param_name: string
        }
        Update: {
          created_at?: string
          id?: number
          param_list?: Json | null
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
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      task: {
        Row: {
          creation_timestamp: string | null
          creator_id: string
          description: string | null
          due_date: string | null
          due_date_time: string | null
          id: string
          importance: number | null
          importance_rate: number | null
          modified_at: string | null
          modified_by: string
          name: string
          owner_ids: string[] | null
          project_id: string
          start_date: string | null
          status_code: number | null
          urgent_date: string | null
        }
        Insert: {
          creation_timestamp?: string | null
          creator_id: string
          description?: string | null
          due_date?: string | null
          due_date_time?: string | null
          id?: string
          importance?: number | null
          importance_rate?: number | null
          modified_at?: string | null
          modified_by: string
          name: string
          owner_ids?: string[] | null
          project_id: string
          start_date?: string | null
          status_code?: number | null
          urgent_date?: string | null
        }
        Update: {
          creation_timestamp?: string | null
          creator_id?: string
          description?: string | null
          due_date?: string | null
          due_date_time?: string | null
          id?: string
          importance?: number | null
          importance_rate?: number | null
          modified_at?: string | null
          modified_by?: string
          name?: string
          owner_ids?: string[] | null
          project_id?: string
          start_date?: string | null
          status_code?: number | null
          urgent_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
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
          start_working_hour: string | null
        }
        Insert: {
          contact_number?: string | null
          created_at?: string | null
          email?: string
          end_working_hour?: string | null
          id?: string
          name?: string | null
          start_working_hour?: string | null
        }
        Update: {
          contact_number?: string | null
          created_at?: string | null
          email?: string
          end_working_hour?: string | null
          id?: string
          name?: string | null
          start_working_hour?: string | null
        }
        Relationships: []
      }
      user_chatgroup: {
        Row: {
          created_at: string
          group_id: string
          project_id: string
          user_group_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          project_id: string
          user_group_id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          project_id?: string
          user_group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chatgroup_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_group"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_chatgroup_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chatgroup_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
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
      delete_task: {
        Args: {
          n_task_id: string
          n_project_id: string
        }
        Returns: {
          task_id: string
          task_name: string
          task_desc: string
          creator_id: string
          creator_name: string
          creation_timestamp: string
          modified_by: string
          modifier_name: string
          modified_at: string
          owner_ids: string[]
          status: string
          status_code: number
          start_date: string
          due_date_time: string
          due_date: string
          urgent_date: string
          importance: number
          importance_desc: string
          importance_rate: number
          owner_info: Json
          status_icon: string
          status_severity: string
        }[]
      }
      delete_task_from_ov: {
        Args: {
          n_task_id: string
          n_project_id: string
          n_user_id: string
        }
        Returns: {
          project_id: string
          project_name: string
          grouped_members: Json
          task_list: Json
        }[]
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
      get_chatlist: {
        Args: {
          n_user_id: string
          n_project_id: string
        }
        Returns: {
          chatroom_id: string
          group_id: string
          user_ids: string[]
          project_id: string
          last_update_time: string
          group_info: Json
          chatlog: Json
          group_members: Json
          chat_target: Json
        }[]
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
      get_management_boards: {
        Args: {
          n_user_id: string
        }
        Returns: {
          project_id: string
          project_name: string
          grouped_members: Json
          task_list: Json
        }[]
      }
      get_notification: {
        Args: {
          n_project_id: string
          n_user_id: string
        }
        Returns: {
          notification_id: string
          created_at: string
          title: string
          content: string
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
          param_list: Json
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
          modified_by: string
          modifier_name: string
          modified_at: string
          owner_ids: string[]
          status: string
          status_code: number
          start_date: string
          due_date_time: string
          due_date: string
          urgent_date: string
          importance: number
          importance_desc: string
          importance_rate: number
          owner_info: Json
          status_icon: string
          status_severity: string
        }[]
      }
      get_task_by_user: {
        Args: {
          n_user_id: string
        }
        Returns: {
          project_id: string
          project_name: string
          task_id: string
          task_name: string
          task_desc: string
          creator_id: string
          creator_name: string
          creation_timestamp: string
          modified_by: string
          modifier_name: string
          modified_at: string
          owner_ids: string[]
          status: string
          status_code: number
          start_date: string
          due_date_time: string
          due_date: string
          urgent_date: string
          importance: number
          importance_desc: string
          importance_rate: number
          owner_names: string[]
          status_icon: string
          status_severity: string
        }[]
      }
      get_task_by_user2: {
        Args: {
          n_user_id: string
        }
        Returns: {
          project_id: string
          project_name: string
          task_list: Json
        }[]
      }
      get_task1: {
        Args: {
          n_user_id: string
        }
        Returns: {
          projects: Json
          tasks: Json
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
          start_working_hour: string | null
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
          n_user_id: string
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
      insert_chatlog: {
        Args: {
          n_chatroom_id: string
          n_project_id: string
          n_user_id: string
          n_receiver_id: string
          n_text_content: string
        }
        Returns: {
          chatroom_id: string
          group_id: string
          user_ids: string[]
          project_id: string
          last_update_time: string
          group_info: Json
          chatlog: Json
          group_members: Json
          chat_target: Json
        }[]
      }
      insert_department: {
        Args: {
          n_name: Json[]
          project_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_notification: {
        Args: {
          n_title: string
          n_content: string
          n_target: string[]
          n_project_id: string
          n_user_id: string
        }
        Returns: {
          notification_id: string
          created_at: string
          title: string
          content: string
        }[]
      }
      insert_position: {
        Args: {
          n_name: Json[]
          project_id: string
        }
        Returns: Record<string, unknown>
      }
      insert_task: {
        Args: {
          n_name: string
          n_description: string
          n_creator_id: string
          n_owner_ids: string[]
          n_status_code: number
          n_due_date_time: string
          n_due_date: string
          n_urgent_date: string
          n_importance: number
          n_importance_rate: number
          n_modified_at: string
          n_modified_by: string
          n_project_id: string
        }
        Returns: {
          task_id: string
          task_name: string
          task_desc: string
          creator_id: string
          creator_name: string
          creation_timestamp: string
          modified_by: string
          modifier_name: string
          modified_at: string
          owner_ids: string[]
          status: string
          status_code: number
          start_date: string
          due_date_time: string
          due_date: string
          urgent_date: string
          importance: number
          importance_desc: string
          importance_rate: number
          owner_info: Json
          status_icon: string
          status_severity: string
        }[]
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
          filter: Json
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
      update_task: {
        Args: {
          n_task_id: string
          n_name: string
          n_description: string
          n_owner_ids: string[]
          n_status_code: number
          n_due_date_time: string
          n_due_date: string
          n_urgent_date: string
          n_importance: number
          n_importance_rate: number
          n_modified_at: string
          n_modified_by: string
          n_project_id: string
        }
        Returns: {
          task_id: string
          task_name: string
          task_desc: string
          creator_id: string
          creator_name: string
          creation_timestamp: string
          modified_by: string
          modifier_name: string
          modified_at: string
          owner_ids: string[]
          status: string
          status_code: number
          start_date: string
          due_date_time: string
          due_date: string
          urgent_date: string
          importance: number
          importance_desc: string
          importance_rate: number
          owner_info: Json
          status_icon: string
          status_severity: string
        }[]
      }
      update_task_from_ov: {
        Args: {
          n_task_id: string
          n_name: string
          n_description: string
          n_owner_ids: string[]
          n_status_code: number
          n_due_date_time: string
          n_due_date: string
          n_urgent_date: string
          n_importance: number
          n_importance_rate: number
          n_modified_at: string
          n_modified_by: string
          n_project_id: string
        }
        Returns: {
          project_id: string
          project_name: string
          grouped_members: Json
          task_list: Json
        }[]
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
          start_working_hour: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      chatlog_type: {
        chat_log_id: string
        text_content: string
        media_content_url: string
        created_at: string
        sender_id: string
        sender_name: string
      }
      group_member_type: {
        user_id: string
        name: string
        role: string
        position: string
        department: string
      }
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
