import React from "react";
import { useGlobal, LOAD_STATUS } from "../state/store";

const STATUS_TEXT = {
  [LOAD_STATUS.UNKNOWN]: () => "👾 initializing...",
  [LOAD_STATUS.IN_PROGRESS]: () => "⏳ loading perfer results ...",
  [LOAD_STATUS.FAILURE]: error => <ErrorData error={error.message} />,
  [LOAD_STATUS.SUCCESS]: timelines => <SuccessData {...timelines.branchJSON} />
};

const ErrorData = ({ error }) => (
  <div>
    <div>{"⚠️ failed to fetch data from perfer server, error was:"}</div>
    <pre>{error}</pre>
  </div>
);

const SuccessData = ({ branchName, commitHash }) => {
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
