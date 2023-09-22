"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

function handleNavAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs()
}

$body.on("click", "#nav-all", handleNavAllStories);

function handleNavLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", handleNavLoginClick);

function handleNavSubmitClick(evt) {
  $newStoryForm.show();
}

$navNewStoryForm.on("click", handleNavSubmitClick);

function handleNavFavoritesClick(evt) {
  putFavStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs();
};

$navFavorites.on("click", handleNavFavoritesClick);

function handleNavMyStories(evt) {
  putMyStoriesOnPage();
  User.enableFavoriteTracking();
  checkOffFavs();
}

$navMyStories.on("click", handleNavMyStories);

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navNewStoryForm.show();
  $navFavorites.show();
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
