const night_switch = $('#night-switch');
const root = document.documentElement.style;
night_switch.click(function() {
    let animation = [];
    if(document.querySelector('html').dataset.theme === 'dark') {
        document.querySelector('html').dataset.theme = 'light';
        root.setProperty('--background-color', getComputedStyle(document.documentElement).getPropertyValue('--background-color-light'));
        animation = [
            { left: '34px' },
            { transform: 'left: 3px' }
        ];
    }else {
        document.querySelector('html').dataset.theme = 'dark';
        root.setProperty('--background-color', getComputedStyle(document.documentElement).getPropertyValue('--background-color-night'));
        animation = [
            { left: '3px' },
            { transform: 'left: 34px' }
        ];
    }
    $(this).find(".circle")[0].animate(animation, {
        duration: 300,
    });
})

//MINIFIED HEADER
const header_unminified = $('#header-unminified');
const header_minified = $('#header-minified');
function minifyHeader(active = false) {
    console.debug(active)
    if(active) {
        header_unminified.hide();
        header_minified.show();
    }else {
        header_unminified.show();
        header_minified.hide();
    }
}

minifyHeader(window.scrollY > 0)

window.addEventListener('scroll', function(e) {
    minifyHeader(window.scrollY > 0)
});