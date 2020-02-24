function copyStringToClipboard(str) {
  let el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function saveStringAsFile(str, format) {
  let el = document.createElement('a');
  el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  el.setAttribute('download', `${str}.${format}`);

  el.style.display = 'none';
  document.body.appendChild(el);

  el.click();

  document.body.removeChild(el);
}
