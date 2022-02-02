const apiKey = "5cae68135dd3df406b8ea3505e43dd9d";
const baseUrl = "https://api.themoviedb.org/3/movie";

const TABS = {
    POPULAR: "popular",
    NOWPLAYING: "now_playing",
    TOPRATED: "top_rated",
    UPCOMING: "upcoming",
};

const state = {
    movieList: [],
    likedMovieList: [],
    activeTab: TABS.POPULAR,
    genres: {},
    currPage: 1,
    totalPages: 500,
};

const getMovieCardArea = () => document.querySelector(".movie-card-container");

const createMovieCard = (data) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    const movieImg = document.createElement("img");
    movieImg.className = "movie-img";
    const poster_path = data.poster_path;
    movieImg.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
    const title = document.createElement("h2");
    title.className = "movie-title";
    title.innerHTML = data.title;
    const movieFooter = document.createElement("div");
    movieFooter.className = "movie-footer";
    const movieRatingArea = document.createElement("div");
    movieRatingArea.className = "movie-rating-area";
    const starIcon = document.createElement("div");
    starIcon.className = "ion-star";
    const movieRating = document.createElement("div");
    movieRating.innerHTML = data.vote_average;
    movieRatingArea.appendChild(starIcon);
    movieRatingArea.appendChild(movieRating);
    const movieHeartIcon = document.createElement("div");
    movieHeartIcon.classList.add("movie-heart-icon");
    const same = state.likedMovieList.filter((movie) => {
        return movie.id == data.id;
    });
    if (same.length !== 0) {
        movieHeartIcon.classList.add("ion-ios-heart");
    } else {
        movieHeartIcon.classList.add("ion-ios-heart-outline");
    }
    movieFooter.appendChild(movieRatingArea);
    movieFooter.appendChild(movieHeartIcon);
    movieCard.appendChild(movieImg);
    movieCard.appendChild(title);
    movieCard.appendChild(movieFooter);
    return movieCard;
};

const dimBackground = () => {
    const html = document.querySelector("html");
    html.style.backgroundColor = "grey";
    const lis = document.querySelectorAll("li");
    lis.forEach((li) => {
        li.style.backgroundColor = "grey";
    });
    const imgs = document.querySelectorAll(".movie-img");
    imgs.forEach((img) => {
        img.style.filter = "brightness(50%)";
    });
    const select = document.querySelector("select");
    select.style.backgroundColor = "grey";
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
        btn.style.backgroundColor = "grey";
    });
};

const loadMovieData = (e) => {
    const movieTitle = e.target.innerHTML;
    const movieDataList = state.movieList.filter((movie) => {
        return movie.title === movieTitle;
    });

    if (movieDataList.length > 0) {
        return movieDataList[0];
    }

    return null;
};

const loadProvidersLogo = (movieId) => {
    const movieDetailUrl = `${baseUrl}/${movieId}?api_key=${apiKey}`;
    fetch(movieDetailUrl)
        .then((resp) => resp.json())
        .then((data) => {
            const productionLogoArea = document.querySelector(
                ".production-logos-area"
            );
            productionLogoArea.innerHTML = "";
            const productionCompanies = data.production_companies;
            productionCompanies.forEach((company) => {
                const logoPath = company.logo_path;
                if (logoPath !== null) {
                    const logoUrl = `https://image.tmdb.org/t/p/w200${logoPath}`;
                    const logoItem = document.createElement("div");
                    logoItem.className = "production-logo-item";
                    const logoImg = document.createElement("img");
                    logoImg.src = logoUrl;
                    logoImg.alt = "logo-img";
                    logoImg.className = "production-logo-img";
                    logoItem.appendChild(logoImg);
                    productionLogoArea.appendChild(logoItem);
                }
            });
        });
};

const createMovieDetailsCard = (movieData) => {
    const movieImg = document.querySelector(".movie-details-img");
    const poster_path = movieData.poster_path;
    movieImg.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
    const movieTitle = document.querySelector(".movie-details-title");
    movieTitle.innerHTML = movieData.title;
    const movieDescription = document.querySelector(".movie-details-description");
    movieDescription.innerHTML = movieData.overview;
    const genreContainer = document.querySelector(".genres-container");
    genreContainer.innerHTML = "";
    const genreIds = movieData.genre_ids;
    genreIds.forEach((genreId) => {
        const genreItemCollection = Object.values(state.genres).filter(
            (genre) => genre.id === genreId
        );
        if (genreItemCollection.length > 0) {
            const genreName = genreItemCollection[0].name;
            const genreItem = document.createElement("div");
            genreItem.className = "genre-item";
            genreItem.innerHTML = genreName;
            genreContainer.appendChild(genreItem);
        }
    });
    const movieRating = document.querySelector(".movie-details-rating");
    movieRating.innerHTML = movieData.vote_average;
    loadProvidersLogo(movieData.id);
};

const handleMovieTitleController = (e) => {
    dimBackground();
    const movieData = loadMovieData(e);

    createMovieDetailsCard(movieData);

    const movieDetailsContainer = document.querySelector(
        ".movie-details-container"
    );
    movieDetailsContainer.style.display = "block";
};

const handleMovieHeartIconController = (e) => {
    const heartIcon = e.target;
    heartIcon.classList.toggle("ion-ios-heart-outline");
    heartIcon.classList.toggle("ion-ios-heart");
    const currMovieCard = heartIcon.parentNode.parentNode;
    const indexRecord = currMovieCard.indexRecord;
    const movieData = state.movieList[indexRecord];

    if (!heartIcon.classList.contains("ion-ios-heart")) {
        state.likedMovieList = state.likedMovieList.filter((movie) => {
            return movie.id != movieData.id;
        });
    } else {
        state.likedMovieList.push(movieData);
    }
};

const handleMovieCardAreaController = (e) => {
    if (e.target.classList.contains("movie-title")) {
        handleMovieTitleController(e);
    } else if (e.target.classList.contains("movie-heart-icon")) {
        handleMovieHeartIconController(e);
    }
};

const brightenBackgroud = () => {
    const html = document.querySelector("html");
    html.style.backgroundColor = "white";
    const lis = document.querySelectorAll("li");
    lis.forEach((li) => {
        li.style.backgroundColor = "white";
    });
    const imgs = document.querySelectorAll(".movie-img");
    imgs.forEach((img) => {
        img.style.filter = "brightness(100%)";
    });
    const select = document.querySelector("select");
    select.style.backgroundColor = "white";
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
        btn.style.backgroundColor = "white";
    });
    checkButtonDisable();
};

const handleMovieDetailsCloseController = () => {
    brightenBackgroud();
    const movieDetailsContainer = document.querySelector(
        ".movie-details-container"
    );
    movieDetailsContainer.style.display = "none";
};

const handleNavBarController = (e) => {
    if (e.target.classList.contains("home-button")) {
        loadDefaultData();
    } else if (e.target.classList.contains("liked-list-button")) {
        state.movieList = state.likedMovieList;
        state.currPage = 1;
        updateView();
    }
};

const fetchMovieListFromUrl = () => {
    const url = `${baseUrl}/${state.activeTab}?api_key=${apiKey}&language=en-US&page=${state.currPage}`;
    fetch(url)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            state.movieList = data.results;
            updateView();
        });
};

const handleNextButtonController = () => {
    const currPageDisplay = document.querySelector("#curr-page");
    if (state.currPage < 500) {
        state.currPage++;
    } else {
        state.currPage = 1;
    }
    currPageDisplay.innerHTML = state.currPage;
    fetchMovieListFromUrl();
};

const handlePrevButtonController = () => {
    const currPageDisplay = document.querySelector("#curr-page");
    if (state.currPage <= 1) {
        state.currPage = 500;
    } else {
        state.currPage--;
    }
    currPageDisplay.innerHTML = state.currPage;
    fetchMovieListFromUrl();
};

const handleDropDownController = (e) => {
    const dropDownValue = e.target.value;
    switch (dropDownValue) {
        case "popular":
            state.activeTab = TABS.POPULAR;
            break;
        case "now-playing":
            state.activeTab = TABS.NOWPLAYING;
            break;
        case "top-rated":
            state.activeTab = TABS.TOPRATED;
            break;
        case "upcoming":
            state.activeTab = TABS.UPCOMING;
            break;
        default:
            state.activeTab = TABS.POPULAR;
    }
    state.currPage = 1;
    fetchMovieListFromUrl();
};

const checkButtonDisable = () => {
    const prevBtn = document.querySelector("#prev-btn");
    if (state.currPage === 1) {
        prevBtn.disabled = true;
        prevBtn.style.backgroundColor = "Gainsboro";
    } else {
        prevBtn.disabled = false;
        prevBtn.style.backgroundColor = "white";
    }

    const nextBtn = document.querySelector("#next-btn");
    if (state.currPage === state.totalPages) {
        nextBtn.disabled = true;
        nextBtn.style.backgroundColor = "Gainsboro";
    } else {
        nextBtn.disabled = false;
        nextBtn.style.backgroundColor = "white";
    }
};

const updateView = () => {
    const currPageDisplay = document.querySelector("#curr-page");
    currPageDisplay.innerHTML = state.currPage;
    const totalPagesDisplay = document.querySelector("#total-pages");
    totalPagesDisplay.innerHTML = state.totalPages;
    checkButtonDisable();
    const movieCardContainer = getMovieCardArea();
    movieCardContainer.innerHTML = "";
    const movieList = state.movieList;
    for (let i = 0, len = movieList.length; i < len; i++) {
        const movieCard = createMovieCard(state.movieList[i]);
        movieCard.indexRecord = i;
        movieCardContainer.appendChild(movieCard);
    }
};

const getGereList = () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    return fetch(url)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            state.genres = {...data.genres };
        });
};

const getPopularMovieList = (page) => {
    const url = `${baseUrl}/popular?api_key=${apiKey}&language=en-US&page=${page}`;
    return fetch(url)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            state.movieList = data.results;
            state.totalPages = data.total_pages;
        });
};

const loadDefaultData = () => {
    console.log("here is loadDefaultData");
    getGereList().then(() => {
        getPopularMovieList(1).then(() => {
            state.currPage = 1;
            updateView();
        });
    });
};

const loadEvents = () => {
    const movieCard = document.querySelector(".movie-card-container");
    const movieDetailsClose = document.querySelector(".movie-details-close-icon");
    const navBar = document.querySelector(".nav-bar");
    const nextBtn = document.querySelector("#next-btn");
    const prevBtn = document.querySelector("#prev-btn");
    const dropDown = document.querySelector("#drop-down");

    movieCard.addEventListener("click", handleMovieCardAreaController);
    movieDetailsClose.addEventListener(
        "click",
        handleMovieDetailsCloseController
    );
    navBar.addEventListener("click", handleNavBarController);
    nextBtn.addEventListener("click", handleNextButtonController);
    prevBtn.addEventListener("click", handlePrevButtonController);
    dropDown.addEventListener("change", handleDropDownController);
};

loadDefaultData();
loadEvents();