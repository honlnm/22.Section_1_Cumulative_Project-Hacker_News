"use strict";

let currentUser;
let checkedLIs = [];

/******************************************************************************
 * User login/signup/login
 */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();
  const username = $("#login-username").val();
  const password = $("#login-password").val();
  currentUser = await User.login(username, password);
  $loginForm.trigger("reset");
  saveUserCredentialsInLocalStorage();
  putStoriesOnPage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();
  currentUser = await User.signup(username, password, name);
  saveUserCredentialsInLocalStorage();
  putStoriesOnPage();
  updateUIOnUserLogin();
  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;
  currentUser = await User.loginViaStoredCredentials(token, username);
}

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

async function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  $allStoriesList.show();
  updateNavOnLogin();
  User.enableFavoriteTracking();
  $loginForm.hide();
  $signupForm.hide();
}
