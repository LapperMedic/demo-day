export default function Earth(state, displayMode) {
    if (state[state.active].content != 'about') {
        if (displayMode === 0)
            return `<div id="earth" title="The Earth, if you could see ${state[state.active].title}"></div>`;
        else if (displayMode === 1)
            return `<div id="earth" title="The Sun, if you could see ${state[state.active].title}"></div>`;
        else if (displayMode === 2)
            return `<div id="earth" title="The Moon, if you could see ${state[state.active].title}"></div>`;
        else if (displayMode === 4)
            return `<div id="earth" title="The Milky Way, if you could see ${state[state.active].title}"></div>`;
        else
            return `<div id="earth"></div>`;
    }

    else
        return `<div id="earth" title="Alex Lapp, if you could see your dashing host"></div>`;
}