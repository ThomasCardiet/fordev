/************** AJAX PROPERTIES *************/

url = 'ajax';
const page = window.location.href.split('/')[window.location.href.split('/').length - 1];
let current_menu = page;

//FONCTIONS AJAX
methods = {
    /*Get methods*/

    getFieldCategories: {
        section: 'fields',
        update: true,
        type: 'get',
        style: null,
        params: {
            data: 'fieldCategories',
        },
    },

    getFields: {
        section: 'fields',
        update: true,
        type: 'get',
        style: null,
        params: {
            data: 'fields',
        },
    },

    getFile: {
        section: 'templates',
        update: false,
        type: 'get',
        style: null,
        params: {
            data: 'file',
        },
    },

    /*Update methods*/
    createFieldCategory: {
        type: 'action',
        close_popup: false,
        style: 'message',
        form: {
            name: 'create-field-category',
            data: {
                category_name: {
                    file: false,
                    can_empty: false,
                    reset: true,
                    error_message: 'Vous devez saisir un nom de catégorie.'
                },
            }
        }
    },

    removeFieldCategory: {
        type: 'action',
        close_popup: false,
        style: 'message',
        form: {
            name: 'remove-field-category',
            data: {
                category_id: {
                    file: false,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez saisir un ID de catégorie.'
                },
            }
        }
    },

    createField: {
        type: 'action',
        close_popup: false,
        style: 'message',
        form: {
            name: 'create-field',
            data: {
                field_name: {
                    file: false,
                    can_empty: false,
                    reset: true,
                    error_message: 'Vous devez saisir un nom de champ.'
                },
                field_value: {
                    file: false,
                    can_empty: false,
                    reset: true,
                    error_message: 'Vous devez saisir une valeur de champ.'
                },
                category_id: {
                    file: false,
                    can_empty: true,
                    reset: false,
                    error_message: 'Vous devez choisir une catégorie.'
                },
            }
        }
    },

    removeField: {
        type: 'action',
        close_popup: false,
        style: 'message',
        form: {
            name: 'remove-field',
            data: {
                field_id: {
                    file: false,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez saisir un ID de champ.'
                },
            }
        }
    },

    updateField: {
        type: 'action',
        close_popup: false,
        style: 'message',
        form: {
            name: 'update-field',
            data: {
                field_value: {
                    file: false,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez saisir une valeur de champ.',
                    need_id: 'field_id'
                },
            }
        }
    },

    updateFile: {
        type: 'action',
        close_popup: false,
        style: 'message',
    }
}

setUpdate(false);

/************** PAGES JS *************/
// TEMPLATES GLOBAL VARIABLES AND FUNCTIONS
const editor_block = $('#template-editor-block');
const editor_loader = $('#template-editor-block-loader');
const editor_commercial = document.querySelector('#template-editor-block-commercial');
let editor_datas = {
    editor: null,
    template_schema: null,
    balises: null,
}

//GET NAME OF BALISE
function getBaliseName(balise, full = true) {
    let b_name = balise.replaceAll('<', '').replaceAll('>', '');
    return full ? b_name : b_name.split(' ')[0];
}

//MAKE KEY TO FIND BALISES
function makeKey(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

//GET BALISE OPTIONS
function getBaliseOptions(balise) {
    let splits = balise.split('>')[0].split(' ');
    let options = {};
    for(let i = 0; i<splits.length; i++) {
        let str = splits[i];
        if(!str.includes("=")) continue;
        if(str.slice(-1) !== "'" && str.slice(-1) !== '"') {
            for (let i2 = i+1; i2<splits.length; i2++) {
                str += splits[i2];
                if(splits[i2].slice(-1) === "'" || splits[i2].slice(-1) === '"') {
                    i = i2;
                    i2 = splits.length;
                }
            }
        }

        let option = str.split('=');
        if(option[0].includes('class') || option[0].includes('id')) continue;
        options[option[0]] = option[1].replaceAll('"', '').replaceAll("'", "");
    }

    return options;
}

//CREATE TEMPLATE
function getTemplate(balises) {
    let array = [];
    let current_balise = null
    let countSameBalise = 0;
    balises.forEach(balise => {

        if(current_balise === null) {

            let classname = balise.match(/class=".+?\"/g);
            let id = balise.match(/id=".+?\"/g);

            let obj = {
                balise: balise,
                childs: [],
                informations : {
                    name: getBaliseName(balise, false),
                    class: classname ? classname[0].replaceAll('class=', '').replaceAll('"', '') : null,
                    id: id ? id[0].replaceAll('id=', '').replaceAll('"', '') : null,
                    key: makeKey(15),
                    options: getBaliseOptions(balise),
                    modified: false
                }
            };

            // NO CHILD BALISE
            if(balises.filter(b => obj.informations.name === b.replaceAll('</', '').replaceAll('>', '').replaceAll(' ', '')).length <= 0) {

                array.push(obj);
                return;
            }

            current_balise = obj;
            return;
        }

        //FERMETURE BALISE
        if(balise.includes('</') && balise.replaceAll('</', '').replaceAll('>', '').replaceAll(' ', '') === current_balise.informations.name) {
            countSameBalise--;
            if(countSameBalise < 0) {
                current_balise.childs = getTemplate(current_balise.childs);
                array.push(current_balise);
                countSameBalise = 0;
                current_balise = null;
                return;
            }
            //OUVERTURE BALISE
        }else {
            if(current_balise.informations.name === getBaliseName(balise, false)) countSameBalise++;
        }
        current_balise.childs.push(balise);
    })

    return array;
}

//DISPLAY OBJ AS HTML ARCHITECTURE
function displayTemplate(array) {
    let html = '';
    html += '<ul>';
    array.forEach(obj => {

        if(obj.balise.includes('</') || obj.balise.includes('<!--')) {
            return;
        }

        if(obj.childs.length > 0) {
            let random = Math.floor(Math.random() * (999 - 99));
            html +=
                `<li data-balise_key="${obj.informations.key}">` +
                `   <span>` +
                `       <i class="fas fa-code"></i> ${obj.informations.name} ${obj.informations.id ? `[#${obj.informations.id}]` : obj.informations.class ? `[.${obj.informations.class}]` : ''}` +
                '           <span>' +
                `               <i class="fas fa-pen commercial-editor-popup-btn" data-balise_key="${obj.informations.key}" data-toggle="modal" data-target="#template-editor-block-commercial-popup"></i>` +
                `               <i class="fas fa-angle-right collapsed" data-toggle="collapse" data-target="#collapse-folder-${obj.informations.name}${random}"></i>` +
                '           </span>' +
                '   </span>' +
                `   <div id="collapse-folder-${obj.informations.name}${random}" class="collapse">` +
                displayTemplate(obj.childs) +
                '   </div>' +
                '</li>'
        }else {
            html +=
                `<li data-balise_key="${obj.informations.key}">` +
                `   <span><i class="fas fa-code"></i> ${obj.informations.name} ${obj.informations.id ? `[#${obj.informations.id}]` : obj.informations.class ? `[.${obj.informations.class}]` : ''}<span><i class="fas fa-pen commercial-editor-popup-btn" data-balise_key="${obj.informations.key}" data-toggle="modal" data-target="#template-editor-block-commercial-popup"></span></i></span>` +
                '</li>'
        }

    });
    html += '</ul>';
    return html;
}

switch (page.replaceAll('#', '')) {

    /************** USER TABLE REDIRECTION *************/
    case 'users':
        $('.table-users-line').click(function () {
            window.location.replace(`${window.location.origin}/admin/user/${$(this).data('user_id')}`);
        })
        break;

    /************** TEMPLATES SCRIPT *************/
    case 'templates':

        const files_btn = $('[data-file]');
        const current_file = $('#arbo-current-file');

        let current_file_path = null;

        files_btn.click(function () {
            current_file.html(`<i class="fas fa-file"></i> ${$(this).data('file')}`);
            current_file_path = $(this).data('path')
            editor_loader.show();
        })

        //UPDATE CODE THEME
        const theme_select = $('#template-editor-theme');
        theme_select.change(function () {
            editor_datas.editor.setOption("theme", this.options[this.selectedIndex].textContent);
        })

        //FIND BALISE WITH KEY
        function findModifiedBalise(list = editor_datas.template_schema) {

            let array = [];

            for (let i = 0; i<list.length; i++) {
                let balise = list[i];
                if(balise.informations.modified) {
                    array.push(balise);
                }
                let childs_find = findModifiedBalise(balise.childs);
                if(balise.childs.length > 0 && childs_find.length > 0) array = array.concat(childs_find);
            }

            return array;
        }

        //VALIDATION BTN
        const validate_btn = $('#template-validate-btn');
        validate_btn.click(function () {
            let method_name = 'updateFile';

            let value = editor_datas.editor.getValue();
            if(current_editor_type === editor_types.Commercial) {

                let modified_balises = findModifiedBalise();
                let lines = value.split('\n');

                //GET LINE NUMBER
                modified_balises.forEach(balise => {

                    let line_number = null;
                    switch (true) {

                        //HAS ID
                        case balise.informations.id !== null:
                            line_number = Object.entries(lines).find(obj => obj[1].includes(balise.balise))[0];
                            break;

                        //HAS CHILDS
                        case balise.childs.length > 0:

                            lines.forEach((line, i) => {
                                if(line.includes(balise.balise)) {

                                    let lines_child = lines.slice(i+1, i+11);
                                    lines_child = lines.slice(i+1, i+(11+lines_child.filter(l => l.length <= 0).length));
                                    if(lines_child.find(l => l.includes(balise.childs[0].balise))) line_number = i;
                                }
                            });
                            break;
                    }

                    //UPDATE LINE
                    if(line_number) {
                        let new_balise = `<${balise.informations.name}${balise.informations.id ? ` id="${balise.informations.id}"` : ''}${balise.informations.class ? ` class="${balise.informations.class}"` : ''}`;
                        if (Object.keys(balise.informations.options).length > 0) {
                            for (const [key, value] of Object.entries(balise.informations.options)) {
                                new_balise += ` ${key}="${value}"`;
                            }
                        }
                        new_balise += '>'
                        if (line_number) lines[line_number] = lines[line_number].replace(balise.balise, new_balise)

                        $('.modified').remove();
                    }
                });

                value = '';
                lines.forEach(line => {
                    value += `${line}\n`
                })
            }

            methodsFunctions(method_name, methods[method_name], {
                'path': current_file_path,
                'value': value
            });
        })

        //RESET BTN
        const reset_btn = $('#template-reset-btn');
        reset_btn.click(function () {
            editor_datas.editor.setValue(editor_datas.values)
            editor_datas.template_schema = getTemplate(editor_datas.balises);
            editor_commercial.innerHTML = displayTemplate(editor_datas.template_schema);
            $('.modified').remove();
            sendNotification({
                type: 'success',
                value: `Fichier réinitialisé.`
            })
        })

        //UPDATE EDITOR TYPE
        const editor_type_select = $('#template-editor-type');

        let editor_types = {
            developer: {
                value: 0,
                name: 'Développeur'
            },
            Commercial: {
                value: 1,
                name: 'Commercial'
            }
        }

        Object.values(editor_types).forEach(type => {
            editor_type_select.html(editor_type_select.html() + `<option value="${type.value}">${type.name}</option>`)
        })

        function showEditor(editor_type) {
            let template_editor_type = $('.template-editor-type');
            template_editor_type.hide();
            $(`.template-editor-type[data-type="${editor_type.value}"]`).show()
        }

        let current_editor_type = editor_types.developer;
        editor_type_select.change(function () {
            current_editor_type = editor_types[Object.keys(editor_types).find(key => editor_types[key].value === parseInt(this.value))];
            showEditor(current_editor_type);
        })

        showEditor(current_editor_type);

        //FIND BALISE WITH KEY
        function findBalise(key, list = editor_datas.template_schema) {

            for (let i = 0; i<list.length; i++) {
                let balise = list[i];
                if(balise.informations.key === key) {
                    return  balise;
                }
                let childs_find = findBalise(key, balise.childs);
                if(balise.childs.length > 0 && childs_find !== null)  return childs_find;
            }

            return null;
        }

        //UPDATE COMMERCIAL POPUP EDITOR
        let balise_popup = $('#template-editor-block-commercial-popup');

        //DISPLAY LIST OF OPTIONS IN POPUP
        function displayPopupBaliseOptions(balise) {
            let balise_popup_content = balise_popup.find('.modal-body');
            let content_html = '';

            //BALISE HAS OPTIONS
            if(Object.keys(balise.informations.options).length > 0) {

                content_html += '<table>'

                for(const [key, value] of Object.entries(balise.informations.options)) {
                    content_html +=
                        '<tr>' +
                        `    <td>${key}</td>` +
                        `    <td><input class="commercial-editor-update-input" type="text" value="${value}" placeholder="${key}"></td>` +
                        '</tr>';
                }

                content_html += '</table>'

                //BALISE NO OPTIONS
            } else content_html = 'Aucune Option.<br>';

            content_html += '<input type="text" placeholder="Option"><input type="text" placeholder="Valeur"><button id="commercial-editor-add-btn" type="button" class="btn btn-success">Ajouter</button>'

            balise_popup_content.html(content_html);
        }

        body.on('click', '.commercial-editor-popup-btn', e => {
            let balise = findBalise(e.target.dataset.balise_key);
            balise_popup.data('balise_key', balise.informations.key);
            balise_popup.find('.modal-title-baliseName').text(`'${balise.informations.name}'`)

            displayPopupBaliseOptions(balise);
        });

        //UPDATE COMMERCIAL EDITOR BUTTONS
        body.on('click', '#commercial-editor-update-btn', e => {
            let balise = findBalise(balise_popup.data('balise_key'));
            $('.commercial-editor-update-input').each(function () {
                if(balise.informations.options[this.placeholder] !== this.value) balise.informations.modified = true;
                balise.informations.options[this.placeholder] = this.value;
            });

            sendNotification({
                type: 'success',
                value: `Balise '${balise.informations.name}' modifiée.`
            })

            if(balise.informations.modified) $(`li[data-balise_key='${balise.informations.key}']`)[0].innerHTML += '<div class="modified"><i class="fas fa-wrench"></i></div>';
        });

        //ADD COMMERCIAL EDITOR OPTIONS
        body.on('click', '#commercial-editor-add-btn', e => {
            let balise = findBalise(balise_popup.data('balise_key'));
            let value_input = $(e.target).prev();
            let key_input = value_input.prev();
            if(value_input.val().length <= 0 || key_input.val().length <= 0) return sendNotification({
                type: 'error',
                value: `Tous les champs doivent être remplis.`
            })

            balise.informations.options[key_input.val()] = value_input.val();
            balise.informations.modified = true;

            displayPopupBaliseOptions(balise);
        });

        editor_block.hide();

        break;
}