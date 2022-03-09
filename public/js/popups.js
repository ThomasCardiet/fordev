let btn = $('.popup-btn');
let overlay = $('#overlay');
let popup = $('#popup');
let popup_message = $('.popup-message');
let popup_html = popup.html();

let current_popup = null;
let popup_data = [];

let body = $('body');

let animations_params = {
    popup: {
        element: popup,
        in: 'popup-in',
        out: 'popup-out',
        duration: 0.5
    },
    message: {
        element: popup_message,
        in: 'msg-in',
        out: 'msg-out',
        duration: 0.5,
        display_time: 3
    }
}

/*RESET POPUPS*/

togglePopup();

function togglePopup(active = false, animate = false) {
    active ? overlay.show() : overlay.hide();
    if(active) {
        popup.show();
        if(animate) animatePopup(animations_params.popup);
    }else {
        if(animate) {
            animatePopup(animations_params.popup, false);
            setTimeout(function () {
                popup.hide();
            }, animations_params.popup.duration*1000 - 50);
        }else popup.hide();
        current_popup = null;
    }
}

/*POPUP BUTTON CLICK*/
body.on('click', '.popup-btn', e => {
    $(e.target).attr('class').includes('fa-times') ? togglePopup(false, true) : UpdatePopup($(e.target).data('target'));
})

overlay.click(function () {
    togglePopup(false, true);
})

/*TOGGLE POPUP*/
function UpdatePopup(type, message = null) {

    //No message
    if(message === null) {

        current_popup = type;
        let popup_content = $(`[data-popup="${type}"]`);

        //Set popup content
        popup_message.hide();
        popup.children().each(function () {
            if(

                //CLASS
                ($(this).attr('class') !== undefined &&
                ($(this).attr('class').includes('fa-times')
                    || $(this).attr('class').includes('popup-message')))

                //ID
                || ($(this).attr('id') !== undefined &&
                ($(this).attr('id') === 'popup-loader'))) return;
            $(this).remove();
        })
        popup.attr('class', popup_content.data('class'));
        popup_content.children().each(function () {
            popup.append($(this).clone());
        })

        //LOADER
        let loader = $('#popup-loader')
        if(popup_content.data('loader')) {
            popup.data('has_value', false);
            loader.show();
            setInterval(function () {
                if(popup.data('has_value')) {
                    loader.hide();
                }
            }, 100)
        }else {
            loader.hide();
        }

        togglePopup(true, true);

    //Message exist
    }else {

        //Set popup message
        switch (message.type) {
            case 'success':
                message.value = `<i class="fas fa-check-circle" aria-hidden="true"></i> ${message.value}`
                break;
            case 'error':
                message.value = `<i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${message.value}`
                break;
        }
        popup_message.attr('class', `popup-message ${message.type}`);
        let popup_message_child = popup_message.find(">:first-child");
        popup_message_child.html(message.value);
        popup_message_child.hide();

        let relation_list_block = $('.relation-popup-list-block');
        relation_list_block.css('height', '79%')
        popup_message.show();

        //MESSAGE ANIMATION
        animatePopup(animations_params.message);

        //Show message content
        setTimeout(function () {
            popup_message_child.show()
        }, (animations_params.message.duration / 5)*1000);

        //Timeout of message display
        setTimeout(function () {
            animatePopup(animations_params.message, false);

            //D'abord hide du message content à la moitié de l'animation de fermeture puis on termine l'animation
            setTimeout(function () {
                popup_message_child.hide()

                //On hide le block sur le moitié de l'animation restante
                setTimeout(function () {
                    popup_message.hide();
                    relation_list_block.css('height', '87%')
                }, (animations_params.message.duration / 2)*1000);

            }, (animations_params.message.duration*1000) - ((animations_params.message.duration / 2)*1000) - 50);

        }, animations_params.message.display_time * 1000);
    }
}

/*Start Popup animation*/
function animatePopup(params, type = true) {
    type ? params.element.css('animation', `${params.in} ${params.duration}s`) : params.element.css('animation', `${params.out} ${params.duration}s`)
}

//NOTIFICATION POPUP
let popup_notification = $('#popup-notification');
let popup_notification_animation = $('.popup-notification-anim');

popup_notification.hide();
function sendNotification(data) {
    $('#popup-notification-msg').text(data.value);
    popup_notification_animation.each(function () {
        $(this).data('type') === data.type ? $(this).show() : $(this).hide();
    })
    popup_notification.show()
    setTimeout(function () {
        popup_notification.hide()
    }, 2500)
}

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