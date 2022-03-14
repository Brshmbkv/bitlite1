var Pusher = require("pusher-js");
var pusher_instance;

if (process.env.NODE_ENV === 'development' 
  || process.env.VUE_APP_BASE_URL === 'https://dev.edu.bitlab.academy/'
  || process.env.VUE_APP_BASE_URL === 'https://dev2.edu.bitlab.academy/'
){
  console.log('pusher is logging')
  Pusher.logToConsole = true;
}
let key = process.env['VUE_APP_PUSHER_APP_KEY'];
let app_id  = process.env['VUE_APP_PUSHER_APP_ID'];
let secret  = process.env['VUE_APP_PUSHER_APP_SECRET'];
let cluster = process.env['VUE_APP_PUSHER_APP_CLUSTER'];
// console.log(key, app_id, secret, cluster)
try {
  pusher_instance = new Pusher(key, {
    app_id,
    secret,
    cluster,
  });
  pusher_instance.disconnect();
}
catch(e){
  console.error(e);
}

export default pusher_instance;