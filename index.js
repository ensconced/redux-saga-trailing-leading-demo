import { debounce, put, throttle } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";

function* addLine(divId) {
  yield put({ type: "add-line", divId });
}

function* lineSaga() {
  yield debounce(200, "mousemove", addLine, "debounce");
  yield throttle(200, "mousemove", addLine, "throttle");
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  (state = { debounce: 0, throttle: 0 }, action) => {
    if (action.type === "add-line") {
      return {
        ...state,
        [action.divId]: (state[action.divId] + 1) % 1000,
      };
    } else {
      return state;
    }
  },
  { debounce: 0, throttle: 0 },
  applyMiddleware(sagaMiddleware)
);

store.subscribe((...args) => {
  ["debounce", "throttle"].forEach((divId) => {
    const count = store.getState()[divId];
    document.getElementById(divId).innerHTML = "█".repeat(count);
  });
});

sagaMiddleware.run(lineSaga);

document.addEventListener("mousemove", () => {
  store.dispatch({ type: "mousemove" });
});
