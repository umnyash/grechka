function showAlert({ heading, text, status }) {
  const alert = new Alert({ heading, text, status });
  requestAnimationFrame(() => alert.open());
  return alert;
}
