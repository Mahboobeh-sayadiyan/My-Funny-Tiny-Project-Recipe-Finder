import { TIME_OUT } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const resp = await Promise.race([fetch(url), timeout(TIME_OUT)]);
    if (!resp.ok)
      // this state is fullfiled but fail - it is not rejected
      throw new Error(`this is a ${resp.statusText}, check id for recipe.`);
    const { data } = await resp.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getJSONs = async function (url) {
  try {
    const resp = await Promise.race([fetch(url), timeout(TIME_OUT)]);
    if (!resp.ok)
      // this state is fullfiled but fail - it is not rejected
      throw new Error(
        `this is a ${resp.statusText}, we could not find any recipe, check keyword for recipe.`
      );
    const { data } = await resp.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const resp = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIME_OUT),
    ]);
    const data = await resp.json();
    if (!resp.ok)
      // this state is fullfiled but fail - it is not rejected
      throw new Error(`this is a ${resp.statusText}, ${data.message}`);
    return data;
  } catch (error) {
    throw error;
  }
};
