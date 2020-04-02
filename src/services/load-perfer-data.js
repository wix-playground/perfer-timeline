import { get as fetch } from "axios";

const urlParamGetterFactory = params => paramName => {
  const id = params.get(paramName);
  if (id) {
    return id;
  }
  throw new Error(
    `expected valid value for url param ${paramName}; make sure your url is valid`
  );
};

const parseParams = () => {
  const get = urlParamGetterFactory(
    new URL(document.location.href).searchParams
  );
  return {
    branchJSONId: get("current"),
    masterJSONId: get("master")
  };
};

const perferAPI = id => `https://bo.wix.com/performance-stats/payloads/${id}`;

export const loadPerferData = async () => {
  const { branchJSONId, masterJSONId } = parseParams();
  const [branchJSON, masterJSON] = await Promise.all(
    [perferAPI(branchJSONId), perferAPI(masterJSONId)].map(async url => {
      const { data } = await fetch(url, {
        timeout: 5000
      });
      return data;
    })
  );
  return { branchJSON, masterJSON };
};
