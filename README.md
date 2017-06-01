# Node Wikimon

Live event stream of wikipedia updates.

Subscribe to the current version like so:
```javascript
const es = new EventSource("https://node-wikimon-iiqfpsnkfn.now.sh/sse");
const.onmessage = function(e) {
  const dat = JSON.parse(e.data);
  processData(dat);
};
```
