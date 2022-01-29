(function () {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(response) {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }

  login.onclick = function () {
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function (err) {
        showMessage(err.message);
      });
  };

  logout.onclick = function () {
    fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function (err) {
        showMessage(err.message);
      });
  };

  let ws;

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
