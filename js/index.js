import Axios from 'axios';
import Navigo from 'navigo';
import { tween, styler } from 'popmotion';
import Earth from '../components/Earth';
import Header from '../components/Header';
import Info from '../components/Info';
import Slider from '../components/Slider';
import Space from '../components/Space';
import * as State from '../store';

var root = document.getElementById('root');
var body = document.querySelector('body');
var title = document.querySelector('title');
var router = new Navigo(window.location.origin);

function render(state){
    title.textContent = `See With Different Eyes`;
    if(state[state.active].title !== 'Visible Light')
        title.textContent += ` | ${state[state.active].title}`; // dynamic title based on current page
    body.style.backgroundColor = state[state.active].loading; // preload low-res space image
    Axios
        .get(`https://i.imgur.com/${Space(state[state.active])}`) // fetch normal-res space image
        .then(body.style.backgroundImage = `url('https://i.imgur.com/${Space(state[state.active])}')`);
    root.innerHTML = `${Header(state[state.active])} ${Earth(state[state.active])} ${Info(state[state.active])} ${Slider(state)}`

    document.querySelector('#header h2').addEventListener('dblclick', (event) => { // silly animation nonsense
        var animation = tween({
            'from': {
                'color': '#fff',
                'letterSpacing': '0.08rem'
            },
            'to': {
                'color': '#00f',
                'letterSpacing': '0.7rem'
            },
            'duration': 2000
        });
        var title = styler(event.target);
        animation.start((value) => title.set(value));
    });

    router.updatePageLinks();
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