
import express from 'express'

import { renderStatsCard } from './cards/stats-card.js'
import Card from './cards/common/Card.js';
import {
  CustomError,
  clampValue,
  flexLayout,
  getCardColors,
  kFormatter,
  measureText,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "./cards/common/utils.js";

import { isLocaleAvailable } from "./translations.js";


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.setHeader("Content-Type", "image/svg+xml");
  // res.setHeader(
  //   "Cache-Control",
  //   `max-age=10, s-maxage=10, stale-while-revalidate=86400`,
  // );



  const {
    username,
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

  //todo load data from gitcode
  const stats = {
    name: "",
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


const showStats = parseArray(show);


    let cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.CARD_CACHE_SECONDS, 10),
      CONSTANTS.TWELVE_HOURS,
      CONSTANTS.TWO_DAY,
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    // res.setHeader(
    //   "Cache-Control",
    //   `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    // );


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

console.error(`getCardColors result,title_color=${title_color},text_color=${text_color},icon_color=${icon_color},bg_color=${bg_color},border_color=${border_color},ring_color=${ring_color},theme=${theme}`)


  try {

    let result =       renderStatsCard(stats, {
        hide: parseArray(hide),
        show_icons: parseBoolean(show_icons),
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        card_width: parseInt(card_width, 10),
        hide_rank: parseBoolean(hide_rank),
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




  
    res.send(
 result
    );
  } catch (err) {
    console.log("res.send error")
     console.log(err.message)
      console.log( err.secondaryMessage)
    // res.setHeader(
    //   "Cache-Control",
    //   `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${CONSTANTS.ERROR_CACHE_SECONDS
    //   }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    // ); 
    return res.send(
      renderError(err.message, err.secondaryMessage, {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      }),
    );
  }
});

export default router
