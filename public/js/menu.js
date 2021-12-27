let icons = $('.right-menu-icon');
let popups = $('.right-menu-popup');

function hidePopups() {
    popups.each(function () {
        $(this).hide();
    })
}
hidePopups();

icons.mouseenter(function () {
    let target = $(this).data('target');
    hidePopups();
    $(`#right-menu-popup-${target}`).show();
    setTimeout(function () {
        let hovers = $(':hover');
        let hover = hovers[hovers.length-1];
        if(!hover.className.includes('right-menu-icon')
            && !hover.className.includes('right-menu-popup')) {
            while (hover) {
                hover = hover.parentNode;
                if(hover !== document && hover !== null) {
                    if (hover.classList.contains('right-menu-popup')) {
                        return;
                        return;
                    }
                }
            }
            hidePopups();
        }
    }, 1000);
})

popups.mouseleave(e => {
    hidePopups();
})