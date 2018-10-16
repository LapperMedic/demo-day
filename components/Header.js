export default function Header(state){
    if(state[state.active].title !== 'Visible Light') {
        return `
            <div id="header">
                <span id="about"><a href="/about" data-navigo><i class="fas fa-info-circle" title="About this site"></i></a></span>
                <span id="demo"></span>
                <h1>What if you could see...</h1>
                <h2>${state[state.active].title}</h2>
            </div>
        `;
    }

    else {
        return `
            <div id="header">
                <span id="about"><a href="/about" data-navigo><i class="fas fa-info-circle" title="About tihs site"></i></a></span>
                <span id="demo"></span>
                <h1>What if you could see...</h1>
                <h2>with different eyes?</h2>
            </div>
        `
    }
}