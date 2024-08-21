const apiKey = '44f87301db7c7058bdddf60e649353a1';
document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    fetchTopRatedMovies();
});

function fetchTrendingMovies() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=es`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const trendingMoviesContainer = document.getElementById('trending-movies');
            trendingMoviesContainer.innerHTML = '';
            movies.forEach(movie => {
                const movieElement = createMovieElement(movie);
                trendingMoviesContainer.appendChild(movieElement);
            });
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

function fetchTopRatedMovies() {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const topRatedMoviesContainer = document.getElementById('top-rated-movies');
            topRatedMoviesContainer.innerHTML = '';
            movies.forEach(movie => {
                const movieElement = createMovieElement(movie);
                topRatedMoviesContainer.appendChild(movieElement);
            });
        })
        .catch(error => console.error('Error fetching top-rated movies:', error));
}

function createMovieElement(movie) {
    const movieContainer = document.createElement('div');
    movieContainer.className = 'col-lg-3 col-md-4 col-sm-6 movie-container';
    
    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;
    movieImage.className = 'img-fluid movie';

    const movieTitle = document.createElement('div');
    movieTitle.className = 'nombre-peli';
    movieTitle.innerText = movie.title;

    movieContainer.appendChild(movieImage);
    movieContainer.appendChild(movieTitle);
    
    return movieContainer;
}