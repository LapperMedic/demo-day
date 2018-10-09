import * as Pages from './pages';

export default function Info(state){
    if(state.content === 'about') { // Swap out the mode changing buttons for personal links
        return `
            <div id="info">
                <div>
                    <ul class="switcher">
                        <li><a href="mailto:alexrlapp@gmail.com" target="_blank"><i class="far fa-envelope" title="Email"></i></a></li>
                        <li><a href="https://linkedin.com/in/alexlapp/" target="_blank"><i class="fab fa-linkedin" title="LinkedIn"></i></a></li>
                        <li><a href="https://github.com/LapperMedic/demo-day" target="_blank"><i class="fab fa-github" title="GitHub"></i></a></li>
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
                        <li><a href="#" id="earth-mode"><i class="fas fa-globe-americas"></i></a></li>
                        <li><a href="#" id="sun-mode"><i class="fas fa-sun"></i></a></li>
                        <li><a href="#" id="moon-mode"><i class="fas fa-moon"></i></a></li>
                    </ul>
                    ${Pages[state.content]}
                </div>
            </div>
        `;
    }
}