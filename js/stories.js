"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

function generateStoryMarkup(story) {
  const hostName = Story.getHostName(story.url);
  if (!localStorage.getItem("token")) {
    return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <br>
      <small class="story-author">by ${story.author}</small>
      <br>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
  } else {
    return $(`
    <li id="${story.storyId}">
    <label>
      <input type="checkbox">
    </label>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <br>
      <small class="story-author" style="text-indent:25px;">by ${story.author}</small>
      <br>
      <small class="story-user" style="text-indent:25px;">posted by ${story.username}</small>
    </li>
  `);
  }
}

function putStoriesOnPage() {
  $allStoriesList.empty();
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  checkOffFavs();
}

function enableFavoriteTracking() {
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

async function putFavStoriesOnPage() {
  $allStoriesList.empty();
  const favoriteStories = await User.getUserFavorites();
  for (let favStory of favoriteStories) {
    const $story = generateStoryMarkup(favStory);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  enableFavoriteTracking();
}

function deleteOwnStory() {
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

async function putMyStoriesOnPage() {
  $allStoriesList.empty();
  const myStories = await User.getUserOwnStories();
  for (let myStory of myStories) {
    const $story = generateStoryMarkup(myStory);
    $allStoriesList.append($story);
  }
  $('<button>').appendTo('li').text('Delete Story').attr('class', 'delete-Own-Story-Button');
  $allStoriesList.show();
  deleteOwnStory();
  enableFavoriteTracking();
}

function checkOffFavs() {
  const favorites = currentUser.favorites;
  for (let i = 0; i < favorites.length; i++) {
    const storyId = `${favorites[i].storyId}`;
    if ($('ol').find('li#' + storyId)) {
      try {
        const checkbox = document.getElementById(storyId).querySelector('input');
        checkbox.setAttribute('checked', true);
      } catch (err) { console.error("checkOffFavs failed", err) }
    }
  };
};

async function handlePutGeneratedStoryOnPage() {
  const storyTitle = $('#title-input').val();
  const storyAuthor = $('#author-input').val();
  const storyURL = $('#url-input').val();
  await storyList.addStory(currentUser,
    { title: storyTitle, author: storyAuthor, url: storyURL });
  $('#title-input').val("");
  $('#author-input').val("");
  $('#url-input').val("");
  getAndShowStoriesOnStart();
};

$('.story-submit-button').on('click', handlePutGeneratedStoryOnPage);


