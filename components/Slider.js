export default function Slider(state) {
    var links = Object.keys(state);
    var sliderLinks = '<div id="slider"><ul>';

    links.forEach(link => {
        if(link !== 'active' && state[link].content != state[state.active].content) {
            sliderLinks += `<li><a href="/${state[link].content}" data-navigo>${state[link].title}</a></li>`;
        }

        else if(state[link].content == state[state.active].content) {
            sliderLinks += `<li><a href="/${state[link].content}" class="active" data-navigo>${state[link].title}</a></li>`;
        }
    });

    sliderLinks += '</ul></div>';

    return sliderLinks;
    // <div id="slider">
    //     <input type="range" list="tickmarks" min="0" max="6" step="1" value="3">

    //     <datalist id="tickmarks" style="display:block;">
    //         <option value="0" label="Radio Waves">
    //         <option value="1" label="Microwaves">
    //         <option value="2" label="Infrared">
    //         <option value="3" label="Visible Light">
    //         <option value="4" label="Ultraviolet">
    //         <option value="5" label="X-rays">
    //         <option value="6" label="Gamma Rays">
    //     </datalist>
    // </div>
}