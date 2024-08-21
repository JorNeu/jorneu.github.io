const apiKey = '44f87301db7c7058bdddf60e649353a1';
document.addEventListener('DOMContentLoaded', () => {
    fetchPelisDelMomento();
    fetchMejoresPelis();
});

function fetchPelisDelMomento() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=es`)
        .then(response => response.json())
        .then(data => {
            const pelis = data.results;
            const PelisDelMomentoContainer = document.getElementById('trending-pelis');
            PelisDelMomentoContainer.innerHTML = '';
            pelis.forEach(pelis => {
                const PeliElement = crearPeli(pelis);
                PelisDelMomentoContainer.appendChild(PeliElement);
            });
        })
        .catch(error => console.error('Error fetching trending pelis:', error));
}

function fetchMejoresPelis() {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es`)
        .then(response => response.json())
        .then(data => {
            const pelis = data.results;
            const MejoresPelisContainer = document.getElementById('top-rated-pelis');
            MejoresPelisContainer.innerHTML = '';
            pelis.forEach(pelis => {
                const PeliElement = crearPeli(pelis);
                MejoresPelisContainer.appendChild(PeliElement);
            });
        })
        .catch(error => console.error('Error fetching top-rated pelis:', error));
}

function crearPeli(pelis) {
    const pelisContainer = document.createElement('div');
    pelisContainer.className = 'col-lg-3 col-md-4 col-sm-6 pelis-container';
    
    const pelinsImagen = document.createElement('img');
    pelinsImagen.src = `https://image.tmdb.org/t/p/w500${pelis.poster_path}`;
    pelinsImagen.alt = pelis.title;
    pelinsImagen.className = 'img-fluid pelis';

    const pelisTitulo = document.createElement('div');
    pelisTitulo.className = 'nombre-peli';
    pelisTitulo.innerText = pelis.title;

    pelisContainer.appendChild(pelinsImagen);
    pelisContainer.appendChild(pelisTitulo);
    
    return pelisContainer;
}