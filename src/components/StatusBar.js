import React from "react";
import { useGlobal, Store, LOAD_STATUS } from "../state/store";

// import _ from "lodash";
// import { DOMAIN_FILTERS } from "../constants";

const STATUS_TEXT = {
  [LOAD_STATUS.UNKNOWN]: () => "👾 initializing...",
  [LOAD_STATUS.IN_PROGRESS]: () => "⏳ loading perfer results ...",
  [LOAD_STATUS.FAILURE]: (error) => <ErrorData error={error.message} />,
  [LOAD_STATUS.SUCCESS]: (timelines) => (
    <SuccessData {...timelines.branchJSON} />
  ),
};

const ErrorData = ({ error }) => (
  <div>
    <span>{`⚠️ failed to fetch data from perfer server; error is: `}</span>
    <span className={"preformatted-text"}>{`${error}`}</span>
    {error.includes("timeout") ? (
      <div style={{ fontWeight: "bold" }}>
        please make sure you're connected to wix VPN
      </div>
    ) : null}
  </div>
);

const updateBenchmark = (event) => {
  Store.actions.setBenchmarkIndex(event.target.value);
};

// const updateFilter = (event) => {
//   Store.actions.setDomainFilter(event.target.value);
// };

const DataAndLink = ({ clazz, branchName, commitHash }) => (
  <div className={clazz}>
    <span>showing results for PR </span>
    <a
      href={`https://github.com/wix-private/thunderbolt/pull/${
        branchName.split("/")[0]
      }`}
      target={"_blank"}
      rel="noopener noreferrer"
    >
      {`#${branchName.split("/")[0]}`}
    </a>
    <span>, commit </span>
    <a
      href={`https://github.com/wix-private/thunderbolt/commit/${commitHash}`}
      target={"_blank"}
      rel="noopener noreferrer"
    >
      {commitHash}
    </a>
  </div>
);

const SuccessData = ({ branchName, commitHash, benchmarks }) => {
  return (
    <div className="success-data-container">
      <DataAndLink {...{ branchName, commitHash, clazz: "row1" }} />
      <div className="row2">
        <label htmlFor="benchmark">
          <b>for benchmark:</b>
        </label>
        <select onChange={updateBenchmark} id="benchmark">
          {[""].concat(...Object.keys(benchmarks)).map((benchmark) => (
            <option key={benchmark} value={benchmark}>
              {benchmark.replace("__benchmarks__/", "")}
            </option>
          ))}
        </select>
        {/* <label htmlFor="domainFilter">domain filter</label>
        <select onChange={updateFilter} id="domainFilter">
          {[""].concat(_.values(DOMAIN_FILTERS)).map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
};

export default function StatusBar() {
  const [
    {
      loadStatus: { id, payload },
    },
  ] = useGlobal(["loadStatus"]);
  const status = STATUS_TEXT[id](payload);
  return <div className={`status-bar-container ${id}`}>{[status]}</div>;
}
