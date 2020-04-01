import { loadPerferData } from "../services/load-perfer-data";
import { useEffect } from "react";
import { Store, useGlobal, LOAD_STATUS } from "./store";

export const usePerferData = () => {
  const { setLoadStatus, setTimelines } = Store.actions;
  useEffect(() => {
    setLoadStatus({ id: LOAD_STATUS.IN_PROGRESS });
    loadPerferData()
      .then(payload => {
        setTimelines(payload);
        setLoadStatus({ id: LOAD_STATUS.SUCCESS, payload });
      })
      .catch(err => setLoadStatus({ id: LOAD_STATUS.FAILURE, payload: err }));
  }, []);
  const [state] = useGlobal(["timelines"]); // listen to timelines changes
  return state.timelines;
};
