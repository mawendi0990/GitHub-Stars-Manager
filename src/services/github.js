// src/services/github.js
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_TOKEN // 替换为你的token
});

export const getStarredRepos = async () => {
  try {
    let allRepos = [];
    let page = 1;
    
    while (true) {
      try {
        const response = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
          per_page: 100,
          page: page,
          sort: 'updated'
        });

        console.log('API Response:', response); // 添加响应日志
        
        if (response.data.length === 0) break;
        
        const processedRepos = response.data.map(repo => {
          console.log('Processing repo:', repo); // 添加单个仓库数据日志
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            lastUpdated: repo.pushed_at, // 直接使用 pushed_at
            url: repo.html_url,
            owner: repo.owner.login
          };
        });
        
        allRepos = [...allRepos, ...processedRepos];
        
        if (response.data.length < 100) break;
        page++;
      } catch (err) {
        console.error('API call error:', err); // 添加API调用错误日志
        throw err;
      }
    }

    return allRepos;
  } catch (error) {
    console.error('Overall error:', error);
    throw error;
  }
};