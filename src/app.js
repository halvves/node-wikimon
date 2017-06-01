import cors from 'cors';
import express from 'express';
import irc from 'irc';
import ircColors from 'irc-colors';
import isIp from 'is-ip';
import queryString from 'querystring';
import SSEChannel from 'sse-channel';
import URL from 'url';

import ircConfig from './irc-config';

const app = express();
app.use(cors());

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

app.get('/', (req, res) => {
  sse.addClient(req, res);
  sse.send('Successfully connected to the Wikipedia events stream.');
});

app.listen(3030);
