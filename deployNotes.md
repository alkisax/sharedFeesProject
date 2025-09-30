- Build Command:
```
cd frontend && npm install && npm run build \
&& cd ../backend && npm install && npm run build
```
- Start Command:
```
cd backend && npm start
```
- back package
```
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "dev:test": "cross-env NODE_ENV=test ts-node-dev --respawn --transpile-only server.ts",
    "lint": "eslint src/**/*.{js,jsx,ts,tsx} --ignore-pattern dist",
    "start": "node build/src/server.js",
    "test": "cross-env NODE_ENV=test jest --coverage --testTimeout=50000 --runInBand --verbose --silent --resetModules --clearMocks",
    "test:log": "cross-env NODE_ENV=test jest --coverage --testTimeout=50000 --runInBand --verbose --resetModules --clearMocks"
  },
```
- front package
```
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "postbuild": "rm -rf ../backend/public && cp -r dist ../backend/public",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
```
- had to do this change in app.ts
```ts
// // για να σερβίρει τον φακελο dist του front μετα το npm run build
// // app.use(express.static('dist'));
// app.use(express.static(path.join(__dirname, '../../dist')));

// //αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
// app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
//   // res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//   res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
// });
// run into problems and changed this 👆🏼 to this 👇🏼
// serve frontend build from public/
app.use(express.static(path.join(__dirname, "public")));

app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

```