let url = `/ajax`;

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

//DATA STORAGE
let requests_data = {};

//SECTIONS OF PROFILE
let sections = {}

//FONCTIONS AJAX
let methods = {}

let img_paths = {
    pp: {
        path: '../img/profile/users/',
        unknown_path: '../img/profile/unknown.png'
    },
    img: {
        path: '../img/profile/projects/',
        unknown_path: '../img/profile/unknown_project.png'
    }
}

//IS OCCUPED
let is_occuped = false;

function methodsFunctions(name, value, data = {}, containFile = false) {

    //INCREMENT FUNCTIONS DATAS
    if(value.data !== undefined) {
        data = {
            ...data,
            ...value.data
        }
    }

    //PREVENT FILE FORM BEFORE
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

                    //UPDATE REQUESTS STORAGE
                    if(value.store_data !== undefined && value.store_data) {
                        requests_data[value.params.data] = response.data.values;
                    }

                    /*Switch of style*/
                    switch (value.style) {

                        //List style
                        case 'list':

                            //Get list element
                            let list = $(value.params.target);

                            //Counter update element (if param count is true)
                            let counter = value.params.count ? $(`${value.params.target}-count`) : null;
                            let split_target = value.params.target.split('-');
                            let bubble = value.params.bubble ? $(`#${split_target[0].substr(1)}-${
                                split_target[split_target.length-1]
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

                                let fields = html.match(/\%.+?\%/g);

                                //HAS SPECIAL FIELDS
                                let special_fields = fields.filter(f => f.split('.').length > 1);
                                if(special_fields.length > 0) {
                                    special_fields.forEach(sf => {

                                        //SET PARAMS of type: type.data{field1,field2,...}
                                        sf = sf.replaceAll('%', '');
                                        let type = sf.split('.')[0];
                                        let data = sf.split('.')[1];
                                        let data_params = data.match(/\{.+?\}/g)[0]
                                        data = data.replaceAll(data_params, '');
                                        data_params = data_params.replaceAll('{', '').replaceAll('}', '').split(',');

                                        switch (type) {

                                            //SELECT TYPE
                                            case 'select':

                                                let current_value = {
                                                    field: data.split('?')[1],
                                                    value: -1
                                                };
                                                data = data.replace(`?${current_value.field}`, '');

                                                current_value['value'] = requests_data[data].find(d => d[data_params[0]] === o[current_value.field]);

                                                //IF HAS NO ROLE
                                                if(o[current_value.field] === -1) current_value.value = -1;

                                                let sf_html = '';

                                                sf_html += `<option value="${current_value.value === -1 ? -1 : current_value.value[data_params[0]]}">${current_value.value === -1 ? 'Aucun' : current_value.value[data_params[1]]}</option>`

                                                requests_data[data].forEach(d => {
                                                    if(d[data_params[0]] === o[current_value.field]) return;
                                                    sf_html += `<option value="${d[data_params[0]]}">${d[data_params[1]]}</option>`
                                                })

                                                html = html.replace(`%${sf}%`, sf_html)
                                                break;
                                        }
                                    })
                                }

                                for (let [key, value] of Object.entries(o)) {
                                    if(value === null) value = 0;
                                    html = html.replaceAll(`%${key}%`, key.includes('_at') ? formatDate(value) : value);
                                }

                                let classList = $(model).attr('class').split(' ').filter(v => v !== 'model').toString().replaceAll(',', ' ');
                                list[0].innerHTML +=
                                    `<li ${classList.length ? `class="${classList}"` : ''}>
                                        ${o['owner'] !== undefined && o['owner'] === '1' ? '<i class="fas fa-crown"></i>' : ''}
                                        ${html}
                                    </li>`;

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

                                // Get Fields Categories
                                case 'getFieldCategories':
                                case 'getFields':
                                case 'getMenus':
                                case 'getForumCategories':

                                    $(`[data-update="${name}"]`).each(function () {

                                        const el = $(this);
                                        switch (el.prop('nodeName').toLowerCase()) {

                                            // SELECT INCREMENT
                                            case 'select':

                                                // INCREMENT MISSING
                                                let missings = values.filter(v => Object.values(this.children).filter(child => v.id === child.value).length <= 0);
                                                if (missings.length > 0) {
                                                    missings.forEach(miss => {
                                                        this.innerHTML += `<option value="${miss.id}">${miss.name}</option>`
                                                    });
                                                }

                                                // INCREMENT REMOVED
                                                let removed = Object.values(this.children).filter(child => values.filter(v => child.value === v.id).length <= 0 && child.value !== '-1');
                                                if (removed.length > 0) {
                                                    removed.forEach(rem => {
                                                        rem.remove();
                                                    });
                                                }

                                                break;

                                        }
                                    });

                                    //Update values block
                                    let fieldCategoryColumns = document.querySelectorAll('[data-fieldCategory_id]');
                                    let missings = [];
                                    let removed = [];
                                    switch (name) {
                                        case 'getFieldCategories':

                                            // INCREMENT MISSING
                                            missings = values.filter(v => Object.values(fieldCategoryColumns).filter(column => v.id === column.dataset.fieldcategory_id).length <= 0);
                                            if (missings.length > 0) {
                                                missings.forEach(miss => {

                                                    let others = fieldCategoryColumns[fieldCategoryColumns.length - 1];
                                                    let newFieldCategoryColumn = document.createElement('div');

                                                    newFieldCategoryColumn.dataset.fieldcategory_id = miss.id;
                                                    newFieldCategoryColumn.classList.add('col-lg-4');
                                                    newFieldCategoryColumn.innerHTML +=
                                                        '            <div class="card shadow mb-4">' +
                                                        '                <div class="card-header py-3">' +
                                                        `                    <h6 class="m-1 font-weight-bold text-primary">${miss.name}</h6>` +
                                                        `                    <button class="ajax-btn btn btn-danger" type="button" data-method="removeFieldCategory" data-category_id="${miss.id}">` +
                                                        '                        Supprimer' +
                                                        '                    </button>' +
                                                        '                </div>' +
                                                        '                <div class="card-body"></div>' +
                                                        '            </div>'

                                                    others.parentElement.insertBefore(newFieldCategoryColumn, others)
                                                });
                                            }

                                            // INCREMENT REMOVED
                                            removed = Object.values(fieldCategoryColumns).filter(column => values.filter(v => column.dataset.fieldcategory_id === v.id).length <= 0 && column.dataset.fieldcategory_id !== '-1');
                                            if (removed.length > 0) {
                                                removed.forEach(rem => {
                                                    rem.remove();
                                                });
                                            }

                                            break;
                                        case 'getFields':

                                            fieldCategoryColumns.forEach(column => {
                                                let columnFields = values.filter(v => v.category_id === null ? column.dataset.fieldcategory_id === '-1' : v.category_id === column.dataset.fieldcategory_id)
                                                let fieldsBlock = column.querySelector('.card-body');
                                                let fieldLines = fieldsBlock.children;

                                                // INCREMENT MISSING
                                                missings = columnFields.filter(v => Object.values(fieldLines).filter(child => child.dataset.field_id !== undefined && v.id === child.dataset.field_id).length <= 0);
                                                if (missings.length > 0) {
                                                    missings.forEach(miss => {
                                                        fieldsBlock.innerHTML +=
                                                            `         <div class="input-group mb-3" data-field_id="${miss.id}">` +
                                                            `              <i class="fas fa-info-circle info-bubble" data-toggle="tooltip" data-placement="top" title="Modification du champ ${miss.name} | édité le ${formatDate(miss.edited_at)} par ${miss.last_user_edit_username}"></i>` +
                                                            `              <input id="update-field-field_value_${miss.id}" type="text" class="form-control bg-light border-0 small" placeholder="${miss.name}" value="${miss.value}">` +
                                                            `              <button class="ajax-btn btn btn-primary h-25" type="button" data-method="updateField" data-field_id="${miss.id}">` +
                                                            '                   Modifier' +
                                                            '              </button>' +
                                                            `              <button class="ajax-btn btn btn-danger h-25" type="button" data-method="removeField" data-field_id="${miss.id}">` +
                                                            '                   Supprimer' +
                                                            '              </button>' +
                                                            '          </div>'
                                                    });
                                                }

                                                removed = Object.values(fieldLines).filter(child => child.dataset.field_id !== undefined && values.filter(v => child.dataset.field_id === v.id).length <= 0);
                                                if (removed.length > 0) {
                                                    removed.forEach(rem => {
                                                        rem.remove();
                                                    });
                                                }

                                            });

                                            break;

                                        case 'getMenus':

                                            let menusColumn = document.querySelector('#menus-list');
                                            let menusBlock = menusColumn.querySelector('.card-body');
                                            let menusLines = menusBlock.children;

                                            // INCREMENT MISSING
                                            missings = values.filter(v => Object.values(menusLines).filter(child => child.dataset.menu_id !== undefined && v.id === child.dataset.menu_id).length <= 0);
                                            if (missings.length > 0) {
                                                missings.forEach(miss => {
                                                    menusBlock.innerHTML +=
                                                        `         <div class="input-group mb-3" data-menu_id="${miss.id}">` +
                                                        `              <i class="fas fa-info-circle info-bubble" data-toggle="tooltip" data-placement="top" title="Modification du champ ${miss.name} (${miss.path}) | édité le ${formatDate(miss.edited_at)} par ${miss.last_user_edit_username}"></i>` +
                                                        `              <input id="update-menu-menu_name_${miss.id}" type="text" class="form-control bg-light border-0 small" placeholder="${miss.name}" value="${miss.name}">` +
                                                        `              <input type="text" value="${miss.path}" disabled="disabled" />` +
                                                        `              <button class="ajax-btn btn btn-danger h-25" type="button" data-method="removeMenu" data-menu_id="${miss.id}">` +
                                                        '                   Supprimer' +
                                                        '              </button>' +
                                                        '          </div>'
                                                });
                                            }

                                            removed = Object.values(menusLines).filter(child => child.dataset.menu_id !== undefined && values.filter(v => child.dataset.menu_id === v.id).length <= 0);
                                            if (removed.length > 0) {
                                                removed.forEach(rem => {
                                                    rem.remove();
                                                });
                                            }

                                            break;


                                        case 'getForumCategories':

                                            let categoriesColumn = document.querySelector('#forum-categories-list');
                                            let categoriesBlock = categoriesColumn.querySelector('.card-body');
                                            let categoriesLines = categoriesBlock.children;

                                            // INCREMENT MISSING
                                            missings = values.filter(v => Object.values(categoriesLines).filter(child => child.dataset.menu_id !== undefined && v.id === child.dataset.menu_id).length <= 0);
                                            if (missings.length > 0) {
                                                missings.forEach(miss => {
                                                    categoriesBlock.innerHTML +=
                                                        `         <div class="input-group mb-3" data-menu_id="${miss.id}">` +
                                                        `              <i class="fas fa-info-circle info-bubble" data-toggle="tooltip" data-placement="top" title="Modification de la catégorie ${miss.name} "></i>` +
                                                        `              <input id="update-menu-menu_name_${miss.id}" type="text" class="form-control bg-light border-0 small" placeholder="${miss.name}" value="${miss.name}">` +
                                                        `              <button class="ajax-btn btn btn-danger h-25" type="button" data-method="removeMenu" data-menu_id="${miss.id}">` +
                                                        '                   Supprimer' +
                                                        '              </button>' +
                                                        '          </div>'
                                                });
                                            }

                                            removed = Object.values(categoriesLines).filter(child => child.dataset.menu_id !== undefined && values.filter(v => child.dataset.menu_id === v.id).length <= 0);
                                            if (removed.length > 0) {
                                                removed.forEach(rem => {
                                                    rem.remove();
                                                });
                                            }

                                            break;
                                    }

                                    break;

                                //GET FILE CONTENT
                                case 'getFile':

                                    editor_datas.values = values;

                                    editor_block.show();
                                    editor_loader.hide();

                                    let template_editor_textarea = $('#template-editor-textarea');
                                    template_editor_textarea.val(values);

                                    //CREATE DEVELOPER EDITOR
                                    if(editor_datas.editor === null) editor_datas.editor = CodeMirror.fromTextArea(template_editor_textarea[0], {
                                        mode: "text/html",
                                        lineNumbers : true,
                                        lineWrapping: true,
                                        theme: 'dracula',
                                        foldGutter: true,
                                        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                                        extraKeys: {
                                            "F11": function(cm) {
                                                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                                            },
                                            "Esc": function(cm) {
                                                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                                            },
                                            "Ctrl-Q": function(cm){
                                                cm.foldCode(cm.getCursor());
                                            },
                                            "Ctrl-Space": "autocomplete"
                                        },
                                    })
                                    else editor_datas.editor.setValue(values)

                                    editor_datas.balises = values.match(/\<.+?\>/g);

                                    editor_datas.template_schema = getTemplate(editor_datas.balises);

                                    editor_commercial.innerHTML = displayTemplate(editor_datas.template_schema);

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

                            let message = {
                                type: response.data.status,
                                value: response.data.msg
                            };

                            current_popup !== null ? UpdatePopup(null, message) : sendNotification(message);

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

    //IF IS OCCUPIED
    if(is_occuped) return;

    for (const [key, value] of Object.entries(methods)) {

        if(value.type === 'action') continue;

        //FOR ALL UPDATE FUNCTIONS
        if(all && value.update) {
            methodsFunctions(key, value, current_popup === null ? {} : popup_data);
            continue;
        }

        //IF NOT IN CURRENT SECTION AND GET METHOD
        if((value.section !== undefined && value.section !== current_menu) || value.params === undefined) continue;

        if((current_popup === null && value.update)
            || (value.params.popup !== null && value.params.popup === current_popup && value.params.popup_update)) {

            if(value.params.need_popup_data && Object.keys(popup_data).length === 0

            //HAS FILTER
            || (value.params.target !== undefined && $(value.params.target).data('filter') !== undefined && $(value.params.target).data('filter') !== key)) continue;

            methodsFunctions(key, value, current_popup === null ? {} : popup_data);
        }
    }
}

//SET UPDATE
let update_interval = null;
function setUpdate(all = true) {
    if(update_interval !== null) clearInterval(update_interval);
    else update(all);
    update_interval = setInterval(update, 5000);
}

//Stop interval when popup is open
body.on('click', '.popup-btn', e => {
    update();
    setUpdate();
})

function useMethodsByElement(e, special_data = {}) {

    let method_name = e.data('method');
    let data = {
        ...e.data(),
        ...special_data
    };

    let method = methods[method_name];

    // HAS FORM
    let has_file = false;
    switch (data.method) {

        default:

            if(method.form === undefined) break;

            let fields = []

            //CREATE FIELDS
            for (const [field, options] of Object.entries(method.form.data)) {

                // MANUALLY INCREMENT IN DATA
                if(e.data(field) !== undefined) {
                    fields[field] = e.data(field);
                    continue;
                }

                // IS FILE
                if(options.file) has_file = true;

                let input = $(`#${method.form.name}-${field}${options.need_id !== undefined ? `_${data[options.need_id]}` : ''}`);
                let value = input.val();
                if(value.length === 0 && !options.can_empty) {

                    let message = {
                        'type': 'error',
                        'value': options.error_message
                    };

                    return current_popup !== null ? UpdatePopup(null, message) : sendNotification(message);
                }

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

}

//AJAX BUTTONS
body.on('click', '.ajax-btn', e => {
    useMethodsByElement($(e.target))
});

//AJAX SELECT
body.on('change', 'select', e => {
    let element = $(e.target);
    if(!element.data('method')) return false;
    let data = {}
    data[element.data('field_name')] = element.val();
    useMethodsByElement(element, data);
});

//AJAX TEXT INPUT
body.on('input', '.ajax-search', e => {
    setTimeout(function () {
        popup_data.search = e.target.value;
        update();
    }, 1);
})

//AJAX SELECT FILTER
body.on('change', '.ajax-filter', e => {
    $($(e.target).data('target')).data('filter', e.target.value)
    update();
})

//FILES
function verifyFile(file, extensions) {
    if(extensions === null) return true;

    let parts = file.split('.');
    let ext = parts[parts.length - 1];
    return extensions.includes(ext.toLowerCase());
}

//FILE INPUT
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

//USER OCCUPED

//Enter in select
body.on('click', 'select', e => {
    if(e.target.classList.contains('ajax-filter')) return;
    is_occuped = true;
});

//Exit of select
body.on('blur', 'select', e => {
    is_occuped = false;
});