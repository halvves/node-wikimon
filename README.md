# Node Wikimon

Live event stream of wikipedia updates.

Subscribe to the current version like so:
```javascript
const es = new EventSource("https://node-wikimon-fjxgifdxkf.now.sh/sse");
es.onmessage = function(e) {
  const dat = JSON.parse(e.data);
  processData(dat);
};
```
