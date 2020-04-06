import { loadPerferData } from "../services/load-perfer-data";
import { useEffect } from "react";
import { Store, useGlobal, LOAD_STATUS } from "./store";

export const usePerferData = () => {
  const { setLoadStatus, setTimelines } = Store.actions;
  useEffect(() => {
    setLoadStatus({ id: LOAD_STATUS.IN_PROGRESS });
    loadPerferData()
      .then((payload) => {
        setTimelines(payload);
        setLoadStatus({ id: LOAD_STATUS.SUCCESS, payload });
      })
      .catch((err) => setLoadStatus({ id: LOAD_STATUS.FAILURE, payload: err }));
  }, [setLoadStatus, setTimelines]);
  const [{ timelines, benchmarkIndex, domainFilter }] = useGlobal([
    "timelines",
    "benchmarkIndex",
    "domainFilter",
  ]); // listen to timelines changes
  // TODO - why benchmarkIndex and domainFilter are here??
  return { timelines, benchmarkIndex, domainFilter };
};
