import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://nmigojabposeuxoummby.supabase.co"
const supabaseApi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taWdvamFicG9zZXV4b3VtbWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDI4OTYsImV4cCI6MjA1NDY3ODg5Nn0.7Mxwx8HcV2vSPe1zXPa7J7MIWUaTJHCQP9MQqJ2xAfM"

const supabase = createClient(supabaseUrl, supabaseApi, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
