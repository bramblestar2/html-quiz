window.onload = (event) => {
    console.log(event.target.URL);
};

function link_navigateTo(event, page) {
    event.preventDefault();

    console.log(page)
    window.history.pushState(null, null, `/n-src/${page}`);
}


window.link_navigateTo = link_navigateTo