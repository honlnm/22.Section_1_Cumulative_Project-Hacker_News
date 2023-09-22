"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  static getHostName(url) {
    const firstColonInd = url.indexOf(":");
    const removeBeginning = url.slice(+firstColonInd + 3);
    const lastSlashInd = removeBeginning.indexOf("/");
    function hostName() {
      if (lastSlashInd === -1) {
        return removeBeginning;
      } else {
        return removeBeginning.slice(0, lastSlashInd);
      };
    };
    return hostName();
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    try {
      const response = await axios({
        url: `${BASE_URL}/stories`,
        method: "GET",
      });
      const stories = response.data.stories.map(story => new Story(story));
      return new StoryList(stories);
    } catch (err) {
      console.error("getStories failed", err);
      return null;
    }
  }

  static getFavStories() {
    return JSON.parse(localStorage.getItem("favorites") || []);
  }

  async addStory(user, newStory) {
    try {
      const storyPost = await axios({
        url: `${BASE_URL}/stories`,
        method: "POST",
        data: { token: user.loginToken, story: newStory }
      });
      const storyData = storyPost.data.story;
      return new Story(storyData.storyId, storyData.title, storyData.author, storyData.url, storyData.username, storyData.createdAt);
    } catch (err) {
      console.error("addStory failed", err);
      return null;
    }
  }
}

class User {

  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));
    this.loginToken = token;
  }

  static async signup(username, password, name) {
    try {
      const response = await axios({
        url: `${BASE_URL}/signup`,
        method: "POST",
        data: { user: { username, password, name } },
      });
      let { user } = response.data
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        response.data.token
      );
    } catch (err) {
      console.error("signup failed", err);
      return null;
    }
  }

  static async login(username, password) {
    try {
      const response = await axios({
        url: `${BASE_URL}/login`,
        method: "POST",
        data: { user: { username, password } },
      });
      let { user } = response.data;
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        response.data.token
      );
    } catch (err) {
      console.error("login failed", err);
      return null;
    }
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });
      let { user } = response.data;
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  static async getUserFavorites() {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${currentUser.username}`,
        method: "GET",
        params: { token: currentUser.loginToken }
      });
      return response.data.user.favorites;
    } catch (err) {
      console.error("getUserFavorites failed", err);
      return null;
    }
  }

  static async getUserOwnStories() {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${currentUser.username}`,
        method: "GET",
        params: { token: currentUser.loginToken }
      });
      return response.data.user.stories;
    } catch (err) {
      console.error("getUserOwnStories failed", err);
      return null;
    }
  }

  static deleteOwnStory() {
    try {
      $('.delete-Own-Story-Button').on('click', async function () {
        const storyId = $(this).parent().attr('id');
        await axios({
          url: `${BASE_URL}/stories/${storyId}`,
          method: "DELETE",
          params: { token: currentUser.loginToken }
        })
        $(this).parent().remove();
        return alert("Story Deleted");
      });
    } catch (err) {
      console.error("deleteOwnStory failed", err);
      return null;
    }
  }

  static enableFavoriteTracking() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', async function () {
        const storyId = ($(this).parent().parent().attr('id'));
        const parentLi = ($(this).parent().parent());
        if (checkbox.checked) {
          try {
            const response = await axios({
              url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
              method: "POST",
              data: { token: currentUser.loginToken }
            });
            localStorage.setItem("favorites", JSON.stringify(response.data.user.favorites, ['author', 'createdAt', 'storyId', 'title', 'updatedAt', 'url', 'username']));
          } catch (err) {
            console.error("enableFavoriteTracking failed", err);
            return null;
          }
        } else {
          try {
            const response = await axios({
              url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
              method: "DELETE",
              data: { token: currentUser.loginToken }
            });
            localStorage.setItem("favorites", JSON.stringify(response.data.user.favorites, ['author', 'createdAt', 'storyId', 'title', 'updatedAt', 'url', 'username']));
            parentLi.remove();
          } catch (err) {
            console.error("enableFavoriteTracking failed", err);
            return null;
          }
        };
      });
      checkOffFavs()
    });
    checkOffFavs()
  }
}



