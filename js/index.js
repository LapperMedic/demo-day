import Navigo from 'navigo';
import Earth from '../components/Earth';
import Space from '../components/Space';
import Slider from '../components/Slider';
import Info from '../components/Info';
import Header from '../components/Header';
import * as State from '../store';

var root = document.getElementById('root');
var body = document.querySelector('body');
var router = new Navigo(window.location.origin);

function render(state){
    body.style.backgroundImage = `url('https://i.imgur.com/${Space(state[state.active])}')`;
    root.innerHTML = `${Header(state[state.active])} ${Earth(state[state.active])} ${Info(state[state.active])} ${Slider(state)}`
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