import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, object = undefined) {
  try {
    const fetchPro = object
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(object),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
