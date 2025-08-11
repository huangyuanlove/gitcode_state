import axios from "axios";
const per_page = 20;

const getRepository = async ({ userName, access_token }) => {
  console.log(`getRepository  ${userName}   ${access_token}`);
  let page = 1;
  let hasMore = true;
  let allRepository = [];
  while (hasMore) {
    console.log(`正在请求${page}页`);
    let repositoryResult = await loadRepository({ page, access_token });
    page++;
    if (Array.isArray(repositoryResult)) {
      let resultLength = repositoryResult.length;
      console.log(`获取到${resultLength}个仓库`);
      hasMore = resultLength >= per_page;

      allRepository.push(...repositoryResult);
    } else {
      console.log(`返回值不是数组`);
    }

    if (hasMore) {
      console.log("还有更多");
    } else {
      console.log("最后一页");
    }
  }
  return allRepository;
};

const loadRepository = async ({ page, access_token }) => {
  console.log(`正在获取第${page}页仓库`);
  let requestUrl = "https://api.gitcode.com/api/v5/user/repos";
  let params = {
    access_token: access_token,
    page: page,
    per_page: per_page,
    type: "owner",
  };
  let result = await axios.get(requestUrl, { params });
  return result.data;
};

export default getRepository;
