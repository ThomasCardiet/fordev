/************** LINKS PROPERTIES *************/

menus = {
    informations: 0,
    contributors: 1,
    roles: 2,
    tools: 3,
}
first_menu = menus.roles; //instance de menus

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

    /*PROJECT*/

    /*CONTRIBUTORS*/
    getContributors: {
        function: {
            section: sections.contributors,
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

    /*ROLES*/
    getRoles: {
        function: {
            section: sections.roles,
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

    /*Update methods*/

    /*PROJECT*/

    /*CONTRIBUTORS*/
    addContributor: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    removeContributor: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    /*ROLES*/
    createRole: {
        function: {
            section: sections.projects,
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
                    error_message: 'Vous devez saisir un Nom de rôle.',
                },
                color: {
                    can_empty: false,
                    error_message: 'Vous devez saisir une couleur.',
                }
            }
        }
    },

    removeRole: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },
}

setUpdate();