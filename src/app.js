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

mon.addListener('message', (from, to, text, message) => {
  const unformat = ircColors.stripColorsAndStyle(text);
  const parsed = unformat.match(/\[\[(.*?)\]\]\s?([A-Z\!]+)?\s?(\S*)\s\*\s(.*?)\s\*\s\(?([\+\-][0-9]+)?\)\s?(.+)?/);
  const flags = parsed && parsed[2] ? parsed[2] : '';
  const query = parsed && queryString.parse(URL.parse(parsed[3]).query);
  parsed && sse.send({
    data: {
      page_title: parsed[1],
      flags: flags,
      url: parsed[3],
      user: parsed[4],
      change_size: +parsed[5],
      summary: parsed[6],
      is_anon: isIp(parsed[4]),
      is_new: flags.includes('N'),
      is_bot: flags.includes('B'),
      is_minor: flags.includes('M'),
      is_unpatrolled: flags.includes('!'),
      parent_rev_id: query.diff,
      rev_id: query.oldid,
    },
  });
});

app.get('/sse', (req, res) => {
  sse.addClient(req, res);
  sse.send('Successfully connected to the Wikipedia events stream.');
});

app.listen(3030);
