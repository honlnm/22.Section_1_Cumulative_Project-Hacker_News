"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs()
}

$body.on("click", "#nav-all", navAllStories);

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $newStoryForm.show();
}

$navNewStoryForm.on("click", navSubmitClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  putFavStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs();
};

$navFavorites.on("click", navFavoritesClick);

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  putMyStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs();
}

$navMyStories.on("click", navMyStories);

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navNewStoryForm.show();
  $navFavorites.show();
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
