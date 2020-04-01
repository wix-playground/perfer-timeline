import React, { useEffect } from "react";
import convertToTimelineData from "../services/perfer-to-d3-timeline";
import execD3Timline from "../services/d3-timeline";
import { usePerferData } from "../state/use-perfer-data.hook";

const TimelinesContainer = ({ show }) => (
  <div className={`timeline-container ${show ? "visibile" : "hidden"}`}>
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
  const timelines = usePerferData();
  useEffect(() => execD3Timline(convertToTimelineData(timelines)), [timelines]);
  return <TimelinesContainer show={Boolean(timelines)} />;
}
