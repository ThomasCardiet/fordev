const url = `${this.location.href}/ajax`;
let content_user = $('#content-user');
const user_id = content_user.data('id');

let models = $('.model');
models.hide();

function formatDate(string) {
    let date = new Date(string);
    return `${String(date.getDate()).padStart(2, '0')}/` +
        `${String(date.getMonth() + 1).padStart(2, '0')}/` +
        `${date.getFullYear()} ` +
        `à ${String(date.getHours()).padStart(2, '0')}:` +
        `${String(date.getMinutes()).padStart(2, '0')}:` +
        `${String(date.getSeconds()).padStart(2, '0')}`;
}

//SECTIONS OF PROFILE
let sections = [
    'user',
    'relations',
    'projects',
    'stats'
]

//FONCTIONS AJAX
let methods = {

   /*Get methods*/

    /*USER*/
    getUserInformations: {
        function: {
            section: sections[0],
        },
        update: true,
        type: 'get',
        style: null,
        params: {
            target: '#content-user',
            data: 'users',
            count: true,
            bubble: false,
            popup: null,
            popup_update: false,
            need_popup_data: false,
        }
    },

    /*RELATIONS*/
    getFriends: {
        function: {
            section: sections[1],
        },
        update: true,
        type: 'get',
        style: 'list',
        params: {
            target: '.relation-popup-list-list',
            data: 'users',
            count: true,
            bubble: false,
            popup: 'relation-list',
            popup_update: true,
            need_popup_data: false,
        }
    },
    getFriendRequests: {
        function: {
            section: sections[1],
        },
        update: true,
        type: 'get',
        style: 'list',
        params: {
            target: '.relation-popup-list-requests',
            data: 'users',
            count: true,
            bubble: true,
            popup: 'relation-requests',
            popup_update: true,
            need_popup_data: false,
        }
    },
    getUnfriendUsers: {
        function: {
            section: sections[1],
        },
        update: false,
        type: 'get',
        style: 'list',
        params: {
            target: '.relation-popup-list-add',
            data: 'users',
            count: false,
            bubble: false,
            popup: 'relation-add',
            popup_update: true,
            need_popup_data: false,
        }
    },

    getRecentConversations: {
        function: {
            section: sections[1],
        },
        update: true,
        type: 'get',
        style: 'list',
        params: {
            target: '#relations-conversations-block',
            data: 'conversations',
            count: true,
            bubble: false,
            popup: null,
            popup_update: false,
            need_popup_data: false,
        }
    },

    getConversation: {
        function: {
            section: sections[1],
        },
        update: false,
        type: 'get',
        style: null,
        params: {
            target: '.relation-popup-conversation',
            data: 'conversations',
            count: false,
            bubble: false,
            popup: 'conversation',
            popup_update: true,
            need_popup_data: true,
        }
    },

    /*Update methods*/

        /*USER*/
    updateUser: {
        function: {
            section: sections[0],
        },
        update: false,
        type: 'action',
        style: 'message'
    },

        /*RELATIONS*/
    addFriend: {
        function: {
            section: sections[1],
        },
        update: false,
        type: 'action',
        style: 'message'
    },
    removeFriend: {
        function: {
            section: sections[1],
        },
        update: false,
        type: 'action',
        style: 'message'
    },
    sendMessage: {
        function: {
            section: sections[1],
        },
        update: false,
        type: 'action',
        style: null
    },
}

function methodsFunctions(name, value, data = {}, containFile = false) {

    popup_data = data;

    let ajax_request = {
        url:`${url}/${name}`,
        dataType:"json",
        method:"POST",
        data:data,
        success: function (response) {

            /*Switch of request type*/
            switch (value.type) {
                case 'get':

                    /*Switch of style*/
                    switch (value.style) {

                        //List style
                        case 'list':

                            //Get list element
                            let list = $(value.params.target);

                            //Counter update element (if param count is true)
                            let counter = value.params.count ? $(`${value.params.target}-count`) : null;
                            let bubble = value.params.bubble ? $(`#relation-${
                                value.params.target.split('-')[value.params.target.split('-').length-1]
                            }-count`) : null;

                            //get li model for list
                            let model = null;
                            list.children().each(function() {
                                this.classList.contains('model') ? model = this : this.remove();
                            })

                            if(model === null) return;

                            /*Set model*/
                            let datas = response.data.values;

                            //Update count
                            if(counter !== null) counter.text(`(${datas.length})`);
                            if(bubble !== null) {
                                if(datas.length > 0) {
                                    bubble.find(">:first-child").text(`${datas.length}`)
                                    bubble.show();
                                } else bubble.hide();
                            }

                            if(!datas) return;

                            //Liste d'amis scrollable
                            let friends_block = $('#relations-img-list');
                            let friends_block_html = '';

                            datas.forEach(o => {


                                let pp_path = o.pp_path ? `users/${o.pp_path}` : 'unknown.png'

                                //Update model
                                let html = $(model).html()
                                    .replaceAll("%img%", `<img src='img/profile/${pp_path}' alt='#'>`);


                                for (const [key, value] of Object.entries(o)) {
                                    html = html.replaceAll(`%${key}%`, key.includes('_at') ? formatDate(value) : value);
                                }

                                list[0].innerHTML += "<li>" + html + "</li>";

                                //Liste d'amis scrollable
                                if(name === "getFriends") {
                                    friends_block_html +=
                                        '<div class="relations-img">' +
                                        `<img src='../../img/profile/${pp_path}' alt='#'>` +
                                        `<h3>${o.username}</h3>` +
                                        `<i class="fas fa-circle"></i>` +
                                        '</div>';
                                }
                            })

                            //Liste d'amis scrollable
                            if(name === "getFriends") friends_block.html(friends_block_html);

                            break;

                        default:
                            let values = response.data.values;
                            let element = $(value.params.target);

                            switch (name) {

                                //GET CONVERSATION
                                case Object.keys(methods)[5]:
                                    let block_element = $(`${value.params.target}-block`)
                                    let target_element = $(`${value.params.target}-target`);

                                    let is_end_scroll = block_element[0].scrollHeight - block_element[0].scrollTop === block_element[0].clientHeight;
                                    if(target_element.html() !== response.data.target.username) is_end_scroll = true;

                                    block_element.html('');
                                    target_element.html(response.data.target.username);
                                    $('#send-message-btn').attr('data-target_id', response.data.target.id);
                                    values.forEach((v) => {
                                        let owned = v.owned === '1';
                                        let pp_path = v.pp_path ? `users/${v.pp_path}` : 'unknown.png';
                                        let img = `<img src='img/profile/${pp_path}' alt='#'>`;
                                        let msg = `<div class='relation-popup-conversation-message-block ${owned ? 'owned' : ''}'>` +
                                            `   ${owned ? '' : img} ` +
                                            "   <div>" +
                                            "       <p class='relation-popup-conversation-message-content'>" +
                                            `         ${v.content}` +
                                            "       </p>" +
                                            `       <p class='relation-popup-conversation-message-date'>${formatDate(v.created_at)}</p>` +
                                            "   </div>" +
                                            `   ${owned ? img : ''} ` +
                                            "</div>";

                                        block_element.html(block_element.html() + msg);
                                    })

                                    if(is_end_scroll) block_element[0].scrollTop = block_element[0].scrollHeight
                                    break;

                                //WITH MODEL
                                default:

                                    element.find(">:first-child").children().each(function() {
                                        for (const [key, value] of Object.entries(values)) {
                                            if($(this).data('value') === key) $(this).html(value);
                                            if($(this).data('value') === 'pp' && key === 'pp_path' && value !== null) $(this).attr('src', `img/profile/users/${value}?t=${new Date().getTime()}`);
                                        }
                                    })
                                    break;
                            }

                            break;
                    }
                    break;

                case 'action':

                    /*Switch of style*/
                    switch (value.style) {
                        case 'message':

                            UpdatePopup(null, {
                                'type': response.data.status,
                                'value': response.data.msg
                            });
                            break;

                        default:
                            break;
                    }
                    break;
            }

            if(!value.update || (value.params !== undefined && value.params.popup !== undefined)) popup.data('has_value', true);
        },
    };

    if(containFile) {
        ajax_request.processData = false;
        ajax_request.contentType = false;
    }

    $.ajax(ajax_request);
}

function update(all = false) {
    for (const [key, value] of Object.entries(methods)) {

        if(all && value.update) {
            methodsFunctions(key, value, current_popup === null ? {} : popup_data);
            continue;
        }

        if((value.function.section !== current_menu || value.params === undefined)) continue;

        if((current_popup === null && value.update)
            || (value.params.popup !== null && value.params.popup === current_popup && value.params.popup_update)) {

            if(value.params.need_popup_data && Object.keys(popup_data).length === 0) continue;

            methodsFunctions(key, value, current_popup === null ? {} : popup_data);
        }
    }
}

//SET UPDATE
let update_interval = null;
function setUpdate(m = null) {
    if(update_interval !== null) clearInterval(update_interval);
    else update(true);
    update_interval = setInterval(update, 5000);
}

setUpdate();

//Stop interval when popup is open
body.on('click', '.popup-btn', e => {
    update();
    setUpdate();
})

//AJAX BUTTONS
body.on('click', '.ajax-btn', e => {

    let method_name = $(e.target).data('method');
    let data = $(e.target).clone().data();

    switch (data.method) {
        case 'sendMessage':
            let textarea = $(e.target).prev();
            let msg = textarea.val();
            if(msg.length > 0) {
                data.msg = msg;
                textarea.val('');
            } else UpdatePopup(null, {
                'type': 'error',
                'value': 'Vous devez écrire un message.'
            });
            break;
    }

    delete data.method;

    //If contains file
    let has_file = false;
    if(data.file) {
        has_file = true;
        let file_element = $(`${data.file}`);
        if(!file_element.val()) {
            UpdatePopup(null, {
                'type': 'error',
                'value': 'Vous devez sélectionner une image de profil.'
            });
            return false;
        }
        delete data.file;
        let file =  file_element.prop('files')[0];

        let formData = new FormData()
        formData.append('profile_img', file)
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        data = formData;
        file_element.val(null);
    }

    methodsFunctions(method_name, methods[method_name], data, has_file)
    update();
});


//FILES
function isImage(file) {
    let parts = file.split('.');
    let ext = parts[parts.length - 1];
    let exts = ['jpg', 'jpeg', 'png'];
    return exts.includes(ext.toLowerCase());
}

body.on('change', 'input[type=file]', e => {
    if(!isImage(e.target.value)) {
        UpdatePopup(null, {
            'type': 'error',
            'value': 'Vous devez sélectionner une image.'
        });
        e.target.value = null;
    }
})