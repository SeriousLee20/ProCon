importScripts("https://cdn.jsdelivr.net/npm/@supabase/supabase-js");

const supabase = self.supabase.createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

const handleInserts = (payload) => {
  console.log("Change received!", payload);
  new Notification("New Changes!", { body: "Tasks updated!" });
};

supabase
  .channel("task")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "task" },
    handleInserts
  )
  .subscribe();

console.log("worker is hereee");
