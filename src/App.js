import React, { useState, useEffect } from 'react';
import { Search, Tag, Star, Calendar, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStarredRepos } from './services/github';
import { saveTags, loadTags } from './services/storage';

const ITEMS_PER_PAGE = 100;

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  if (secondsAgo < 60) return 'just now';
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo} days ago`;
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) return `${monthsAgo} months ago`;
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} years ago`;
};

const App = () => {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTags, setActiveTags] = useState(new Set());
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoData = await getStarredRepos();
        const savedTags = loadTags();
        
        const reposWithTags = repoData.map(repo => ({
          ...repo,
          tags: savedTags[repo.id] || []
        }));

        setRepos(reposWithTags);
        setFilteredRepos(reposWithTags);
        setTotalStars(reposWithTags.length);
      } catch (err) {
        setError('加载失败，请检查GitHub Token是否正确设置');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addTag = (repoId, newTag) => {
    const updatedRepos = repos.map(repo => {
      if (repo.id === repoId) {
        const updatedTags = [...new Set([...repo.tags, newTag])];
        saveTags(repoId, updatedTags);
        return { ...repo, tags: updatedTags };
      }
      return repo;
    });
    setRepos(updatedRepos);
    filterRepos(searchTerm, activeTags, updatedRepos);
  };

  const removeTag = (repoId, tagToRemove) => {
    const updatedRepos = repos.map(repo => {
      if (repo.id === repoId) {
        const updatedTags = repo.tags.filter(tag => tag !== tagToRemove);
        saveTags(repoId, updatedTags);
        return { ...repo, tags: updatedTags };
      }
      return repo;
    });
    setRepos(updatedRepos);
    filterRepos(searchTerm, activeTags, updatedRepos);
  };

  const toggleTagFilter = (tag) => {
    const newActiveTags = new Set(activeTags);
    if (newActiveTags.has(tag)) {
      newActiveTags.delete(tag);
    } else {
      newActiveTags.add(tag);
    }
    setActiveTags(newActiveTags);
    filterRepos(searchTerm, newActiveTags, repos);
    setCurrentPage(1);
  };

  const filterRepos = (term, tags, reposToFilter) => {
    let filtered = reposToFilter;
    
    if (term) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(term.toLowerCase()) ||
        (repo.description || '').toLowerCase().includes(term.toLowerCase()) ||
        repo.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    if (tags.size > 0) {
      filtered = filtered.filter(repo =>
        Array.from(tags).every(tag => repo.tags.includes(tag))
      );
    }
    
    setFilteredRepos(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterRepos(term, activeTags, repos);
    setCurrentPage(1);
  };

  const getAllTags = () => {
    const tagsSet = new Set();
    repos.forEach(repo => {
      repo.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepos = filteredRepos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-pulse font-medium text-gray-600">加载中...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-red-500 bg-red-50 px-6 py-3 rounded-lg shadow-sm border border-red-100">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Star className="mr-2 text-yellow-500" size={24} />
              GitHub Stars
            </h1>
            <div className="text-sm text-gray-500">
              共 {totalStars} 个项目，当前显示 {filteredRepos.length} 个
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索项目名称、描述或标签..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm 
                           border border-gray-200 focus:border-blue-500 focus:ring-2 
                           focus:ring-blue-100 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              {getAllTags().map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors
                            ${activeTags.has(tag) 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Tag size={12} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {paginatedRepos.map(repo => (
            <div key={repo.id} 
                 className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md border border-gray-100 
                          transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <a href={repo.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="font-medium text-gray-900 hover:text-blue-600 
                            transition-colors flex items-center group">
                  {repo.name}
                  <ExternalLink size={16} className="ml-2 text-gray-400 
                               group-hover:text-blue-600" />
                </a>
                <div className="text-sm text-gray-500 flex items-center"
                     title={new Date(repo.lastUpdated).toLocaleString()}>
                  <Calendar size={14} className="mr-1.5" />
                  {formatTimeAgo(repo.lastUpdated)}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                {repo.owner}
              </div>
              
              {repo.description && (
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  {repo.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 items-center">
                {repo.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => removeTag(repo.id, tag)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md 
                             text-sm flex items-center gap-1.5 hover:bg-gray-200 
                             transition-colors group"
                  >
                    <Tag size={12} className="text-gray-500" />
                    {tag}
                    <span className="opacity-0 group-hover:opacity-100 
                                 transition-opacity text-gray-500">×</span>
                  </button>
                ))}
                
                <input
                  type="text"
                  placeholder="添加标签..."
                  className="px-3 py-1.5 bg-gray-50 text-sm rounded-md border 
                           border-gray-200 outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-100 transition-all 
                           placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addTag(repo.id, e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;