
import getRepository from "./cards/fetchers/repository_fetcher.js";
import { renderTopLanguages } from "./cards/top-languages-card.js";
import {
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "./cards/common/utils.js";

import { isLocaleAvailable } from "./translations.js";

export default async (req, res) => {
  
  const {
    username,
    access_token,
    hide,
    hide_title,
    hide_border,
    card_width,
    title_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    layout,
    langs_count,
    exclude_repo,
    size_weight,
    count_weight,
    custom_title,
    locale,
    border_radius,
    border_color,
    disable_animations,
    hide_progress,
  } = req.query;
  res.setHeader("Content-Type", "image/svg+xml");

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(renderError("Something went wrong", "Locale not found"));
  }

  if (
    layout !== undefined &&
    (typeof layout !== "string" ||
      !["compact", "normal", "donut", "donut-vertical", "pie"].includes(layout))
  ) {
    return res.send(
      renderError("Something went wrong", "Incorrect layout input")
    );
  }

  try {
    // const topLangs = await fetchTopLanguages(
    //   username,
    //   parseArray(exclude_repo),
    //   size_weight,
    //   count_weight,
    // );

    let allRepository = await getRepository({ username, access_token });
    let languageCountMap = {};
    let languageTotalCount = 0;

    if (Array.isArray(allRepository)) {
      languageTotalCount = allRepository.length;
      allRepository.forEach((value) => {
        //排除 fork 的仓库
        if (value["fork"]) {
        } else {
          let main_repository_language = value["main_repository_language"];
          if (
            main_repository_language &&
            Array.isArray(main_repository_language) &&
            main_repository_language.length > 1
          ) {
            let language = main_repository_language[0];
            let color = main_repository_language[1];
            if (languageCountMap[language]) {
              languageCountMap[language]["count"]++;
            } else {
              languageCountMap[language] = {};
              languageCountMap[language]["count"] = 1;
            languageCountMap[language]["name"] = language;
            languageCountMap[language]["size"] = 0;
            }
            languageCountMap[language]["color"] = color;
            console.log(`仓库 ${value['full_name']} main_repository_language为空`)
          } else {
            let language = value["language"];
            if (language) {
              if (languageCountMap[language]) {
                languageCountMap[language]["count"]++;
              } else {
                languageCountMap[language] = {};
                languageCountMap[language]["count"] = 1;
                 languageCountMap[language]["size"] = 0;
                languageCountMap[language]["name"] = language;
              }
            }else{
                console.log(`仓库 ${value['full_name']} language为空`)
            }
          }
        }
      });
    }

    // 1. 将对象转换为数组 [key, value] 形式
    const langEntries = Object.entries(languageCountMap);
    langEntries.forEach((value) => {
      value[1]['size'] = value[1]['count'] / languageTotalCount * 100
        // value['size'] = 100/3

    });

    // 2. 按 size 降序排序
    const sortedLangs = langEntries.sort((a, b) => b[1].count - a[1].count);

    // 3. 转换回对象（可选）
    const topLangs = Object.fromEntries(sortedLangs);
    console.log(topLangs);
    // const topLangs = {
    //   ArkTS: {
    //     name: "arkts",
    //     color: "#ff6134",
    //     size: 20,
    //   },
    //   Java: {
    //     name: "java",
    //     color: "#1b91e0",
    //     size: 30,
    //   },
    //   Dart: {
    //     name: "dart",
    //     color: "#39d167",
    //     size: 50,
    //   },
    // };

    let cacheSeconds = parseInt(
      cache_seconds || CONSTANTS.TOP_LANGS_CACHE_SECONDS,
      10
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      "Cache-Control",
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}`
    );

    return res.send(
      renderTopLanguages(topLangs, {
        custom_title,
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        card_width: parseInt(card_width, 10),
        hide: parseArray(hide),
        title_color,
        text_color,
        bg_color,
        theme,
        layout,
        langs_count,
        border_radius,
        border_color,
        locale: locale ? locale.toLowerCase() : null,
        disable_animations: parseBoolean(disable_animations),
        hide_progress: parseBoolean(hide_progress),
      })
    );
  } catch (err) {
    console.log("获取 language 出错");
    console.log(err.message);
    console.log(err.secondaryMessage);
    res.setHeader(
      "Cache-Control",
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    ); // Use lower cache period for errors.
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
}

