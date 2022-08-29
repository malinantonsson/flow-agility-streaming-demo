(function () {
  let isSocketOpen = false;

  const err = document.getElementById("error");
  const closed = document.getElementById("closed");

  const chrono = $("#cronometro");

  chrono.Chrono("start");

  let currentRun = {
    id: "",
    status: "ready",
  };

  // Create WebSocket connection.
  const socket = new WebSocket("ws://localhost:8080");

  // Connection opened
  socket.addEventListener("open", (event) => {
    isSocketOpen = true;

    err.style.display = "none";
    closed.style.display = "none";

    // send to socket
    // ping every 30s?
    socket.send("Hello Server!");
  });

  socket.addEventListener("close", (event) => {
    isSocketOpen = false;
  });

  socket.addEventListener("error", (event) => {
    isSocketOpen = false;

    err.style.display = "block";
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);

    // check if same dog
    // if(currentRun.id === run.playset.id) {
    // dog went from ready to running = start timer
    if (currentRun.status === "ready") {
      if (run.playset.status_string === "running") {
        //chrono.start();
        currentRun.status = "running";
      }
    }

    // if dog is not running, stop timer
    if (run.playset.status_string !== "running") {
      //chrono.stop();
    }
    // }

    // run.playset.status_string === 'running'
    // calculated/running/ready
  });
})();
