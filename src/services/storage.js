// src/services/storage.js
const TAGS_KEY = 'github_stars_tags';

export const saveTags = (repoId, tags) => {
  const savedTags = JSON.parse(localStorage.getItem(TAGS_KEY) || '{}');
  savedTags[repoId] = tags;
  localStorage.setItem(TAGS_KEY, JSON.stringify(savedTags));
};

export const loadTags = () => {
  return JSON.parse(localStorage.getItem(TAGS_KEY) || '{}');
};