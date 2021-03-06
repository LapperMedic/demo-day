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
var infoBox;            // Page element for info box, contains textwall and mode buttons
var earthImage;         // Page element for earth/sun/moon image
var earthMode;          // Page element for earth mode button, within info box
var sunMode;            // Page element for sun mode button, within info box
var moonMode;           // Page element for moon mode button, within info box
var videoMode;          // Page element for video mode button, within info box
var emptyMode;          // Page element for empty mode button, within info box
var demoMode = false;   // Demo mode off by default
var demoTime = 10000;   // Length between navigation in demoMode, in milliseconds
var demoTimeout;        // Variable to hold the demoMode timer, necessary for cancelling the timer
var demoModeSwitch;     // Page element for demoMode switch, top right of screen
var displayMode = 0;    // Earth mode by default
var pages = Object.keys(State);
var router = new Navigo(window.location.origin);
pages.splice(0, 2);     // Remove "About" and "Active" from array

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
        ${Earth(state, displayMode)}
        ${Info(state)}
        ${Slider(state)}
    `;  // Put the HTML content in the page. Header is title, Earth is Earth image, Info is text block, Slider is navbar

    infoBox = document.getElementById('info');
    earthImage = document.getElementById('earth');
    earthMode = document.getElementById('earth-mode');
    sunMode = document.getElementById('sun-mode');
    moonMode = document.getElementById('moon-mode');
    videoMode = document.getElementById('video-mode');
    emptyMode = document.getElementById('empty-mode');
    // Populate the earth div with the correct image for the given page and displayMode
    if (state[state.active].content != 'about') {
        if (displayMode === 0) { // Earth display mode, pull from earth images
            if (state[state.active].earth == 'default')
                earthImage.style.backgroundImage = ''; // Default earth image from style.css
            else
                earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].earth}`;
            activeMode(0);
        }

        else if (displayMode === 1) { // Sun display mode, pull from sun images
            earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].sun}`;
            activeMode(1);
        }

        else if (displayMode === 2) { // Moon display mode, pull from moon images
            earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].moon}`;
            activeMode(2);
        }

        else if (displayMode === 3) { // Video display mode, pull embedded video
            earthImage.style.backgroundImage = 'none';
            earthImage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${state[state.active].video}?start=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            activeMode(3); 
        }

        else if (displayMode === 4) { // Empty display mode, hide image and info box
            earthImage.style.backgroundImage = 'none';
            activeMode(4);
        }

        earthMode.addEventListener('click', (event) => { // Add mode switching links
            event.preventDefault();                      // don't take us anywhere
            displayMode = 0;                             // we're in Earth mode
            handleNav(`${state.active}`);                // refresh the page
        });

        sunMode.addEventListener('click', (event) => {  // Sun mode link
            event.preventDefault();
            displayMode = 1;
            handleNav(`${state.active}`);
        });

        moonMode.addEventListener('click', (event) => { // Moon mode link
            event.preventDefault();
            displayMode = 2;
            handleNav(`${state.active}`);
        });

        videoMode.addEventListener('click', (event) => { // Video mode link
            event.preventDefault();
            displayMode = 3;
            handleNav(`${state.active}`);
        });

        emptyMode.addEventListener('click', (event) => { // Empty mode link
            event.preventDefault();
            displayMode = 4;
            handleNav(`${state.active}`);
        });
    }

    else { // if we're on the about page, everything resets to default behavior
        earthImage.style.backgroundImage = `url('https://i.imgur.com/${state[state.active].earth}`;
        displayMode = 0;
        infoBox.classList.remove('hidden');
    }

    demoModeSwitch = document.getElementById('demo');

    demoModeSwitch.addEventListener('click', () => {              // When we click the header
        demoMode = !demoMode;                                     // toggle demoMode on or off
        if (demoMode)                                             // set the demoMode switch to reflect this
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
        if (event.key >= '1' && event.key <= '7') {     // If the key is 1--7,
            demoOff();                                  // turn demoMode off
            router.navigate(pages[event.key - 1]);      // and navigate to the corresponding page.
        }
    });

    if (demoMode) {             // If demoMode is active
        demoToggle('on');       // toggle the demoMode switch on
        demo(state.active);     // and start demoMode.
    }
    else                        // Otherwise
        demoToggle('off');      // toggle demoMode off.
    router.updatePageLinks();
}

function demo(activePage) {                                      // A demo mode for presenting the site. Auto scrolling.
    let index = pages.findIndex((page) => page === activePage);  // Figure out what index the active page is.
    if (index === 6)                                             // If we're at gamma,
        demoTimeout = setTimeout(() => { router.navigate(pages[0]); }, demoTime); // Set a timer to take us back to radio.
    else                                                         // Otherwise,
        demoTimeout = setTimeout(() => { router.navigate(pages[index + 1]); }, demoTime); // Set a timer to go forward.
}

function demoToggle(polarity) {  // A shortcut which cosmetically swaps the demomode switch icon
    demoModeSwitch.innerHTML = `<i class="fas fa-toggle-${polarity}" title="Autoplay is ${polarity}"></i>`;
}

function demoOff() {                   // A function which turns demoMode off, distinct from demoToggle()
    demoMode = false;                  // Stop demo mode
    demoToggle('off');                 // toggle the demoMode switch
    clearTimeout(demoTimeout);         // and cancel any timers.
}

function activeMode(mode) { // Highlighting for mode buttons
    var modeArray = [earthMode, sunMode, moonMode, videoMode, emptyMode];
    modeArray.forEach((mode) => mode.classList.remove('active')); // Remove all highlighting
    modeArray[mode].classList.add('active'); // Highlight the current mode button
    if (mode === 4) // If we're in hidden mode, hide the info box
        infoBox.classList.add('hidden');
    else
        infoBox.classList.remove('hidden');
}

function handleNav(activePage) {
    var newState = Object.assign({}, State);
    newState.active = activePage;
    render(newState);
}

router
    .on('/:page', (params) => { // Check for valid page before navigating
        if(Object.keys(State).findIndex((page) => page === params.page) != -1 && params.page != 'active')
            handleNav(params.page);
        else  // Redirect any 404 to the landing page
            handleNav('visible');
    })
    .on('/', () => handleNav('visible'))
    .resolve();