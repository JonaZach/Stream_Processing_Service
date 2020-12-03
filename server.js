const express = require("express");
const app = express();
const port = 3000;
const currentOS = process.platform;
const header = `For types counter, navigate to http://localhost:3000/types<br>
  For words counter, navigate to http://localhost:3000/words<br>
  For counters of the last minute, navigate to http://localhost:3000/lastminutetypes or to http://localhost:3000/lastminutewords`;
let types = new Map();
let words = new Map();
let lastMinuteTypes = new Map();
let lastMinuteWords = new Map();
let child;

app.get("/", (req, res) => {
  res.send(header);
});

app.get("/types", (req, res) => {
  let displayTypes = "";
  if (types) {
    types.forEach((value, key, map) => {
      displayTypes += `"${key}" → ${value}, `;
    });
    res.send(`${displayTypes.slice(0, -2)}`);
  }
});

app.get("/words", (req, res) => {
  let displayWords = "";
  if (words) {
    words.forEach(
      (value, key, map) => (displayWords += `"${key}" → ${value}, `)
    );
    res.send(`${displayWords.slice(0, -2)}`);
  }
});

app.get("/lastminutetypes", (req, res) => {
  let displayLastMinuteTypes = "";
  if (lastMinuteTypes) {
    lastMinuteTypes.forEach(
      (value, key, map) => (displayLastMinuteTypes += `"${key}" → ${value}, `)
    );
    res.send(`${displayLastMinuteTypes.slice(0, -2)}`);
  }
});

app.get("/lastminutewords", (req, res) => {
  console.log(lastMinuteWords);
  let displayLastMinuteWords = "";
  if (lastMinuteWords) {
    lastMinuteWords.forEach(
      (value, key, map) => (displayLastMinuteWords += `"${key}" → ${value}, `)
    );
    res.send(`${displayLastMinuteWords.slice(0, -2)}`);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

const { spawn } = require("child_process");
switch (currentOS) {
  case "win32":
    child = spawn("./resources/generator-windows-amd64.exe");
    break;
  case "darwin":
    child = spawn("./resources/generator-macosx-amd64");
    break;
  case "linux":
    child = spawn("./resources/generator-linux-amd64");
    break;
  default:
    child = spawn("./resources/generator-windows-amd64.exe");
}

child.stdout.on("data", data => {
  const strLines = data.toString().split("\n");

  for (const i in strLines) {
    if (isJSON(strLines[i])) {
      const obj = JSON.parse(strLines[i]);
      const { event_type: type, data, timestamp } = obj;

      if (types.has(type)) types.set(type, types.get(type) + 1);
      else types.set(type, 1);

      if (lastMinuteTypes.has(type))
        lastMinuteTypes.set(type, lastMinuteTypes.get(type) + 1);
      else lastMinuteTypes.set(type, 1);

      if (words.has(data)) words.set(data, words.get(data) + 1);
      else words.set(data, 1);

      if (lastMinuteWords.has(data))
        lastMinuteWords.set(data, lastMinuteWords.get(data) + 1);
      else lastMinuteWords.set(data, 1);

      setTimeout(function () {
        if (lastMinuteTypes.get(type) > 1)
          lastMinuteTypes.set(type, lastMinuteTypes.get(type) - 1);
        else lastMinuteTypes.delete(type);

        if (lastMinuteWords.get(data) > 1)
          lastMinuteWords.set(data, lastMinuteWords.get(data) - 1);
        else lastMinuteWords.delete(data);
      }, 60000);
    }
  }
});

child.stderr.on("data", data => {
  console.error(`stderr: ${data}`);
});

child.on("close", code => {
  console.log(`child process exited with code ${code}`);
});

function isJSON(str) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}
