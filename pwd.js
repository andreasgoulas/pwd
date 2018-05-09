function toBase64(buffer) {
  const array = new Uint8Array(buffer);

  let result = "";
  for (let i = 0; i < array.byteLength; ++i) {
    result += String.fromCharCode(array[i]);
  }

  return window.btoa(result);
}

async function pbkdf2(password, salt) {
  if (!window.crypto || !window.crypto.subtle) {
    throw "Your browser does not support the Web Cryptography API";
  }

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    password,
    { name: "PBKDF2" },
    false,
    [ "deriveKey" ]);

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 10000,
      hash: "SHA-256"
    },
    baseKey,
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    true,
    [ "sign" ]);

  return await window.crypto.subtle.exportKey("raw", key);
}

async function generatePass(masterPass, hostname, n) {
  if (!window.TextEncoder) {
    throw "Your browser does not support the Encoding API";
  }

  const encoder = new TextEncoder("utf-8");
  const salt = hostname + ":" + n;
  const result = await pbkdf2(encoder.encode(masterPass), encoder.encode(salt));
  return toBase64(result).substr(0, 16);
}

function run() {
  const masterPass = document.getElementById("master-pass").value;
  const hostname = document.getElementById("hostname").value;
  const n = document.getElementById("n").value;
  generatePass(masterPass, hostname, n).then(function(result) {
    document.getElementById("result").value = result;
  }).catch(function(err) {
    alert(err);
  });
}

function toggleShow() {
  const result = document.getElementById("result");
  const button = document.getElementById("toggle-show");
  if (button.classList.contains("fa-eye")) {
    result.setAttribute("type", "text");
    button.classList.remove("fa-eye");
    button.classList.add("fa-eye-slash");
  } else {
    result.setAttribute("type", "password");
    button.classList.remove("fa-eye-slash");
    button.classList.add("fa-eye");
  }
}

function copy() {
  const element = document.getElementById("result");
  if (navigator.clipboard) {
    navigator.clipboard.writeText(element.value).catch(function(err) {
      alert(err);
    });
  } else {
    element.focus();
    element.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      alert(err);
    }
  }
}

document.getElementById("master-pass").addEventListener("keydown", event => {
  if (event.keyCode == 13) {
    run();
  }
});
