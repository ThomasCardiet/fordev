let icons = $('.right-menu-icon');
let popups = $('.right-menu-popup');

function hidePopups() {
    popups.each(function () {
        $(this).hide();
    })
}
hidePopups();

icons.hover(function () {
    let target = $(this).data('target');
    hidePopups();
    $(`#right-menu-popup-${target}`).show();
    setTimeout(function () {
        let hovers = $(':hover');
        let hover = hovers[hovers.length-1];
        if(!hover.className.includes('right-menu-icon') && !hover.className.includes('right-menu-popup')) {
            hidePopups();
        }
    }, 1000);
})

popups.mouseout(function (e) {
    hidePopups();
})