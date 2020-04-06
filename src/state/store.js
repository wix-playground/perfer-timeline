import _ from "lodash";
import { createStore, createHooks } from "react-global-hook";

export const LOAD_STATUS = {
  UNKNOWN: "unknown",
  SUCCESS: "success",
  FAILURE: "failure",
  IN_PROGRESS: "in-progress",
};

const initialState = {
  timelines: null,
  loadStatus: {
    id: LOAD_STATUS.UNKNOWN,
    payload: null,
  },
  benchmarkIndex: null,
  domainFilter: null,
};

const actionFactory = (namespace) => {
  return (store, newValue) => {
    const rest = _.omit(store.state, [namespace]);
    store.setState({
      ...rest,
      [namespace]: newValue,
    });
  };
};

const actions = {
  setTimelines: actionFactory("timelines"),
  setLoadStatus: actionFactory("loadStatus"),
  setBenchmarkIndex: actionFactory("benchmarkIndex"),
  setDomainFilter: actionFactory("domainFilter"),
};

export const Store = createStore(initialState, actions);

export const useGlobal = createHooks(Store);
