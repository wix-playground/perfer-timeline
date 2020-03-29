import { createStore, createHooks } from "react-global-hook";

const initialState = {
  timelines: null
};

const actions = {
  setTimelines(store, timelines) {
    store.setState({
      timelines
    });
  }
};

export const Store = createStore(initialState, actions, store => {
  store.setState({ timelines: null });
});

export const useGlobal = createHooks(Store);
