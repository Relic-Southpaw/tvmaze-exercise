"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $searchbar = $("#search-query");
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`)
  let shows = res.data;
  populateShows(shows)
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let x of shows) {
    let show = x.show;
    let img = "https://i.stack.imgur.com/6M513.png"
    console.log(show)
    try {
      (show.image.medium)
      console.log('good')
      img = show.image.medium;
    } catch {
      console.log('Image is not available')
    }
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
           src="${img}"
           alt="${show.name}" 
           class="w-25 mr-3">
           <div class="media-body">
           <h5 class="text-primary">${show.name}</h5>
           <div><small>${show.summary}</small></div>
           <button class="btnShow-getEpisodes">
           Episodes
           </button>
           </div>
           </div>  
           </div>
           `);
    $showsList.append($show);
  }
  getEpisodes();
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $searchbar.val()
  $episodesArea.hide();
  getShowsByTerm(term);
}

$searchForm.on("submit", function (evt) {
  evt.preventDefault();
  searchForShowAndDisplay();
});

function getEpisodes() {
  $('.media-body button').on("click", function (e) {
    e.preventDefault()
    let id = $(this).parent().parent().parent()[0].dataset.showId;
    getEpisodesOfShow(id)
  })
}
//Shows episode area and list of episodes
//clicking another 'Episodes' button will clear previous list and make new one
async function getEpisodesOfShow(id) {
  let eplist = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  $episodesArea.show();
  $episodesArea.empty();
  let eps = eplist.data;
  for (let ep of eps) {
    const $episodes = $(`
    <li id =${ep.id}><b>${ep.name}</b> <ul> <li>Episode: ${ep.number} Season: ${ep.season}</li></ul></li>
    `);
    $episodesArea.append($episodes);
  }
}