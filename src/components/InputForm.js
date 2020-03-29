import React, { useState } from "react";
import axios from "axios";
import { useInput } from "../hooks/input-hook";
import { Store } from "../store";

const InputLabel = ({ txt }) => <div>{txt}</div>;

const loadExamples = async onLoadFinish => {
  const [branchJSON, masterJSON] = await Promise.all(
    [
      "https://perfer-timeline-poc.s3.amazonaws.com/branch_3.json",
      "https://perfer-timeline-poc.s3.amazonaws.com/master_3.json"
    ].map(async url => {
      const { data } = await axios.get(url);
      return data;
    })
  );
  onLoadFinish({ branchJSON, masterJSON });
};

export default function InputForm(props) {
  const {
    value: branchJSONstr,
    valid: validBranchJSON,
    bind: bindBranchJSON,
    setValue: setValueBranchJSON,
    setValid: setValideBranchJSON,
    reset: resetBranchJSON
  } = useInput("");
  const {
    value: masterJSONstr,
    valid: validMasterJSON,
    bind: bindMasterJSON,
    setValue: setValueMasterJSON,
    setValid: setValidMasterJSON,
    reset: resetMasterJSON
  } = useInput("");

  const [loadingExamples, setLoadingExamples] = useState(false);

  const setTimelines = () => {
    try {
      const branchJSON = JSON.parse(branchJSONstr.trim());
      const masterJSON = JSON.parse(masterJSONstr.trim());
      Store.actions.setTimelines({ branchJSON, masterJSON });
    } catch (e) {
      alert(`invalid input JSON! ${e.message}`);
    }
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    setTimelines();
    resetBranchJSON();
    resetMasterJSON();
    setValideBranchJSON(false);
    setValidMasterJSON(false);
  };

  const onLoadFinish = ({ branchJSON, masterJSON }) => {
    setLoadingExamples(false);
    setValueBranchJSON(JSON.stringify(branchJSON));
    setValideBranchJSON(true);
    setValueMasterJSON(JSON.stringify(masterJSON));
    setValidMasterJSON(true);
  };

  const validationClass = isValid => (isValid ? "valid" : "invalid");

  return (
    <div>
      <div className="load-examples-button">
        <button
          onClick={() => {
            setLoadingExamples(true);
            loadExamples(onLoadFinish);
          }}
        >
          {"load examples"}
        </button>

        <div>{loadingExamples ? "loading..." : ""}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <InputLabel txt={"branch JSON"} />
          <textarea
            className={validationClass(validBranchJSON)}
            {...bindBranchJSON}
          />
        </label>
        <label>
          <InputLabel txt={"master JSON"} />
          <textarea
            className={validationClass(validMasterJSON)}
            {...bindMasterJSON}
          />
        </label>
        <input
          type="submit"
          disabled={!(validBranchJSON && validMasterJSON)}
          value="GO 🚀"
        />
      </form>
    </div>
  );
}
