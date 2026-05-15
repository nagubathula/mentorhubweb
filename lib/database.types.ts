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
    PostgrestVersion: "14.5"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      admin_settings: {
        Row: {
          admin_id: string
          display_name: string | null
          email: string | null
          id: string
          notify_review_submissions: boolean | null
          notify_session_reminders: boolean | null
          notify_student_messages: boolean | null
          notify_weekly_digest: boolean | null
          updated_at: string
        }
        Insert: {
          admin_id: string
          display_name?: string | null
          email?: string | null
          id?: string
          notify_review_submissions?: boolean | null
          notify_session_reminders?: boolean | null
          notify_student_messages?: boolean | null
          notify_weekly_digest?: boolean | null
          updated_at?: string
        }
        Update: {
          admin_id?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notify_review_submissions?: boolean | null
          notify_session_reminders?: boolean | null
          notify_student_messages?: boolean | null
          notify_weekly_digest?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mentor_id: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mentor_id?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mentor_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "circles_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mentor_id: string | null
          status: string | null
          title: string
          total_modules: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mentor_id?: string | null
          status?: string | null
          title: string
          total_modules?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mentor_id?: string | null
          status?: string | null
          title?: string
          total_modules?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      csr_sponsors: {
        Row: {
          avatar_initials: string | null
          created_at: string
          current_amount: number | null
          description: string | null
          id: string
          industry: string | null
          mentees_count: number | null
          mentors_count: number | null
          name: string
          status: string | null
          tags: Json | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          avatar_initials?: string | null
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          industry?: string | null
          mentees_count?: number | null
          mentors_count?: number | null
          name: string
          status?: string | null
          tags?: Json | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          avatar_initials?: string | null
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          industry?: string | null
          mentees_count?: number | null
          mentors_count?: number | null
          name?: string
          status?: string | null
          tags?: Json | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          circle_id: string | null
          course_id: string | null
          enrolled_at: string
          id: string
          status: string | null
          student_id: string
          progress: Json | null
          progress_pct: number | null
          modules_completed: number | null
        }
        Insert: {
          circle_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string | null
          student_id: string
          progress?: Json | null
          progress_pct?: number | null
          modules_completed?: number | null
        }
        Update: {
          circle_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string | null
          student_id?: string
          progress?: Json | null
          progress_pct?: number | null
          modules_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      games_quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          questions: Json | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      gratitude_messages: {
        Row: {
          amount: number | null
          created_at: string
          display_name: string | null
          id: string
          is_anonymous: boolean | null
          message_content: string | null
          sender_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message_content?: string | null
          sender_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message_content?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gratitude_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspiration: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          id: string
          is_published: boolean | null
          media_url: string | null
          title: string
          type: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          title: string
          type?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      mapping: {
        Row: {
          circle_id: string | null
          id: string
          mapped_at: string
          mentor_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          circle_id?: string | null
          id?: string
          mapped_at?: string
          mentor_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          circle_id?: string | null
          id?: string
          mapped_at?: string
          mentor_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapping_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapping_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapping_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_quiz_responses: {
        Row: {
          branch: string | null
          college: string | null
          created_at: string
          current_company: string | null
          id: string
          mentor_id: string
          mother_tongue: string | null
        }
        Insert: {
          branch?: string | null
          college?: string | null
          created_at?: string
          current_company?: string | null
          id?: string
          mentor_id: string
          mother_tongue?: string | null
        }
        Update: {
          branch?: string | null
          college?: string | null
          created_at?: string
          current_company?: string | null
          id?: string
          mentor_id?: string
          mother_tongue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_quiz_responses_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_student_matches: {
        Row: {
          created_at: string
          description: string | null
          id: string
          match_percentage: number | null
          mentor_id: string
          student_id: string
          tags: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          match_percentage?: number | null
          mentor_id: string
          student_id: string
          tags?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          match_percentage?: number | null
          mentor_id?: string
          student_id?: string
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_student_matches_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_student_matches_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean | null
          sender_name: string | null
          subject: string | null
          to_user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_name?: string | null
          subject?: string | null
          to_user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_name?: string | null
          subject?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          expertise: string | null
          id: string
          name: string | null
          preferences: Json | null
          role: string | null
          bio: string | null
          avatar_url: string | null
          coins: number | null
          streak: number | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          expertise?: string | null
          id: string
          name?: string | null
          preferences?: Json | null
          role?: string | null
          bio?: string | null
          avatar_url?: string | null
          coins?: number | null
          streak?: number | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          expertise?: string | null
          id?: string
          name?: string | null
          preferences?: Json | null
          role?: string | null
          bio?: string | null
          avatar_url?: string | null
          coins?: number | null
          streak?: number | null
          xp?: number | null
        }
        Relationships: []
      }
      questionnaires: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          questions: Json | null
          target_role: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          target_role?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          target_role?: string | null
          title?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string
          event_date: string | null
          event_name: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          event_name?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string | null
          event_name?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number | null
          reviewee_id: string | null
          reviewer_id: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          mentor_id: string | null
          notes: string | null
          scheduled_at: string | null
          status: string | null
          student_id: string | null
          title: string | null
          topic: string | null
          type: string | null
          duration: string | null
          completed: boolean | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentor_id?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string | null
          student_id?: string | null
          title?: string | null
          topic?: string | null
          type?: string | null
          duration?: string | null
          completed?: boolean | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentor_id?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string | null
          student_id?: string | null
          title?: string | null
          topic?: string | null
          type?: string | null
          duration?: string | null
          completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_quiz_responses: {
        Row: {
          admired_personality: string | null
          branch: string | null
          college: string | null
          created_at: string
          curiosity_answer: string | null
          exploration_frequency: string | null
          id: string
          inspiration_source: string | null
          mother_tongue: string | null
          student_id: string
        }
        Insert: {
          admired_personality?: string | null
          branch?: string | null
          college?: string | null
          created_at?: string
          curiosity_answer?: string | null
          exploration_frequency?: string | null
          id?: string
          inspiration_source?: string | null
          mother_tongue?: string | null
          student_id: string
        }
        Update: {
          admired_personality?: string | null
          branch?: string | null
          college?: string | null
          created_at?: string
          curiosity_answer?: string | null
          exploration_frequency?: string | null
          id?: string
          inspiration_source?: string | null
          mother_tongue?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_quiz_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_answers: {
        Row: {
          id: string
          user_id: string | null
          answers: Json
          completed_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          answers: Json
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          answers?: Json
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          id: string
          user_id: string | null
          game_type: string
          score: number | null
          coins_earned: number | null
          metadata: Json | null
          played_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          game_type: string
          score?: number | null
          coins_earned?: number | null
          metadata?: Json | null
          played_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          game_type?: string
          score?: number | null
          coins_earned?: number | null
          metadata?: Json | null
          played_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string | null
          module_id: string | null
          score: number | null
          total_questions: number | null
          coins_earned: number | null
          taken_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          module_id?: string | null
          score?: number | null
          total_questions?: number | null
          coins_earned?: number | null
          taken_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          module_id?: string | null
          score?: number | null
          total_questions?: number | null
          coins_earned?: number | null
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      inspirations: {
        Row: {
          id: string
          mentor_id: string | null
          type: string | null
          content: string
          sent: boolean | null
          sent_at: string
        }
        Insert: {
          id?: string
          mentor_id?: string | null
          type?: string | null
          content: string
          sent?: boolean | null
          sent_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string | null
          type?: string | null
          content?: string
          sent?: boolean | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspirations_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      inspiration_reads: {
        Row: {
          id: string
          post_id: string | null
          student_id: string | null
          saved: boolean | null
          read_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          student_id?: string | null
          saved?: boolean | null
          read_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          student_id?: string | null
          saved?: boolean | null
          read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspiration_reads_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "inspirations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspiration_reads_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          id: string
          course_id: string | null
          title: string
          order_index: number | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          title: string
          order_index?: number | null
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          id: string
          module_id: string | null
          title: string
          duration: string | null
          type: string | null
          order_index: number | null
        }
        Insert: {
          id?: string
          module_id?: string | null
          title: string
          duration?: string | null
          type?: string | null
          order_index?: number | null
        }
        Update: {
          id?: string
          module_id?: string | null
          title?: string
          duration?: string | null
          type?: string | null
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_progress: {
        Row: {
          id: string
          enrollment_id: string | null
          lesson_id: string | null
          status: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          enrollment_id?: string | null
          lesson_id?: string | null
          status?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          enrollment_id?: string | null
          lesson_id?: string | null
          status?: string | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      circle_members: {
        Row: {
          id: string
          circle_id: string | null
          student_id: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          circle_id?: string | null
          student_id?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          circle_id?: string | null
          student_id?: string | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      review_queue: {
        Row: {
          id: string
          mentor_id: string | null
          student_id: string | null
          lesson_id: string | null
          project_name: string
          status: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          mentor_id?: string | null
          student_id?: string | null
          lesson_id?: string | null
          project_name: string
          status?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string | null
          student_id?: string | null
          lesson_id?: string | null
          project_name?: string
          status?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_queue_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
