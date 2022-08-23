const API_KEY = "840523a722e0ffc0a860538562e81c5e";
const URL = "https://images.tmdb.org/t/p/original";

// function ajax qui va request TMDB sur la bonne url !
function getMovies(){
    $.ajax(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
        // si l'appel AJAX est réussi(done()) on invoque notre fonction logique d'injection dans le HTML
        .done(res=> injectMovies(res.results))
        // si erreur (fail()) on envoi un message dans la console
        .fail(err => {
            throw new Error ('Bug dans la matrice ---> ', err);
        })
}
    
// function d'injection
function injectMovies(movies){
    // on log notre argument transmis du done() afin de savoir quel est la structure des données reçues 
    // console.log('injectMovies ---> ',movies);

    // choisir l'expression qui convient pour injecter dans le DOM
    for(const movie of movies){

        let newDate = new Date(movie.release_date);

        $("#movie-ctn").append(
            $("<article>").addClass("card")
                .append($("<h2>").text(movie.title))
                .append($("<img>").attr("src", `${URL}${movie.poster_path}`).attr("alt", ""))
                .append($("<p>").text(`Note : ${movie.vote_average.toFixed(2)}`))
                .append($("<p>").text(`Nombre de votants : ${movie.vote_count}`))
                .append($("<p>").text(`${newDate.toLocaleDateString()}`))
                .append($("<p>").text(`${movie.overview}`))  
        );
        // $("#movie-ctn").append(`
        //         <article class='card'>
        //             <h2>${movie.title}</h2>
        //             <img src='${URL}${movie.poster_path}' alt=''>
        //             <p>Note : ${movie.vote_average.toFixed(2)}</p>
        //             <p>Nombre de votants : ${movie.vote_count}</p>
        //             <p>${newDate.toLocaleDateString()}</p>
        //             <p>${movie.overview}</p>
        // `)

    }
}

// 

function findMovie(movie){
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}`)
        .done(res=> injectMoviesList(res.results))
        .fail(err=> {throw new Error("Bug dans la matrice !!!", err)});
}

function injectMoviesList(movies){
    // on supprime les éléments enfants de la balise <ul>
    $("#list-movies").empty();
    // on boucle sur l'argument transmis par l'invocation de cette fonction suite à la réponse favorable de notre requete ajax
    for(const movie of movies){
        // pour chaque élément dans notre argument on va les ajouter à notre ul
        $("#list-movies").append(
            $("<li>").data("id", movie.id).html(`<i class="fa-solid fa-video"></i>${movie.title}`)
        );
    }
}

function findMovieById(){
    $("#ctn-movie").css("display", "flex");
    $("#detail-movie").fadeIn("slow");
    const movieID = $(this).data("id");
    $.ajax(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`)
        .done(res => injectMovieDetail(res))
}

function injectMovieDetail(movie){
    const star = computeVote(movie.vote_average);
    $("#detail-movie").empty();
    let newDate = new Date(movie.release_date);
    $("#detail-movie").append(
        $("<article>").css({"display": "flex", "flex-wrap": "wrap", "justify-content": "space-around"})
            .append($("<h2>").css("width", "100%").text(movie.title))
            .append($("<img>").attr("src", `${URL}${movie.poster_path}`).attr("alt", ""))
            .append($("<aside>").css("width", "50%")
                // .append($("<p>").text(`Note : ${movie.vote_average.toFixed(2)}`))
                .append($("<p>").html(`Note : ${star}`))
                .append($("<p>").text(`Nombre de votants : ${movie.vote_count}`))
                .append($("<p>").text(`${newDate.toLocaleDateString()}`))
                .append($("<p>").text(`${movie.overview}`))
                .append($("<ul>").addClass("company-list"))  
            )                 
    );
    if(movie.production_companies.length > 0){
        for (const company of movie.production_companies) {            
            findCompany(company.id);
        }
    } else {
        $("#detail-movie article ul").append($("<li>").text("No companies"));
    }
}

function findCompany(id){
    $.ajax(`https://api.themoviedb.org/3/company/${id}?api_key=${API_KEY}`)
        .done(res => displayCompany(res))
	    .fail(err => console.log('NO MORE COMPANIES', err))
}

function displayCompany(company){
    $("#detail-movie article ul").append(
        `<li><a href=${company.homepage} target="_blank"><i class="fa-solid fa-clapperboard"></i>${company.name}</a></li>`
    )
        
}

function getSearchInput(e){
    // récupération de la valeur de l'input
    // const searchInput = e.target.value;
    // OU
    const searchInput = $("#search").val();
    // on vérifie si il y a au moins charactère 
    if(searchInput) {
        // si oui, on affiche la liste, et on invoque la fonction ajax
        $("#list-movies").fadeIn("slow");
        findMovie(searchInput);       
    } else {
        // il n'y a rien afficher donc on cache les containers
        $("#list-movies, #detail-movie").fadeOut("slow");
    }
}

// 

function computeVote(vote){
    const star = parseInt(vote) / 2;
    switch (star) {
        case 0:
            return '<i class="fa-regular fa-star></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 0.5:
            return '<i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 1:
            return '<i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 1.5:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 2:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 2.5:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 3:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 3.5:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i>';    
        case 4:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i>';    
        case 4.5:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star-half-stroke"></i>';    
        case 5:
            return '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>';    
    }
}