import {
  debounce,
  put,
  throttle,
} from "../redux-saga/packages/redux-saga/effects";
import createSagaMiddleware from "../redux-saga/packages/redux-saga";
import { createStore, applyMiddleware } from "redux";

function* addLine(divId) {
  yield put({ type: "add-line", divId });
}

function* lineSaga() {
  yield debounce(
    { delayLength: 200, leading: true, trailing: false },
    "mousemove",
    addLine,
    "debounce-leading"
  );
  yield debounce(
    { delayLength: 200, leading: false, trailing: true },
    "mousemove",
    addLine,
    "debounce-trailing"
  );
  yield debounce(
    { delayLength: 200, leading: true, trailing: true },
    "mousemove",
    addLine,
    "debounce-leading-and-trailing"
  );
  yield throttle(200, "mousemove", addLine, "throttle");
}

const sagaMiddleware = createSagaMiddleware();

const initialState = {
  "debounce-leading": 0,
  "debounce-trailing": 0,
  "debounce-leading-and-trailing": 0,
  throttle: 0,
};

const store = createStore(
  (state = initialState, action) => {
    if (action.type === "add-line") {
      return {
        ...state,
        [action.divId]: (state[action.divId] + 1) % 1000,
      };
    } else {
      return state;
    }
  },
  initialState,
  applyMiddleware(sagaMiddleware)
);

store.subscribe((...args) => {
  Object.keys(initialState).forEach((divId) => {
    const count = store.getState()[divId];
    document.getElementById(divId).innerHTML = "█".repeat(count);
  });
});

sagaMiddleware.run(lineSaga);

document.addEventListener("mousemove", () => {
  store.dispatch({ type: "mousemove" });
});
