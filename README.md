# structinf.com/pwd

Yet another stateless password manager.

The passwords are generated using the PBKDF2-HMAC-SHA256 algorithm. All
computations are performed client-side, in the browser.

Requirements:
* ES8
* Encoding API
* Web Cryptography API

The script implements the following algorithm:
```python
result = b64encode(pbkdf2_hmac(
  "sha256",
  masterPass.encode(),
  (hostname + ":" + str(n)).encode(),
  10000)).decode()[0:16]
```
