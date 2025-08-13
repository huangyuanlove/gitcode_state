import { renderRepoCard } from "./cards/repo-card.js";
import {
  clampValue,
  CONSTANTS,
  parseBoolean,
  renderError,
} from "./cards/common/utils.js";

import { isLocaleAvailable } from "./translations.js";
import getRepository from "./cards/fetchers/repository_fetcher.js";


export default async (req, res) => {
let { access_token } = req.query;

  if (access_token) {
    console.log("state 请求链接中有token " + access_token);
  } else {
    //默认取环境变量中的 token
    let env_gitcode_token = process.env.gitcode_token;
    if (env_gitcode_token) {
      access_token = env_gitcode_token;
      console.log("state 取环境变量中的 token " + access_token);
    }
  }
  let { username } = req.query;
  if (username) {
    console.log("state 请求链接中有username " + username);
  } else {
    //默认取环境变量中的 token
    let env_username = process.env.username;
    if (env_username) {
      username = env_username;
      console.log("state 取环境变量中的 username " + username);
    }
  }
  const {
    repo,
    hide_border,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    show_owner,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    description_lines_count,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(
      renderError("Something went wrong", "Language not found", {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      })
    );
  }

  try {
    // const repoData = await fetchRepo(username, repo);

    /**
 *   name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  stargazers: { totalCount: number };
  description: string;
  primaryLanguage: {
    color: string;
    id: string;
    name: string;
  };
  forkCount: number;
  starCount: number;
};
 */

    let repoData = {
      name: repo,
      stargazers: {
        totalCount: 0,
      },
      description: "",
      primaryLanguage: {
        id: "",
        color: "",
        name: "",
      },
      forkCount: 0,
      starCount: 0,
    };

    let allRepository = await getRepository({ username, access_token });
    if (Array.isArray(allRepository)) {
      for (let i = 0; i < allRepository.length; i++) {
        let value = allRepository[i];
        if (value["fork"]) {
          continue;
        } else {
          if (value["full_name"] == repo) {
            repoData.stargazers.totalCount = value["stargazers_count"];
            repoData.description = value["description"];

            let main_repository_language = value["main_repository_language"];
            if (
              main_repository_language &&
              Array.isArray(main_repository_language) &&
              main_repository_language.length > 1
            ) {
              repoData.primaryLanguage.name = main_repository_language[0];
              repoData.primaryLanguage.color = main_repository_language[1];
            } else {
              let language = value["language"];
              if (language) {
                repoData.primaryLanguage.name = language;
              }
            }

            repoData.forkCount = value["forks_count"];
            repoData.starCount = value["stargazers_count"];
            break;
          }
        }
      }
    }

    let cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.PIN_CARD_CACHE_SECONDS, 10),
      CONSTANTS.ONE_DAY,
      CONSTANTS.TEN_DAY
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      "Cache-Control",
      `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
    );

    try {
      let result = renderRepoCard(repoData, {
        hide_border: parseBoolean(hide_border),
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        border_radius,
        border_color,
        show_owner: parseBoolean(show_owner),
        locale: locale ? locale.toLowerCase() : null,
        description_lines_count,
      });
      return res.send(result);
    } catch (error) {
      console.log("render pin error");
      console.log(err.message);
      console.log(err.secondaryMessage);
    }
  } catch (err) {
    console.log("get pin error");
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