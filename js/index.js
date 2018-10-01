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
var demoTime = 10000; // in milliseconds
var demoTimeout;
var demoModeSwitch;
var pages = Object.keys(State);
var router = new Navigo(window.location.origin);
pages.shift();

function render(state){
    title.textContent = `See with Different Eyes`;
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
            link.addEventListener('click', () => demoOff()));         // When we click a navbar link, turn demoMode off.

    document.addEventListener('keypress', (event) => {  // Number key shortcuts
        if(event.key >= '0' && event.key <= '7'){       // If the key is 1--7,
            demoOff();                                  // turn demoMode off
            router.navigate(pages[event.key - 1]);      // and navigate to the corresponding page.
        }
    });

    // let index = pages.findIndex((page) => page === state.active);

    // document.addEventListener('keydown', (event) => {
    //     if(event.key === 'ArrowLeft' || event.key === 'ArrowUp'){
    //         demoOff();
    //         if(index === 0)
    //             router.navigate(pages[6]);
    //         else
    //             router.navigate(pages[index - 1]);
    //     }

    //     else if(event.key === 'ArrowRight' || event.key === 'ArrowDown'){
    //         demoOff();
    //         if(index === 6)
    //             router.navigate(pages[0]);
    //         else
    //             router.navigate(pages[index + 1]);
    //     }
    // });

    if(demoMode) {              // If demoMode is active
        demoToggle('on');       // toggle the demoMode switch on
        demo(state.active);     // and start demoMode.
    }
    else                        // Otherwise
        demoToggle('off');      // toggle demoMode off.
    router.updatePageLinks();
}

function demo(activePage){                                      // A demo mode for presenting the site. Auto scrolling.
    let index = pages.findIndex((page) => page === activePage); // Figure out what index the active page is.
    if(index === 6)                                             // If we're at gamma,
        demoTimeout = setTimeout(() => { router.navigate(pages[0]); }, demoTime); // Set a timer to take us back to radio.
    else                                                        // Otherwise,
        demoTimeout = setTimeout(() => { router.navigate(pages[index + 1]); }, demoTime); // Set a timer to go forward.
}

function demoToggle(polarity){  // A shortcut which cosmetically swaps the demomode switch icon
    demoModeSwitch.innerHTML = `<i class="fas fa-toggle-${polarity}" title="Autoplay is ${polarity}"></i>`;
}

function demoOff(){
    demoMode = false;                  // Stop demo mode
    demoToggle('off');                 // toggle the demoMode switch
    clearTimeout(demoTimeout);         // and cancel any timers.
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