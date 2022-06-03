"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // TODO: add check if in currentUser.favorites
  //  if so, colored star and mark as 'favorited' in li
  //  else uncolored star only
  //  save these in variable and pass it in instead of line 32
  return $(`
      <li id="${story.storyId}">
        <span class="fav-btn"><i class="fa-star far"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** Post a new story from form submission and update page with new story list */

async function addNewStoryToPage(evt) {
  console.debug("addNewStoryToPage", evt);
  evt.preventDefault();

  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  $addStoryForm.trigger("reset");

  const newStory = await storyList.addStory(currentUser, {
    author,
    title,
    url
  });

  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $addStoryForm.hide();
}

$addStoryForm.on("submit", addNewStoryToPage);

/** TODO */
function addOrDeleteFromFavs (evt) {
  toggleFavBtnElement(evt);
  putFavsOnPage();
}

$(".stories-container").on("click", ".fav-btn", addOrDeleteFromFavs);

/** Toggle DOM element between favorited and unfavorited story */

function toggleFavBtnElement(evt) {
  $(evt.target).toggleClass("fas far");

}

/** TODO */
function putFavsOnPage() {
  $favoritedStoriesList.empty();

  const favoritesList = currentUser.favorites;

  console.log("list before markup: ", $favoritedStoriesList);
  for (let favorite of favoritesList) {
    const $newFav = generateStoryMarkup(favorite);
    console.log("new fav: ", $newFav);
    $favoritedStoriesList.prepend($newFav);
    console.log("fav list after markup: ", $favoritedStoriesList);
  }

  $favoritedStoriesList.show();


  //go through list of stories and generate a mark up
  //append to the favorite stories list
}

//click the favorite star button
//check if the li's id is included:
//    check in favorites array, do any stories.storyId
//    currentUser.favorites.includes(story => story.storyId === li ID) return bool
//          if included, deleteFavorite({story})
//          if not, add to favorites
//


//currentUser.favorites.find(story => story.storyId === li ID) return index or undefined
//if index found, delete favorites[index]
// ---
//else User.add


// storyList.stories is array of Story objs
// currentUser.favorites is array of Story objs
// when making li, check if id is in favorites array
//    if so, set to 'favorited' somehow and color in star
// when clicked on fav button, check for the 'favorited' class on li
//    if 'favorited', find index of story based on id in favorites array, and deleteFavorite.
//      also delete that item if on the favorites page
//    if not, find index of story based on storyList based on id in storyList.stories,
//      and addFavorite

