# cryo
A Chromium-derived browser tweaked and tested for stable streaming performance.

## Downloads

Please find the downloads in the release section:
[https://github.com/steveseguin/cryo/releases](https://github.com/steveseguin/cryo/releases)

## Using the App from Source

You'll need to download and extract the source code; or git clone it.
You'll also need npm installed.

### To run the app from source, you can:
```
npm install
npm start
```

### Building the app from source:
Building does not support cross-compiling. In order to build you must be logged in to a host having the target OS for the build. Once logged in, type the following:

```
npm install
npm run build
```

And for notorization on macOS,..
```
npm install
export appleId={yourApp@dev.email}
export appleIdPassword={app-specific-password-here}
sudo -E npm run build

```
