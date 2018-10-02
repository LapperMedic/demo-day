export default function Slider(state) {
    var links = Object.keys(state);
    var sliderLinks = '<div id="slider"><ul>';
    links.shift();
    links.shift(); // remove Active and About pages from array

    links.forEach(link => {
        if(state[link].content != state[state.active].content) {
            sliderLinks += `<li><a href="/${state[link].content}" data-navigo>${state[link].title}</a></li>`;
        }

        else if(state[link].content == state[state.active].content) {
            sliderLinks += `<li><a href="/${state[link].content}" class="active" data-navigo>${state[link].title}</a></li>`; // active page navbar highlighting
        }
    });

    sliderLinks += '</ul></div>';

    return sliderLinks;
}