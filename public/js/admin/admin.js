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

// TEMPLATES GLOBAL VARIABLES
let editor = null;
const editor_block = $('#template-editor-block');
const editor_loader = $('#template-editor-block-loader');

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
            editor.setOption("theme", this.options[this.selectedIndex].textContent);
        })

        //VALIDATION BTN
        const validate_btn = $('#template-validate-btn');
        validate_btn.click(function () {
            let method_name = 'updateFile';
            methodsFunctions(method_name, methods[method_name], {
                'path': current_file_path,
                'value': editor.getValue()
            });
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

        editor_block.hide();

        break;
}