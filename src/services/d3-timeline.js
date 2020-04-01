import d3 from "d3";
import "./d3-timeline-plugin";

var $ = selector => document.querySelector(selector);

const colorsManager = (() => {
  const COLORS_MATRIX = {
    range: ["#a52a2a", "#90ee90", "#cdc1c5"],
    domain: ["regression", "improvement", "same"]
  };
  return {
    getDiffsColorsScale: () =>
      d3.scale
        .ordinal()
        .range(COLORS_MATRIX.range)
        .domain(COLORS_MATRIX.domain),
    getDiffColor: (diff_type, defaultColor) => {
      const colorIndex = COLORS_MATRIX.domain.indexOf(diff_type);
      return colorIndex < 0 ? defaultColor : COLORS_MATRIX.range[colorIndex];
    },
    getSignleColor: () =>
      d3.scale
        .ordinal()
        .range(["#1f77b4"])
        .domain([])
  };
})();

const buildText = d => {
  var onHoverDisplay = `<strong>${d.key}</strong> (at ${d.starting_time} ms)<br>`;
  let diff = "";
  if (typeof d.diff === "number" && d.diff_type !== "same") {
    const regression = d.diff_type === "regression";
    const symbol = regression ? "+" : "-";
    diff += `<span style="font-weight: bold; color: ${
      regression ? "red" : "green"
    };">(${symbol}${Math.abs(d.diff)} ms)</span>`;
  }
  if (d.display === "circle") {
    onHoverDisplay += `${diff}`;
  } else {
    onHoverDisplay += `<i>duration: ${d.duration} ms</i> ${diff}`;
  }
  return onHoverDisplay;
};

const createOnHoverHandler = cotainerId => d => {
  const root = $(`${cotainerId}_container [data-hook="name"]`);
  root.style = `border: 3px dotted ${colorsManager.getDiffColor(
    d.diff_type,
    "#1f77b4"
  )}`;
  root.innerHTML = buildText(d);
};

function buidBaseChart(cotainerId, width) {
  return (
    d3
      .timeline()
      .width(width * 4)
      .stack()
      .margin({ left: 70, right: 30, top: 0, bottom: 0 })
      .hover(createOnHoverHandler(cotainerId))
      .showTimeAxisTick()
      .tickFormat({
        format: d3.time.format("%L"),
        tickTime: d3.timeMilliseconds,
        tickInterval: 100,
        tickSize: 3,
        numTicks: 25
      })
      // .showBorderLine()
      .colorProperty("diff_type")
  );
}

const normalizeDataTimestamps = data => {
  const normalizeTime = val => new Date(Math.round(val)).getTime();
  data.forEach(({ times }) => {
    times.forEach(item => {
      item.starting_time = normalizeTime(item.starting_time);
      item.ending_time = item.ending_time
        ? normalizeTime(item.ending_time)
        : undefined;
    });
  });
};

function attachChart(id, data = [], chartBuilder, width) {
  normalizeDataTimestamps(data);
  d3.select(id)
    .append("svg")
    .attr("width", width)
    .datum(data)
    .call(chartBuilder(id));
  return () => {
    $(`${id} svg`).remove();
  };
}

export default function exec(payload) {
  const { target, baseline } = payload || {};
  const width = document.documentElement.clientWidth * 0.8;
  const cleanupBranch = attachChart(
    "#timeline_branch",
    target,
    id => buidBaseChart(id, width).colors(colorsManager.getDiffsColorsScale()),
    width
  );
  const cleanupMaster = attachChart(
    "#timeline_master",
    baseline,
    id => buidBaseChart(id, width).colors(colorsManager.getSignleColor()),
    width
  );
  // cleaup
  return () => {
    cleanupBranch();
    cleanupMaster();
  };
}
