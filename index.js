let stylesheets = [];
let scripts = [];

const content = document.getElementById("content");


window.addEventListener("hashchange", loadPage);
window.addEventListener("load", loadPage);

async function loadPage() {
    const page = window.location.hash.slice(1);
    content.innerHTML = `<div class='loading'><h1>Loading...</h1></div>`;
    
    try {
        const response = await fetch(`Pages/${page}/index.html`);
        if (response.ok) {
            //history.pushState(null, null, `/${page}`);
            

            unloadStylesheets();
            unloadScripts();

            const html = await response.text();
            content.innerHTML = html;

            loadStylesheet(page);
            loadScript(page);
        }
        else {
            content.innerHTML = `<div class='error'><h1>Error loading page</h1> <p>${response.status} ${response.statusText}</p></div>`;
        }
    } catch (error) {
        content.innerHTML = `<div class='error'><h1>Error loading page</h1> <p>${error}</p></div>`;
    }
}


const loadStylesheet = async (page) => {
    const response = await fetch(`Pages/${page}/index.css`);
    if (response.ok) {
        const css = await response.text();
        const style = document.createElement("style");
        style.textContent = css;
        stylesheets.push(style);
        document.head.appendChild(style);
    }
    else {
        console.log(`Failed to load ${page} stylesheet`);
    }
}


const loadScript = async (page) => {
    const response = await fetch(`Pages/${page}/index.js`);
    if (response.ok) {
        const js = await response.text();
        const script = document.createElement("script");
        script.textContent = js;
        scripts.push(script);
        document.body.appendChild(script);
    }
    else {
        console.log(`Failed to load ${page} script`);
    }
}


const unloadScripts = () => {
    scripts.forEach(script => document.body.removeChild(script));
    scripts = [];
}


const unloadStylesheets = () => {
    stylesheets.forEach(style => document.head.removeChild(style));
    stylesheets = [];
}