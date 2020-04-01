import _ from "lodash";

const extractAllBenchmarks = ({ branchJSON, masterJSON }, benchmarkIndex) => {
  const { benchmarks: branch } = branchJSON;
  const { benchmarks: master } = masterJSON;
  return {
    target_benchmarks: branch[benchmarkIndex],
    baseline_benchmarks: master[benchmarkIndex] // TODO - support all benchmrks
  };
};

const cleanFedopsMark = measureName => {
  return measureName
    .replace("[fedops]", "")
    .replace(/(started|finished)$/, "")
    .trim();
};

const extractMarks = ({ benchmark }) => {
  return _.chain(benchmark.medians.marks)
    .map(({ median }, measureName) => {
      const key = cleanFedopsMark(measureName);
      return { key, value: median };
    })
    .sortBy("value")
    .value();
};

const normalizeFloat = num => parseFloat(num.toFixed(2));

const getItemType = item =>
  typeof item.duration === "undefined" ? "mark" : "measure";

const mergeTimeline = marks => {
  const founds = [];
  return _.chain(marks)
    .map((mark, i) => {
      if (founds.includes(mark.key)) {
        return null;
      }
      const j = _.findLastIndex(marks, { key: mark.key });
      if (i === j) {
        return {
          ...mark,
          key: mark.key,
          starting_time: mark.value,
          display: "circle"
        };
      }
      founds.push(mark.key);
      const starting_time = mark.value;
      const ending_time = marks[j].value;
      return {
        ...mark,
        key: mark.key,
        starting_time,
        ending_time,
        duration: normalizeFloat(ending_time - starting_time)
      };
    })
    .compact()
    .sortBy("starting_time")
    .value();
};

const isIntersect = (range1, range2) => {
  var iStart =
    range1.starting_time < range2.starting_time
      ? range2.starting_time
      : range1.starting_time;
  var iEnd =
    range1.ending_time < range2.ending_time
      ? range1.ending_time
      : range2.ending_time;
  return iStart < iEnd;
};

const buildMultiLevelTimeline = flatTimeline => {
  let levels = [[], []];
  const addToLevel = (item, level) => {
    levels[level] = _.concat(levels[level] || [], item);
  };
  _.forEach(flatTimeline, item => {
    if (getItemType(item) === "mark") {
      addToLevel(item, 0);
      return;
    }
    for (let j = 1; j < levels.length; j++) {
      const last = _.last(levels[j]);
      if (!last || isIntersect(last, item) === false) {
        addToLevel(item, j);
        break;
      }
      if (levels.length === j + 1) {
        levels.push([]);
      }
    }
  });
  return _.map(levels, level => ({ times: level }));
};

const applyDiffData = (targetItem, baselineItem) => {
  const isMeasure = getItemType(targetItem) === "measure";
  const diffProp = isMeasure ? "duration" : "value";
  const diff = targetItem[diffProp] - baselineItem[diffProp];
  const hasImpact = diff !== 0 && Math.abs(diff / baselineItem.value) > 0.05;
  const diff_type = hasImpact
    ? diff < 0
      ? "improvement"
      : "regression"
    : "same";
  return {
    diff: normalizeFloat(diff),
    diff_type
  };
};

const transformTargetDiffs = (targetMarks, baselineMarks) => {
  return _.map(targetMarks, item => {
    const baseline = _.find(baselineMarks, { key: item.key });
    if (!baseline) {
      console.warn(`found new event - '${item.key}'!`);
      return;
    }
    const diffData = applyDiffData(item, baseline);
    return {
      ...item,
      ...diffData
    };
  });
};

export default function exec(timelines, benchmarkIndex) {
  if (!benchmarkIndex || !timelines) return {};
  const [targetMarks, baselineMarks] = _.map(
    extractAllBenchmarks(timelines, benchmarkIndex),
    extractMarks
  );
  const [targetTimeline, baselineTimeline] = _.map(
    [targetMarks, baselineMarks],
    mergeTimeline
  );
  const __targetTimeline__ = transformTargetDiffs(
    targetTimeline,
    baselineTimeline
  );
  const [targetResult, baselineResult] = _.map(
    [__targetTimeline__, baselineTimeline],
    buildMultiLevelTimeline
  );
  return {
    target: targetResult,
    baseline: baselineResult
  };
}
