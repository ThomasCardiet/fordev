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
        section: sections.roles,
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
        section: sections.contributors,
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

    /*RELATIONS*/
    getFriends: {
        section: sections.contributors,
        update: false,
        type: 'get',
        style: 'list',
        params: {
            target: '.contributor-add-list-list',
            data: 'users',
            count: false,
            bubble: false,
            popup: 'contributor-add',
            popup_update: true,
            need_popup_data: false,
        },
        data: {
            'filter': 'contributors'
        }
    },

    getUnfriendUsers: {
        section: sections.contributors,
        update: false,
        type: 'get',
        style: 'list',
        params: {
            target: '.contributor-add-list-list',
            data: 'users',
            count: false,
            bubble: false,
            popup: 'contributor-add',
            popup_update: true,
            need_popup_data: false,
        },
        data: {
            'filter': 'contributors'
        }
    },

    getPublicUsers: {
        section: sections.contributors,
        update: false,
        type: 'get',
        style: 'list',
        params: {
            target: '.contributor-add-list-list',
            data: 'users',
            count: false,
            bubble: false,
            popup: 'contributor-add',
            popup_update: true,
            need_popup_data: false,
        },
        data: {
            'filter': 'contributors'
        }
    },


    /*Update methods*/

    /*PROJECT*/

    /*CONTRIBUTORS*/
    updateContributor: {
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    addContributor: {
        type: 'action',
        close_popup: false,
        style: 'message',
        data: {
            'project_id': project_id
        }
    },

    removeContributor: {
        type: 'action',
        close_popup: false,
        style: 'message'
    },

    /*ROLES*/
    createRole: {
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
        type: 'action',
        close_popup: false,
        style: 'message'
    },
}

setUpdate();

/************** SHARE PART *************/

//Change share type
body.on('change', '.update-share-btn', e => {
    let target = $(e.target).data('target');
    $(`#${target}`).data('type', e.target.value)
})

//Share Forms
let share_forms = {
    'contributor-add-new': {
        fields: {
            name: 'text',
            surname: 'text',
            email: 'mail'
        },
        pattern: 'auth?type=register&p=%project_id%&name=%name%&surname=%surname%&email=%email%'
    }
}

//Share button
body.on('click', '.share-btn', e => {

    //ERROR NO TYPE DEFINED
    if($(e.target).data('type') === undefined) {
        let message = {
            type: 'error',
            value: 'Vous devez choisir un type de partage'
        };

        return current_popup !== null ? UpdatePopup(null, message) : sendNotification(message);
    }

    let share_type = $(e.target).data('type');

    let message = {
        type: 'success',
        value: `L'invitation a été envoyée par ${share_type}`
    };

    //Form increment
    let form = share_forms[$(e.target).data('form')];
    if(form === undefined) return;

    switch (share_type) {
        case 'own_means':

            if($(e.target).next().length > 0 && $(e.target).next().attr('class').includes('share-link-block')){
                message = {
                    type: 'error',
                    value: `L'invitation a déjà été générée.`
                };
                break;
            }


            //Update pattern form entries
            let link = form.pattern;
            let has_empty = false;
            Object.keys(form.fields).forEach(f => {
                let form_input = $(`.${$(e.target).data('form')}-${f}`);
                if(form_input.val().length <= 0) has_empty = true;
                link = link.replace(`%${f}%`, form_input.val())
            })

            if(has_empty) {
                message = {
                    type: 'error',
                    value: `Vous devez remplir tous les champs.`
                };
                break;
            }

            link = link.replace(`%project_id%`, project_id)

            let link_block = document.createElement('div');
            link_block.innerHTML +=
                `<input type="text" value="${window.location.origin}/${link}">` +
                '<button class="share-link-copy">Copier</button>';
            link_block.classList.add('share-link-block');
            e.target.after(link_block);

            message = {
                type: 'success',
                value: `Vous pouvez copier le lien d'invitation apparu`
            };
            break;

        default:
            break;
    }

    return current_popup !== null ? UpdatePopup(null, message) : sendNotification(message);
});

//COPY
body.on('click', '.share-link-copy', e => {
    let input = $(e.target).prev()[0];
    input.select();
    input.setSelectionRange(0, 99999)
    document.execCommand("copy");
    sendNotification({
        type: 'success',
        value: `Le lien a été copié.`
    });
});