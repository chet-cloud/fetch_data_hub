(function () {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function NewWebsocket(){
    const onMessages=[],
        onOpens=[],
        onCloses=[],
        onErrors=[]

    let ws = new WebSocket(`ws://${location.host}`);
    let interval

    ws.onerror = function () {
      showMessage('WebSocket error');
      onErrors.forEach((fn)=>fn())
    };

    ws.onmessage = function(event) {
      onMessages.forEach((fn)=>fn(event.data))
    }

    ws.onopen = function () {
      interval = setInterval(function ping() {
        ws.send('pong')
      }, 30000);
      onOpens.forEach((fn)=>fn())
    };

    ws.onclose = function () {
      clearInterval(interval)
      onCloses.forEach((fn)=>fn())
      ws = null;
    };

    return {
      send:function (msg){
        ws.send(msg)
      },
      addListener(even,fn){
        if(even === "message"){
          onMessages.push(fn)
        }else if(even === "open"){
          onOpens.push(fn)
        }else if(even === "close"){
          onCloses.push(fn)
        }else if(even === "error"){
          onErrors.push(fn)
        }else{
          console.error("unknown event")
        }
      }
    };
  }

  let ws;

  wsButton.onclick = function () {
    ws = NewWebsocket()

    ws.addListener("open",()=>{
      showMessage('WebSocket connection established');
    })
    ws.addListener("close",()=>{
      showMessage('WebSocket connection closed');
    })

  };

  wsSendButton.onclick = function () {
    if (!ws) {
      showMessage('No WebSocket connection');
      return;
    }

    ws.send('Hello World!');
    showMessage('Sent "Hello World!"');
  };
})();
