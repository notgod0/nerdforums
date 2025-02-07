
import { Database } from "@/integrations/supabase/types";

export type Forum = Database["public"]["Tables"]["forums"]["Row"] & {
  profiles?: {
    email: string | null;
  } | null;
};

export type Reply = Database["public"]["Tables"]["replies"]["Row"] & {
  profiles?: {
    email: string | null;
  } | null;
};
