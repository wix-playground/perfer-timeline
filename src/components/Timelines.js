import React, { useEffect } from "react";
import { useGlobal } from "../store";
import convertToTimelineData from "../core/perfer-to-d3-timeline";
import execD3Timline from "../core/d3-timeline";

const TimelinesContainer = () => (
  <div className="timeline-container">
    <h3>current branch</h3>
    <div id="timeline_branch" />
    <div id="timeline_branch_container">
      <div data-hook="name" />
    </div>
    <h3>baseline (master)</h3>
    <div id="timeline_master" />
    <div id="timeline_master_container">
      <div data-hook="name" />
    </div>
  </div>
);

export default function Timelines() {
  const [state] = useGlobal(["timelines"]);

  useEffect(() => {
    if (state.timelines) {
      const timelineData = convertToTimelineData(state.timelines);
      execD3Timline(timelineData);
    }
  });

  if (state.timelines) {
    return <TimelinesContainer />;
  }
  return <div />;
}
