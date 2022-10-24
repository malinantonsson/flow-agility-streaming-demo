# FlowAgility streaming Demo

## Setup

1. clone repo
2. run `npm install`
3. run `npm run dev` to start dev server

## Features

On message from server:

- check if there is no `run`, but there is a `run_ready` - update UI using `run_ready`:
- 1. When SO of the first run for the date/ring is set

- if `run` exists and `status_string` is `running`, update UI to use `run`:
- 3. When first playset is getting the first Fault
- 4. When first playset is getting the Refusal
- 4. When first playset is disqualified by the Judge
- 8. When 2nd run-pair 1st playset got first Fault

- if `run` exists and `status_string` is `calculated`, keep the run results on the screen for 5 seconds, then use the next round:
- 5. When first playset is submitted with 2F and 1R and time of 23.56
- 6. When second playset of the 2-playsets run (1st run-pair - without combined results) is submitted
- 7. When the 2nd run-pair SO is set (run-ready information is showing the run which is ready to start)
- 9. When 2nd run-pair 1st playset is submitted

## Todos

- [] get websocket URL from query string
- [] build demo page which runs through all 10 jsons
- [x] build results page
- [x] build a status page
- [x] show time on computed
- [x] hide F/R/Time on elimination
- [x] show error instead of dog info
