import React from "react";
import { useGlobal, Store, LOAD_STATUS } from "../state/store";

const STATUS_TEXT = {
  [LOAD_STATUS.UNKNOWN]: () => "👾 initializing...",
  [LOAD_STATUS.IN_PROGRESS]: () => "⏳ loading perfer results ...",
  [LOAD_STATUS.FAILURE]: error => <ErrorData error={error.message} />,
  [LOAD_STATUS.SUCCESS]: timelines => <SuccessData {...timelines.branchJSON} />
};

const ErrorData = ({ error }) => (
  <div>
    <span>{`⚠️ failed to fetch data from perfer server; error is: `}</span>
    <span className={"preformatted-text"}>{`${error}`}</span>
    {error.includes("timeout") ? (
      <div style={{ "font-weight": "bold" }}>
        please make sure you're connected to wix VPN
      </div>
    ) : null}
  </div>
);

const updateBenchmark = event => {
  Store.actions.setBenchmarkIndex(event.target.value);
};

const SuccessData = ({ branchName, commitHash, benchmarks }) => {
  const PRnumber = branchName.split("/")[0];
  return (
    <div>
      <span>showing results for PR </span>
      <a
        href={`https://github.com/wix-private/thunderbolt/pull/${
          branchName.split("/")[0]
        }`}
        target={"_blank"}
      >
        {`#${PRnumber}`}
      </a>
      <span>, commit </span>
      <a
        href={`https://github.com/wix-private/thunderbolt/commit/${commitHash}`}
        target={"_blank"}
      >
        {commitHash}
      </a>
      <span>
        , <b>for benchmark:</b>
      </span>
      <div>
        <select onChange={updateBenchmark} id="benchmark">
          {[""].concat(...Object.keys(benchmarks)).map(benchmark => (
            <option key={benchmark} value={benchmark}>
              {benchmark.replace("__benchmarks__/", "")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default function StatusBar() {
  const [
    {
      loadStatus: { id, payload }
    }
  ] = useGlobal(["loadStatus"]);
  const status = STATUS_TEXT[id](payload);
  return <div className={`status-bar-container ${id}`}>{[status]}</div>;
}
