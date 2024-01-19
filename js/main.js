//const WEBSOCKET_URL = "ws:facom-stage.fly.dev/ws/streaming/-HUwjLmF"

// Get the websocket url from Flow agility and paste it here
// it should look something like this: "ws:facom-stage.fly.dev/ws/streaming/7nt5UYKh"
// you may have to add the "wss:" bit
const WEBSOCKET_URL = "WEBSOCKET_URL_GOES_HERE";

const updateRunData = (name, playset, prefix = "streaming-run") => {
  document.querySelector(`#${prefix}-manga`).innerHTML = name;
  document.querySelector(`#${prefix}-start_order`).innerHTML =
    playset.start_order;
  document.querySelector(`#${prefix}-dog_name`).innerHTML =
    playset.dog_family_name;
  document.querySelector(`#${prefix}-handler_name`).innerHTML = playset.handler;
  document.querySelector(`#${prefix}-club_name`).innerHTML = playset.club;

  document.querySelector(`#${prefix}-dog_faults`).innerHTML = playset.faults;

  document.querySelector(`#${prefix}-dog_refusals`).innerHTML =
    playset.refusals;

  document.querySelector(`#${prefix}-dog_time`).innerHTML = playset.time
    ? `${playset.time}`
    : "";

  if (playset.disqualification === "elim") {
    document.querySelector(`#${prefix}-pen`).style.opacity = "0";
    document.querySelector(`#${prefix}-dog_elim`).style.opacity = "1";
  } else {
    document.querySelector(`#${prefix}-dog_elim`).style.opacity = "0";
    document.querySelector(`#${prefix}-pen`).style.opacity = "1";
  }
};

const toggleRunData = (isShow) => {
  document.querySelector("#streaming-run").style.display = isShow
    ? "block"
    : "none";
};

const toggleRunResult = (isShow) => {
  document.querySelector("#streaming-run-result").style.display = isShow
    ? "block"
    : "none";
};

const hideEverything = () => {
  document.getElementById("streaming").style.display = "none";
  document.getElementById("intro").style.display = "none";
  document.getElementById("results").style.display = "none";
};

const showStreaming = () => {
  document.getElementById("streaming").style.display = "block";
  document.getElementById("intro").style.display = "none";
  document.getElementById("results").style.display = "none";
};

const showResults = (results = {}) => {
  if (results.results && results.results.length > 0) {
    document.getElementById("intro").style.display = "none";
    document.getElementById("streaming").style.display = "none";
    document.getElementById("results").style.display = "block";

    document.getElementById("results-header").innerHTML = results.title;

    let resultHtml = ``;
    results.results.forEach((r, index) => {
      resultHtml =
        resultHtml +
        `<tr id="result-template">
              <td>
              <span data-id="results-item-order">${index + 1}.</span>
              </td>
              <td>
              <span data-id="results-item-dog" class="results-item-dog">${
                r.dog_family_name
              }</span>
              </td>
              <td>
                
                  
                  
                  <span data-id="results-item-handler" class="results-item-handler">${
                    r.handler
                  }</span>
              </td>
              <td>${r.time}</td>
              <td>${r.total_penalization}</td>
            </tr>`;
    });
    document.getElementById("results-body").innerHTML = resultHtml;
  }
};

const showIntro = () => {
  document.getElementById("intro").style.display = "block";
  document.getElementById("streaming").style.display = "none";
  document.getElementById("results").style.display = "none";
};

const showRunError = (msg) => {
  document.querySelector(`#streaming-run-club_name`).innerHTML = msg;
};

(function () {
  let results = {};

  const connectToSocket = (websocketUrl) => {
    // STATUSES
    const err = document.getElementById("error");
    const closed = document.getElementById("closed");
    const status = document.getElementById("status");

    console.log("TRY TO CONNECT: ", websocketUrl);
    const showConnectionError = () => {
      isSocketOpen = false;

      err.style.display = "block";
      status.innerHTML = "not connected";
    };

    // Create WebSocket connection.
    const socket = new WebSocket(websocketUrl);
    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("CONNECTED");
      isSocketOpen = true;
      // always request the first data on load
      socket.send("streaming_data");

      status.innerHTML = "connected";
      err.style.display = "none";
      closed.style.display = "none";

      // send ping every 30 seconds to keep connection open
      setInterval(() => {
        console.log("SEND PING");
        socket.send("ping");
      }, 30000);
    });

    socket.addEventListener("close", (event) => {
      console.log("CLOSED");
      isSocketOpen = false;
      status.innerHTML = "not connected";
    });

    socket.addEventListener("error", (event) => {
      console.log("ERROR");
      showConnectionError();
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event);
      if (event.data === "pong") return;
      console.log("data: ", JSON.parse(event.data));
      const data = JSON.parse(event.data);

      const { run, run_ready, error } = data;

      if (error) {
        showRunError(error);
      }

      if (!run && run_ready) {
        // if there is no `run` use `run_ready` - dog has not started yet
        // When SO of the first run for the date/ring is set
        console.log("When SO of the first run for the date/ring is set");

        updateRunData(run_ready.name, run_ready.playset);
      }

      // dog is running
      if (run) {
        // 10. When 2nd run-pair last playset is submitted
        const isCombinedReady = run.results_combined.length > 0;
        results = {
          results: isCombinedReady ? run.results_combined : run.results_best,
          title: `${run.name} ${
            isCombinedReady ? "Combined results" : "Best results"
          }`,
        };

        // 3. When first playset is getting the first Fault
        // 4. When first playset is getting the Refusal
        // 4. When first playset is disqualified by the Judge
        // 8. When 2nd run-pair 1st playset got first Fault
        if (run.playset.status_string === "running") {
          updateRunData(run.name, run.playset);
        }

        // run is complete
        if (run.playset.status_string === "calculated") {
          // 5. When first playset is submitted with 2F and 1R and time of 23.56
          // 6. When second playset of the 2-playsets run (1st run-pair - without combined results) is submitted
          // 7. When the 2nd run-pair SO is set (run-ready information is showing the run which is ready to start)
          // 9. When 2nd run-pair 1st playset is submitted

          // setting run results
          updateRunData(run.name, run.playset, "streaming-run-result");
          // showing run results
          toggleRunResult(true);
          toggleRunData(false);

          // show results for 5s, then get the data for the next dog
          // update run detail with next run in background
          if (run_ready) {
            updateRunData(run_ready.name, run_ready.playset);
          }

          setTimeout(() => {
            toggleRunResult(false);
            toggleRunData(true);
          }, 5000);

          // the manga has finished
          // 7. When the 2nd run-pair SO is set (run-ready information is showing the run which is ready to start)
          if (run?.name !== run_ready?.name || run?.type !== run_ready?.type) {
            // do nothing?
            // user can manually go to result screen
          }
        }
      }
    });
  };

  let params = new URLSearchParams(document.location.search);
  let page = params.get("page");
  let url = params.get("url");
  const websocketUrl = url || WEBSOCKET_URL;

  if (page) {
    if (page === "stream") {
      showStreaming();
    }
  }

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "s" || evt.key === "S") {
      showStreaming();
    }

    if (evt.key === "r" || evt.key === "R") {
      showResults(results);
    }

    if (evt.key === "Backspace" || evt.key === "ArrowLeft") {
      showIntro();
    }

    // if (evt.key === "n" || evt.key === "N") {
    //   socket.send("streaming_data");
    // }

    if (evt.key === "h" || evt.key === "H") {
      hideEverything();
    }
  });

  try {
    connectToSocket(websocketUrl);
  } catch (error) {
    console.log("ERROR: ", error);
  }
})();
