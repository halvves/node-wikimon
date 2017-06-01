# Node Wikimon

Live event stream of wikipedia updates.

Subscribe to a public version of the stream:
```javascript
const es = new EventSource("https://wikimon.now.sh");
es.onmessage = function(e) {
  const dat = JSON.parse(e.data);
  processData(dat);
};
```
