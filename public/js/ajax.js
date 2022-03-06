const url = `${this.location.href}/ajax`;

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
let sections = {}

//FONCTIONS AJAX
let methods = {}

let img_paths = {
    pp: {
        path: 'img/profile/users/',
        unknown_path: 'img/profile/unknown.png'
    },
    image: {
        path: 'img/profile/projects/',
        unknown_path: 'img/profile/unknown_project.png'
    }
}

function methodsFunctions(name, value, data = {}, containFile = false) {

    if(!(data instanceof FormData)) popup_data = data;

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

                                //Update model
                                let html = $(model).html();

                                let paths = Object.keys(o).filter(k => k.includes('path'));
                                paths.forEach(path => {
                                    let p_field = path.split('_')[0];
                                    html = html.replaceAll("%img%", `<img src='${o[path] ? img_paths[p_field].path + o[path] : img_paths[p_field].unknown_path}' alt='#'>`);
                                })

                                for (const [key, value] of Object.entries(o)) {
                                    html = html.replaceAll(`%${key}%`, key.includes('_at') ? formatDate(value) : value);
                                }

                                let classList = $(model).attr('class').split(' ').filter(v => v !== 'model').toString().replaceAll(',', ' ');
                                list[0].innerHTML += `<li ${classList.length ? `class="${classList}"` : ''}>${html}</li>`;

                                //Liste d'amis scrollable
                                if(name === "getFriends") {
                                    let pp_path = o.pp_path ? `users/${o.pp_path}` : 'unknown.png'
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
                                case 'getConversation':
                                    let block_element = $(`${value.params.target}-block`)
                                    let target_element = $(`${value.params.target}-target`);

                                    let is_end_scroll = block_element[0].scrollHeight - block_element[0].scrollTop === block_element[0].clientHeight;
                                    if(target_element.html() !== response.data.target.username) is_end_scroll = true;

                                    block_element.html('');
                                    target_element.html(response.data.target.username);
                                    $('#send-message-btn').attr('data-target_id', response.data.target.id);
                                    values.forEach((v) => {

                                        v.content = v.content.replace(/\n\r?/g, '<br />');

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

                                    //UPDATE MODEL VALUE
                                    function updateModelValue(e) {

                                        let field = e.data('value');
                                        let obj = field.split('.');
                                        let type = field.split('|')[1];

                                        for (let [key, value] of Object.entries(values)) {

                                            let tries = [{
                                                field: field,
                                                key: key,
                                                value: value
                                            }];

                                            //IF VALUE IS OBJECT AND KEY IS (exemple.value)
                                            if(obj.length > 1 && typeof value === 'object') {
                                                for (const [obj_key, obj_value] of Object.entries(value)) {
                                                    tries.push({
                                                        field: obj[1],
                                                        key: obj_key,
                                                        value: obj_value
                                                    })
                                                }
                                            }

                                            //IF STYLE
                                            if(type) {
                                                switch (type) {
                                                    case 'list':
                                                        if(!Array.isArray(value)) break;

                                                        e.html('');
                                                        value.forEach(v => {
                                                            e.html(e.html() +
                                                                `<li data-target_id="${v.id}">${v.username}</li>`
                                                            )
                                                        })

                                                        break;
                                                }
                                            }

                                            tries.forEach(t => {
                                                if(t.field === t.key) e.html(t.value);
                                                if(t.key.includes('_path') && t.field === t.key.split('_')[0] && t.value !== null) {
                                                    e.attr('src', `${img_paths[t.field].path + t.value}?t=${new Date().getTime()}`);
                                                }
                                            })
                                        }
                                    }

                                    //UPDATE MODEL PARAM
                                    function updateModelParam(e) {

                                        let field = e.data('param');
                                        let param = field.split('|')[1];
                                        let value = field.split('|')[0];

                                        if(!param) return false;

                                        let data = value.match(/\%(.*)\%/)[1];

                                        e.attr(param, value.replace(`%${data}%`, popup_data[data]));

                                    }

                                    //MODIFICATION OF MODEL FOR ALL ELEMENTS CHILDRENS
                                    element.find("[data-value]").each(function () {
                                        updateModelValue($(this));
                                    })

                                    //MODIFICATION OF MODEL FOR ALL ELEMENTS CHILDRENS
                                    element.find("[data-param]").each(function () {
                                        updateModelParam($(this));
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

                    //CLOSE POPUP
                    if(value.close_popup) {
                        setTimeout(function () {
                            togglePopup(false, true);
                        }, 1000)
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

//Stop interval when popup is open
body.on('click', '.popup-btn', e => {
    update();
    setUpdate();
})

//AJAX BUTTONS
body.on('click', '.ajax-btn', e => {

    let method_name = $(e.target).data('method');
    let data = $(e.target).clone().data();

    let method = methods[method_name];
    let has_file = false;
    switch (data.method) {

        default:

            if(method.form === undefined) break;

            let fields = []
            let formData = null;

            //CREATE FIELDS
            for (const [field, options] of Object.entries(method.form.data)) {

                if(options.file) has_file = true;

                let input = $(`#${method.form.name}-${field}`);
                let value = input.val();
                if(value.length === 0 && !options.can_empty) return UpdatePopup(null, {
                    'type': 'error',
                    'value': options.error_message
                });

                if(options.file) {
                    has_file = true;
                    value = input.prop('files')[0];
                }
                fields[field] = value
                if(options.reset) input.val('');
            }

            //CREATE FORMDATA
            if(has_file) data = new FormData()

            for (const [field, value] of Object.entries(fields)) {
                has_file ? data.append(field, value) : data[field] = value;
            }



            break;
    }

    delete data.method;
    delete data.target;

    methodsFunctions(method_name, methods[method_name], data, has_file)
    update();
});


//FILES
function verifyFile(file, extensions) {
    if(extensions === null) return true;

    let parts = file.split('.');
    let ext = parts[parts.length - 1];
    return extensions.includes(ext.toLowerCase());
}

body.on('change', 'input[type=file]', e => {

    let data_file_type = $(e.target).data('file_type');
    let visual = $(`#${e.target.id}-visual`);

    let file_types = {
        image: {
            extensions: ['jpg', 'jpeg', 'png'],
            error_message: 'Vous devez sélectionner une image.',
            visual: visual
        },
        default: {
            extensions: null,
            error_message: 'Vous devez sélectionner un fichier.',
            visual: visual
        }
    }

    let file_type = data_file_type === undefined ? file_types.default : file_types[data_file_type];

    //VERIFICATIONS
    let error;

    let max_size = 5; //Mo
    switch (true) {

        //FILE EXTENSION
        case !verifyFile(e.target.value, file_type.extensions):
            error = file_type.error_message;
            break;

        //FILE SIZE
        case e.target.files[0].size > max_size*Math.pow(10,6):
            error = `La taille du fichier ne doit pas dépasser ${max_size} Mo.`;
            break;
    }

    if(error) {
        UpdatePopup(null, {
            'type': 'error',
            'value': error
        });
        e.target.value = null;
    }

    //VISUAL
    if(file_type.visual) {
        const file = e.target.files[0];
        if (file) {
            visual.attr('src',URL.createObjectURL(file));
        }
    }
})