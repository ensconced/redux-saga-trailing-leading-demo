import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";

function* lineSaga() {}
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  (invocationCount = 0, action) => {
    if (action.type === "add-line") {
      return invocationCount + 1;
    }
  },
  0,
  applyMiddleware(sagaMiddleware)
);
store.subscribe((...args) => {
  console.log(store.getState());
});

sagaMiddleware.run(lineSaga);

setInterval(() => {
  store.dispatch({ type: "add-line" });
}, 1000);
