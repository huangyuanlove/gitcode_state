import { renderStatsCard } from "./cards/stats-card.js";
import {
  clampValue,
  getCardColors,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "./cards/common/utils.js";

import getRepository from "./cards/fetchers/repository_fetcher.js";
import axios from "axios";

export default async (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    `max-age=10, s-maxage=10, stale-while-revalidate=86400`
  );


  let {access_token} = req.query

  if (access_token) {
     console.log("请求链接中有token " + access_token);
  } else {
    //默认取环境变量中的 token
    let env_gitcode_token = process.env.gitcode_token;
    if (env_gitcode_token) {
      access_token = env_gitcode_token;
      console.log("取环境变量中的 token " + access_token);
    }
  }
  let { username} = req.query;
  if (username) {
     console.log("请求链接中有username " + username);
  } else {
    //默认取环境变量中的 token
    let env_username = process.env.username;
    if (env_username) {
      username = env_username;
      console.log("取环境变量中的 username " + username);
    }
  }



  const {
   
    hide,
    hide_title,
    hide_border,
    card_width,
    hide_rank,
    show_icons,
    include_all_commits,
    line_height,
    title_color,
    ring_color,
    icon_color,
    text_color,
    text_bold,
    bg_color,
    theme,
    cache_seconds,
    exclude_repo,
    custom_title,
    locale,
    disable_animations,
    border_radius,
    number_format,
    border_color,
    rank_icon,
    show,
  } = req.query;

  const stats = {
    name: username,
    totalPRs: 0,
    totalPRsMerged: 0,
    mergedPRsPercentage: 0,
    totalReviews: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    totalDiscussionsStarted: 0,
    totalDiscussionsAnswered: 0,
    contributedTo: 0,
    rank: { level: "C", percentile: 100 },
  };


  let getUserInfoUrl = `https://api.gitcode.com/api/v5/users/${username}?access_token=${access_token}`;
  let result = await axios.get(getUserInfoUrl);

  let userInfo = result.data;

  if (userInfo) {
    stats.name = userInfo["name"];
  }

  let allRepository = await getRepository({ username, access_token });
  if (Array.isArray(allRepository)) {
    allRepository.forEach((value) => {
      //排除 fork 的仓库
      if (value["fork"]) {
      } else {
        stats.totalStars += parseInt(value["stargazers_count"]);
      }
    });
  }

  const showStats = parseArray(show);

  let cacheSeconds = clampValue(
    parseInt(cache_seconds || CONSTANTS.CARD_CACHE_SECONDS, 10),
    CONSTANTS.TWELVE_HOURS,
    CONSTANTS.TWO_DAY
  );
  cacheSeconds = process.env.CACHE_SECONDS
    ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
    : cacheSeconds;

  res.setHeader(
    "Cache-Control",
    `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
  );

  const { titleColor, iconColor, textColor, bgColor, borderColor, ringColor } =
    getCardColors({
      title_color,
      text_color,
      icon_color,
      bg_color,
      border_color,
      ring_color,
      theme,
    });

  try {
    let result = renderStatsCard(stats, {
      hide: parseArray(hide),
      show_icons: true,
      // show_icons: parseBoolean(show_icons),
      hide_title: parseBoolean(hide_title),
      hide_border: parseBoolean(hide_border),
      card_width: parseInt(card_width, 10),
      hide_rank: true,
      include_all_commits: parseBoolean(include_all_commits),
      line_height,
      title_color,
      ring_color,
      icon_color,
      text_color,
      text_bold: parseBoolean(text_bold),
      bg_color,
      theme,
      custom_title,
      border_radius,
      border_color,
      number_format,
      locale: locale ? locale.toLowerCase() : null,
      disable_animations: parseBoolean(disable_animations),
      rank_icon,
      show: showStats,
    });

    res.send(result);
  } catch (err) {
    console.log("res.send error");
    console.log(err.message);
    console.log(err.secondaryMessage);
    res.setHeader(
      "Cache-Control",
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    );
    return res.send(
      renderError(err.message, err.secondaryMessage, {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      })
    );
  }
};
