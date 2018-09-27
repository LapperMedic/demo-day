export default function Header(state){
    if(state.title !== 'Visible Light') {
        return `
            <div id="header">
                <span id="demo"></span>
                <h1>What if you could see...</h1>
                <h2>${state.title}</h2>
            </div>
        `;
    }

    else {
        return `
            <div id="header">
                <span id="demo"></span>
                <h1>What if you could see...</h1>
                <h2>...with different eyes?</h2>
            </div>
        `
    }
}