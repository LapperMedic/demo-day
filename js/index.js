import Axios from 'axios';
import Navigo from 'navigo';
import Earth from '../components/Earth';
import Header from '../components/Header';
import Info from '../components/Info';
import Slider from '../components/Slider';
import Space from '../components/Space';
import * as State from '../store';

var root = document.getElementById('root');
var body = document.querySelector('body');
var title = document.querySelector('title');
var demoMode = false;
var demoTime = 8000; // in milliseconds
var demoTimeout;
var demoModeSwitch;
var pages = Object.keys(State);
var router = new Navigo(window.location.origin);
pages.shift();

function render(state){
    title.textContent = `See With Different Eyes`;
    if(state[state.active].title !== 'Visible Light')
        title.textContent += ` | ${state[state.active].title}`; // dynamic title based on current page
    body.style.backgroundColor = state[state.active].loading; // preload low-res space image
    Axios
        .get(`https://i.imgur.com/${Space(state[state.active])}`) // fetch normal-res space image
        .then(body.style.backgroundImage = `url('https://i.imgur.com/${Space(state[state.active])}')`);

    root.innerHTML = `
        ${Header(state[state.active])}
        ${Earth(state[state.active])}
        ${Info(state[state.active])}
        ${Slider(state)}
    `;  // Put the HTML content in the page. Header is title, Earth is Earth image, Info is text block, Slider is navbar

    // document.querySelector('#earth').style.backgroundImage = `url('https://i.imgur.com/${state[state.active].earth}`;
    demoModeSwitch = document.getElementById('demo');

    demoModeSwitch.addEventListener('click', (event) => {         // When we click the header
        demoMode = !demoMode;                                     // toggle demoMode on or off
        if(demoMode)                                              // set the demoMode switch to reflect this
            demoToggle('on');         
        else
            demoToggle('off');
        clearTimeout(demoTimeout);                                // and cancel any timers
        handleNav(`${state.active}`);                             // then re-render the page.
    });

    document.querySelectorAll('#slider a').forEach((link) =>
            link.addEventListener('click', () => { // When we click on a navbar link
                demoToggle('off');                 // toggle the demoMode switch
                demoMode = false;                  // stop demo mode
                clearTimeout(demoTimeout);         // and cancel any timers.
            })
    );

    if(demoMode) {              // If demoMode is active
        demoToggle('on');       // toggle the demoMode switch on
        demo(state.active);     // and start demoMode.
    }
    else                        // Otherwise
        demoToggle('off');      // toggle the demoMode switch off

    router.updatePageLinks();
}

function demo(activePage){                                      // A demo mode for presenting the site. Auto scrolling.
    let index = pages.findIndex((page) => page === activePage); // Figure out what index the active page is.
    if(index === 6)                                             // If we're at gamma,
        demoTimeout = setTimeout(() => { handleNav(pages[0]) }, demoTime); // Set a timer to take us back to radio.
    else                                                        // Otherwise,
        demoTimeout = setTimeout(() => { handleNav(pages[index + 1]) }, demoTime); // Set a timer to go forward a page.
}

function demoToggle(polarity){  // A shortcut which cosmetically swaps the demomode switch icon
    demoModeSwitch.innerHTML = `<i class="fas fa-toggle-${polarity}" title="Autoplay is ${polarity}"></i>`;
    console.log(`Demo mode is ${polarity}.`);
}

function handleNav(activePage){
    var newState = Object.assign({}, State);

    newState.active = activePage;
    render(newState);
}

router
    .on('/:page', (params) => handleNav(params.page))
    .on('/', () => handleNav('visible'))
    .resolve();