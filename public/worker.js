//func
const test = () => {
  Notification.requestPermission().then((perm) => {
    console.log(perm);
  });
};

self.addEventListener(
  "message",
  function (e) {
    console.log("In worker (public): received data: " + e.data);
    let sum = "service worker";
    self.postMessage(sum);
  },
  false
);
