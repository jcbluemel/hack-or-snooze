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


/** Toggle DOM element between favorited and unfavorited story */

function toggleFavBtnElement(evt) {
  $(evt.target).toggleClass("fas far");
}

$allStoriesList.on("click", ".fav-btn", toggleFavBtnElement);