import { debounce, put } from "../redux-saga/packages/redux-saga/effects";
import createSagaMiddleware from "../redux-saga/packages/redux-saga";
import { createStore, applyMiddleware } from "redux";

const delayLength = 1000;

function* addLine(divId) {
  yield put({ type: "add-line", divId });
}

function* lineSaga() {
  yield debounce(
    { delayLength, leading: true, trailing: false },
    "keydown",
    addLine,
    "debounce-leading"
  );
  yield debounce(
    { delayLength, leading: false, trailing: true },
    "keydown",
    addLine,
    "debounce-trailing"
  );
  yield debounce(
    { delayLength, leading: true, trailing: true },
    "keydown",
    addLine,
    "debounce-leading-and-trailing"
  );
}

const sagaMiddleware = createSagaMiddleware();

const initialState = {
  "debounce-leading": 0,
  "debounce-trailing": 0,
  "debounce-leading-and-trailing": 0,
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

document.addEventListener("keydown", () => {
  store.dispatch({ type: "keydown" });
});
