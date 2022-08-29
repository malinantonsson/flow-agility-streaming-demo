(function () {
  let isSocketOpen = false;
  let isStreaming = false;

  const err = document.getElementById("error");
  const closed = document.getElementById("closed");
  const status = document.getElementById("status");
  const intro = document.getElementById("intro");
  const streaming = document.getElementById("streaming");

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "s") {
      console.log("START STREAM");

      isStreaming = true;
      streaming.style.display = "block";
      intro.style.display = "none";
    }

    if (evt.key === "r") {
      console.log("SHOW RESULTS");

      isStreaming = false;
      intro.style.display = "none";
      streaming.style.display = "none";
    }

    if (evt.key === "Backspace" || evt.key === "ArrowLeft") {
      console.log("GO BACK");

      isStreaming = false;
      intro.style.display = "block";
      streaming.style.display = "none";
    }
  });

  const chrono = $("#cronometro");

  let currentRun = {
    id: "",
    status: "ready",
  };

  // Create WebSocket connection.
  const socket = new WebSocket("ws://localhost:8080");

  // Connection opened
  socket.addEventListener("open", (event) => {
    isSocketOpen = true;

    status.innerHTML = "connected";
    err.style.display = "none";
    closed.style.display = "none";

    // send to socket
    // ping every 30s?
    socket.send("Hello Server!");
  });

  socket.addEventListener("close", (event) => {
    isSocketOpen = false;
    status.innerHTML = "not connected";
  });

  socket.addEventListener("error", (event) => {
    isSocketOpen = false;

    err.style.display = "block";
    status.innerHTML = "not connected";
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);

    // check if same dog
    // if(currentRun.id === run.playset.id) {
    // dog went from ready to running = start timer
    if (currentRun.status === "ready") {
      if (run.playset.status_string === "running") {
        chrono.Chrono("start");
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
