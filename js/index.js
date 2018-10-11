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
var infoBox;
var earthImage;
var earthMode;
var sunMode;
var moonMode;
var emptyMode;
var demoMode = false;
var demoTime = 10000; // in milliseconds
var demoTimeout;
var demoModeSwitch;
var displayMode = 0;
var pages = Object.keys(State);
var router = new Navigo(window.location.origin);
pages.splice(0, 2); // Remove "About" and "Active" from array

function render(state) {
    title.textContent = `See with Different Eyes`;
    if (state[state.active].title !== 'Visible Light')
        title.textContent += ` | ${state[state.active].title}`; // dynamic title based on current page

    body.style.backgroundColor = `${state[state.active].bg}`; // colored background for no 'flash' during load
    Axios
        .get(`https://i.imgur.com/${state[state.active].loading}`) // fetch low-res space image
        .then(body.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].loading}')`)
    Axios
        .get(`https://i.imgur.com/${Space(state[state.active])}`) // fetch hi-res space image
        .then(body.style.backgroundImage = `url('https://i.imgur.com/${Space(state[state.active])}')`);

    root.innerHTML = `
        ${Header(state)}
        ${Earth()}
        ${Info(state)}
        ${Slider(state)}
    `;  // Put the HTML content in the page. Header is title, Earth is Earth image, Info is text block, Slider is navbar

    infoBox = document.querySelector('#info');
    earthImage = document.getElementById('earth');
    earthMode = document.getElementById('earth-mode');
    sunMode = document.getElementById('sun-mode');
    moonMode = document.getElementById('moon-mode');
    emptyMode = document.getElementById('empty-mode');

    if (state[state.active].content != 'about') {
        if (displayMode === 0) {
            if (state[state.active].earth == 'default')
                earthImage.style.backgroundImage = '';
            else
                earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].earth}`;
            earthMode.classList.add('active');  // Highlight the Earth button
            sunMode.classList.remove('active');
            moonMode.classList.remove('active');
            emptyMode.classList.remove('active');
            infoBox.classList.remove('hidden');
        } // Earth display mode, pull from earth images

        else if (displayMode === 1) {
            earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].sun}`;
            earthMode.classList.remove('active');
            sunMode.classList.add('active');    // Highlight the Sun button
            moonMode.classList.remove('active');
            emptyMode.classList.remove('active');
            infoBox.classList.remove('hidden');
        } // Sun display mode, pull from sun images

        else if (displayMode === 2) {
            earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].moon}`;
            earthMode.classList.remove('active');
            sunMode.classList.remove('active');
            moonMode.classList.add('active');   // Highlight the Moon button
            emptyMode.classList.remove('active');
            infoBox.classList.remove('hidden');
        } // Moon display mode, pull from moon images

        else if (displayMode === 3) {
            earthImage.style.backgroundImage = 'none';
            earthMode.classList.remove('active');
            sunMode.classList.remove('active');
            moonMode.classList.remove('active');
            emptyMode.classList.add('active');  // Highlight the Empty button
            infoBox.classList.add('hidden');    // Hide the info box
        } // Empty display mode, hide image

        earthMode.addEventListener('click', (event) => { // Add mode switching links
            event.preventDefault();
            displayMode = 0;
            handleNav(`${state.active}`);
        });

        sunMode.addEventListener('click', (event) => {
            event.preventDefault();
            displayMode = 1;
            handleNav(`${state.active}`);
        });

        moonMode.addEventListener('click', (event) => {
            event.preventDefault();
            displayMode = 2;
            handleNav(`${state.active}`);
        });

        emptyMode.addEventListener('click', (event) => {
            event.preventDefault();
            displayMode = 3;
            handleNav(`${state.active}`);
        });
    }

    else { // if we're on the about page
        earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].earth}`;
        displayMode = 0;
        infoBox.classList.remove('hidden');
    }

    demoModeSwitch = document.getElementById('demo');

    demoModeSwitch.addEventListener('click', () => {              // When we click the header
        demoMode = !demoMode;                                     // toggle demoMode on or off
        if (demoMode)                                              // set the demoMode switch to reflect this
            demoToggle('on');
        else
            demoToggle('off');
        clearTimeout(demoTimeout);                                // and cancel any timers
        handleNav(`${state.active}`);                             // then re-render the page.
    });

    document.querySelectorAll('#slider a').forEach((link) =>
        link.addEventListener('click', () => demoOff()));         // When we click a navbar link, turn demoMode off.

    document.querySelector('#about a').addEventListener('click', () => demoOff());  // Likewise for the about link.

    document.addEventListener('keypress', (event) => {  // Number key shortcuts
        if (event.key >= '1' && event.key <= '7') {       // If the key is 1--7,
            demoOff();                                  // turn demoMode off
            router.navigate(pages[event.key - 1]);      // and navigate to the corresponding page.
        }
    });

    if (demoMode) {              // If demoMode is active
        demoToggle('on');       // toggle the demoMode switch on
        demo(state.active);     // and start demoMode.
    }
    else                        // Otherwise
        demoToggle('off');      // toggle demoMode off.
    router.updatePageLinks();
}

function demo(activePage) {                                      // A demo mode for presenting the site. Auto scrolling.
    let index = pages.findIndex((page) => page === activePage); // Figure out what index the active page is.
    if (index === 6)                                             // If we're at gamma,
        demoTimeout = setTimeout(() => { router.navigate(pages[0]); }, demoTime); // Set a timer to take us back to radio.
    else                                                        // Otherwise,
        demoTimeout = setTimeout(() => { router.navigate(pages[index + 1]); }, demoTime); // Set a timer to go forward.
}

function demoToggle(polarity) {  // A shortcut which cosmetically swaps the demomode switch icon
    demoModeSwitch.innerHTML = `<i class="fas fa-toggle-${polarity}" title="Autoplay is ${polarity}"></i>`;
}

function demoOff() {
    demoMode = false;                  // Stop demo mode
    demoToggle('off');                 // toggle the demoMode switch
    clearTimeout(demoTimeout);         // and cancel any timers.
}

function handleNav(activePage) {
    var newState = Object.assign({}, State);

    newState.active = activePage;
    render(newState);
}

router
    .on('/:page', (params) => handleNav(params.page))
    .on('/', () => handleNav('visible'))
    .resolve();