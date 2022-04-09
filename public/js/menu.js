let icons = $('.right-menu-icon');
let popups = $('.right-menu-popup');
let links = $('.link');

function hidePopups() {
    popups.each(function () {
        $(this).hide();
    })
}
hidePopups();

// HOVERS
icons.mouseenter(function () {
    if($(this).data('popup') !== undefined && $(this).data('popup') === false) return;

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

// CLICKS
links.click(function () {
    if(this.dataset.path === undefined) return;
    window.location.href = this.dataset.path;
})