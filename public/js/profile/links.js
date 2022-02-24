let buttons = $('.profile-btn');
let contents = $('.menu-info');

let first_menu = 2;
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
resetContent(false);

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

/*Event when wheel scroll*/
$('#relations-img-list').bind('mousewheel DOMMouseScroll', e => {
    if(e.originalEvent.wheelDelta /120 > 0) e.target.scrollLeft += 40;
    else e.target.scrollLeft -= 40;
    return false
})

$('.relations-img').bind('mousewheel DOMMouseScroll', e => {
    let element = $('#relations-img-list')[0]
    if(e.originalEvent.wheelDelta /120 > 0) element.scrollLeft += 40;
    else element.scrollLeft -= 40;
    return false
})