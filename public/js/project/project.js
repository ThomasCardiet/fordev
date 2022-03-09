/************** VARS PROPERTIES *************/

let project_id = parseInt(location.href.split('/')[location.href.split('/').length-1]);

/************** LINKS PROPERTIES *************/

menus = {
    informations: 0,
    contributors: 1,
    roles: 2,
    tools: 3,
}
first_menu = menus.contributors; //instance de menus

resetContent(false);

/************** AJAX PROPERTIES *************/

//SECTIONS OF PROFILE
sections = {
    informations: 'informations',
    contributors: 'contributors',
    roles: 'roles',
    tools: 'tools'
}

//FONCTIONS AJAX
methods = {
    /*Get methods*/

    /*ROLES*/
    getRoles: {
        function: {
            section: sections.roles,
        },
        update: true,
        type: 'get',
        style: 'list',
        params: {
            target: '#content-roles-list',
            data: 'roles',
            count: true,
            bubble: false,
            popup: null,
            popup_update: false,
            need_popup_data: false,
        },
        data: {
          'project_id': project_id
        },
        store_data: true
    },

    /*CONTRIBUTORS*/
    getContributors: {
        function: {
            section: sections.contributors,
        },
        update: true,
        type: 'get',
        style: 'list',
        params: {
            target: '#content-contributors-list',
            data: 'contributors',
            count: true,
            bubble: false,
            popup: null,
            popup_update: false,
            need_popup_data: false,
        },
        data: {
            'project_id': project_id
        }
    },

    /*Update methods*/

    /*PROJECT*/

    /*CONTRIBUTORS*/
    updateContributor: {
        function: {
            section: sections.contributors,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    addContributor: {
        function: {
            section: sections.contributors,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    removeContributor: {
        function: {
            section: sections.contributors,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    /*ROLES*/
    createRole: {
        function: {
            section: sections.roles,
        },
        update: false,
        type: 'action',
        close_popup: true,
        style: 'message',
        form: {
            name: 'create-role',
            data: {
                name: {
                    can_empty: false,
                    reset: true,
                    error_message: 'Vous devez saisir un Nom de rôle.',
                },
                color: {
                    can_empty: false,
                    reset: true,
                    error_message: 'Vous devez saisir une couleur.',
                }
            }
        }
    },

    removeRole: {
        function: {
            section: sections.roles,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },
}

setUpdate();