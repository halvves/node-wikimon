# Node Wikimon

Live event stream of wikipedia updates (a spinoff of [hatnote/wikimon](https://github.com/hatnote/wikimon)).

Example usage: http://halvves.com/wikipedia-audiovisuals/

Subscribe to a public version of the stream:
```javascript
const es = new EventSource("https://wikimon.halvves.com");
es.onmessage = function(e) {
  const dat = JSON.parse(e.data);
  processData(dat);
};
```

## Format

Here are a couple example messages, as broadcast over SSE:

```json
{
  "action": "edit",
  "change_size": 191,
  "flags": "!N",
  "hashtags": [],
  "is_anon": false,
  "is_bot": false,
  "is_minor": false,
  "is_new": true,
  "is_unpatrolled": true,
  "mentions": [],
  "ns": "",
  "page_title": "User:Abhisirohi5",
  "rev_id": "783343086",
  "summary": "[[WP:AES|←]]Created page with '[[Abhishek Sirohi]] Abhishek Sirohi is a Master of Computer Science Student at the University of Melbourne. He is a published scientific author and wants to achi...'",
  "url": "https://en.wikipedia.org/w/index.php?oldid=783343086&rcid=947971474",
  "user": "Abhisirohi5"
}, {
  "action": "create",
  "change_size": null,
  "flags": null,
  "hashtags": [],
  "is_anon": false,
  "is_bot": false,
  "is_minor": false,
  "is_new": false,
  "is_unpatrolled": false,
  "mentions": [],
  "ns": "",
  "page_title": "Special:Log/newusers",
  "summary": "New user account",
  "url": null,
  "user": "BernJL"
}
```

## See also

* [wikimon](https://github.com/hatnote/wikimon)
* [hatnote](https://github.com/hatnote)
* [Stephen LaPorte](https://github.com/slaporte)
* [Mahmoud Hashemi](https://github.com/mahmoud)
