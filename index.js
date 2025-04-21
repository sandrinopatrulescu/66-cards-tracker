window.addEventListener('load', function () {
  const button = document.getElementById("toggleAll");
  button.addEventListener('click', () => {
    alert('Not implemented');
  });

  const backgroundColorPicker = document.getElementById('backgroundColorPicker');
  backgroundColorPicker.addEventListener('input', (event) => {
    document.body.style.backgroundColor = event.target.value;
  });
});
