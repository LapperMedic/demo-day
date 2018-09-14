import * as Pages from './pages';

export default function Info(state){
    return `<div id="info"><div>${Pages[state.content]}</div></div>`
}