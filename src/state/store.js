import { createStore, createHooks } from "react-global-hook";

export const LOAD_STATUS = {
  UNKNOWN: "unknown",
  SUCCESS: "success",
  FAILURE: "failure",
  IN_PROGRESS: "in-progress"
};

const initialState = {
  timelines: null,
  loadStatus: {
    id: LOAD_STATUS.UNKNOWN,
    payload: null
  },
  benchmarkIndex: null
};

const actions = {
  setTimelines(store, newTimelines) {
    const { timelines, ...rest } = store.state;
    store.setState({
      ...rest,
      timelines: newTimelines
    });
  },
  setLoadStatus(store, { id, payload }) {
    const { loadStatus, ...rest } = store.state;
    store.setState({
      ...rest,
      loadStatus: { id, payload }
    });
  },
  setBenchmarkIndex(store, value) {
    const { benchmarkIndex, ...rest } = store.state;
    store.setState({
      ...rest,
      benchmarkIndex: value
    });
  }
};

export const Store = createStore(initialState, actions);

export const useGlobal = createHooks(Store);
