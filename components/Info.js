import * as Pages from './pages';

export default function Info(state){
    if(state.content === 'about') { // Swap out the mode changing buttons for personal links
        return `
            <div id="info">
                <div>
                    <ul class="switcher">
                        <li title="Email"><a href="mailto:alexrlapp@gmail.com" target="_blank"><i class="far fa-envelope" ></i></a></li>
                        <li title="LinkedIn"><a href="https://linkedin.com/in/alexlapp/" target="_blank"><i class="fab fa-linkedin" ></i></a></li>
                        <li title="GitHub"><a href="https://github.com/LapperMedic/demo-day" target="_blank"><i class="fab fa-github" ></i></a></li>
                    </ul>
                    ${Pages[state.content]}
                </div>
            </div>
        `;
    }

    else {
        return `
            <div id="info">
                <div>
                    <ul class="switcher">
                        <li title="View Earth in ${state.title}"><a id="earth-mode"><i class="fas fa-globe-americas"></i></a></li>
                        <li title="View the Sun in ${state.title}"><a id="sun-mode"><i class="fas fa-sun"></i></a></li>
                        <li title="View the Moon in ${state.title}"><a id="moon-mode"><i class="fas fa-moon"></i></a></li>
                        <li title="Hide"><a id="empty-mode"><i class="fas fa-ban"></i></a></li>
                    </ul>
                    ${Pages[state.content]}
                </div>
            </div>
        `;
    }
}