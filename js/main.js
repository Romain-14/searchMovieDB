// invoque notre fonction AJAX principale
getMovies();

$(()=>{
    $("#search").on("input", getSearchInput);

    $("#list-movies").on("click", "li", findMovieById);
})