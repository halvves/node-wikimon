const irc = require('irc');
const ircColors = require('irc-colors');
const isIp = require('is-ip');
const queryString = require('querystring');
const SSEChannel = require('sse-channel');
const URL = require('url');

const ircConfig = require('./irc-config');

const testPage = require("fs").readFileSync(__dirname + "/test.html", "utf8");

const mon = new irc.Client(
  ircConfig.server,
  ircConfig.clientName,
  {channels: ircConfig.channels}
);

const sse = new SSEChannel({
  jsonEncode: true,
  cors: {origins: ['*']},
});

const wikiParse = new RegExp([
  /(?:\[\[(.*?)\]\])/, // page_title
  /\s+(?:([A-Z\!]+)\s)?/, // flags
  /(?:(\S*))/, // url
  /\s+\*\s(?:(.*))?/, // user
  /\s\*\s(?:\(([\+\-][0-9]+)\))?/, // change_size
  /\s?(?:(.+))?/, // summary
].map((r) => r.source).join(''));

mon.addListener('message', (from, to, text, message) => {
  const unformat = ircColors.stripColorsAndStyle(text);
  const parsed = unformat.match(wikiParse);
  if (parsed) {
    const flags = parsed[2] ? parsed[2] : '';
    const query = queryString.parse(URL.parse(parsed[3]).query);
    let action = 'edit';
    let url = parsed[3];
    if (!query.diff && !query.oldid) {
      action = url;
      url = null;
    }
    sse.send({
      data: {
        action: action,
        change_size: +parsed[5],
        flags: flags ? flags : null,
        hashtags: [], // TODO
        is_anon: isIp(parsed[4]),
        is_bot: flags.includes('B'),
        is_minor: flags.includes('M'),
        is_new: flags.includes('N'),
        is_unpatrolled: flags.includes('!'),
        mentions: [], // TODO
        ns: '', // TODO
        page_title: parsed[1],
        parent_rev_id: query.diff,
        rev_id: query.oldid,
        summary: parsed[6],
        url: url,
        user: parsed[4],
      },
    });
  }
});

module.exports = (req, res) => {
  if (req.url === '/') {
    sse.addClient(req, res);
    sse.send('Successfully connected to the Wikipedia events stream.');
  } else if (req.url === '/test') {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": Buffer.byteLength(testPage)
    });
    res.end(testPage);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
};
