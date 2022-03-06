let buttons = $('.menu-btn');
let contents = $('.menu-info');

let menus = {}
let first_menu = 0

let current_menu = null

/*reset all content (false -> display first menu)*/
function resetContent(resetAll = true) {
    buttons.each(i => {
        buttons[i].classList.remove('active');
    })
    contents.each(i => {
        if(!resetAll && i === first_menu) {
            let btn = buttons[i];
            btn.classList.add('active');
            current_menu = btn.dataset.target;
            $(contents[i]).show();
        }
        else $(contents[i]).hide();
    })
}

/*Display specific menu*/
function openContent(target) {
    current_menu = target;
    resetContent();
    buttons.each(i => {
        if($(buttons[i]).data('target') === target) {
            buttons[i].classList.add('active');
        }
    })
    $(`#content-${target}`).show();
}

/*Event when button is clicked*/
buttons.click(e => {
    openContent($(e.target).data('target'))
})