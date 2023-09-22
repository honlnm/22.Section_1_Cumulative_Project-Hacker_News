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

async function putFavStoriesOnPage() {
  $allStoriesList.empty();
  const favoriteStories = await User.getUserFavorites();
  for (let favStory of favoriteStories) {
    const $story = generateStoryMarkup(favStory);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  User.enableFavoriteTracking();
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
  User.deleteOwnStory();
  User.enableFavoriteTracking();
}

$('.delete-Own-Story-Button').on('click', function () {
  const id = $(this).parent().attr(id);
});

function checkOffFavs() {
  const favorites = currentUser.favorites;
  for (let i = 0; i < favorites.length; i++) {
    const storyId = `${favorites[i].storyId}`;
    if ($('ol').find('li#' + storyId)) {
      try {
        const checkbox = document.getElementById(storyId).children[0].children[0];
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


