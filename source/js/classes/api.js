/* * * * * * * * * * * * * * * * * * * * * * * *
 * api.js
 */
async function sendData(url, body, onSuccess = () => { }, onFail = () => { }, onFinally = () => { }) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`${response.status} – ${response.statusText}: ${errorData}`);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (err) {
    console.error(err.message);
    onFail();
  } finally {
    onFinally();
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
