//ADVANCED PROPERTIES
let adv_content = $('.advanced-content');
adv_content.hide();

body.on('click', '.advanced-properties', e => {
    let adv_btn = $(e.target);
    let active = adv_btn.data('active');
    let content = adv_btn.data('target');
    let content_element = $(`#${content}`);

    adv_btn.find(">:first-child").toggleClass('active', !active);
    adv_btn.data('active', !active);

    active ? content_element.hide() : content_element.show();
})