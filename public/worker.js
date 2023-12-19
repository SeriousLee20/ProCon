<<<<<<< HEAD
importScripts("https://cdn.jsdelivr.net/npm/@supabase/supabase-js");
importScripts("https://unpkg.com/axios/dist/axios.min.js");
// import { serverSupabaseClient } from "../src/runtime/server/services/serverSupabaseClient";

const supabase = self.supabase.createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);
let userId = "";
=======
//func
const test = () => {
  Notification.requestPermission().then((perm) => {
    console.log(perm);
  });
};
>>>>>>> feat/web-worker

self.addEventListener(
  "message",
  function (e) {
<<<<<<< HEAD
    userId = e.data;
  },
  false
);

const handleInserts = async (payload) => {
  console.log(userId);
  console.log(payload.new.target);
  if (payload.new.target.includes(userId)) {
    new Notification(payload.new.title, { body: payload.new.content });
  }

  doPostRequest(payload.new.content);
};

async function doPostRequest(content) {
  const text = "Check Procon Now! For " + content;
  const chatID = -4016432921;
  const token = "6703014884:AAFDX_jNeiyLV2chV_T9Y_MLWxwVRIaMe54";
  let res = await axios.post(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${text}`
  );
  let data = res.data;
  console.log(data);
}

supabase
  .channel("notification")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "notification" },
    handleInserts
  )
  .subscribe();

//https://api.telegram.org/bot6703014884:AAFDX_jNeiyLV2chV_T9Y_MLWxwVRIaMe54/sendMessage?chat_id=&text=

console.log("worker is hereee");
=======
    console.log("In worker (public): received data: " + e.data);
    let sum = "service worker";
    self.postMessage(sum);
  },
  false
);
>>>>>>> feat/web-worker
