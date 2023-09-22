"use strict";

const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $newStoryForm = $("#new-story-form");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $navNewStoryForm = $('#nav-new-story');
const $navFavorites = $('#favorite-stories');
const $navMyStories = $('#my-stories');
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $newStoryForm
  ];
  components.forEach(c => c.hide());
}

async function start() {
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();
  if (currentUser) updateUIOnUserLogin();
}

$(start);
