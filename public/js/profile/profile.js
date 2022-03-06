/************** LINKS PROPERTIES *************/

menus = {
    profile: 0,
    relations: 1,
    projects: 2,
    statistics: 3,
}
first_menu = menus.projects; //instance de menus

resetContent(false);

/************** AJAX PROPERTIES *************/

//SECTIONS OF PROFILE
sections = {
    user: 'user',
    relations: 'relations',
    projects: 'projects',
    stats: 'stats'
}

//FONCTIONS AJAX
methods = {

    /*Get methods*/

    /*USER*/
    getUserInformations: {
        function: {
            section: sections.user,
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
            section: sections.relations,
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
            section: sections.relations,
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
            section: sections.relations,
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
            section: sections.relations,
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
            section: sections.relations,
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

    /*PROJECTS*/
    getProjects: {
        function: {
            section: sections.projects,
        },
        update: false,
        type: 'get',
        style: 'list',
        params: {
            target: '.project-popup-list-list',
            data: 'users',
            count: true,
            bubble: false,
            popup: 'project-list',
            popup_update: true,
            need_popup_data: false,
        }
    },

    getProject: {
        function: {
            section: sections.projects,
        },
        update: false,
        type: 'get',
        style: null,
        params: {
            target: '.project-popup-preview',
            data: 'project',
            count: false,
            bubble: false,
            popup: 'project-preview',
            popup_update: true,
            need_popup_data: true,
        }
    },

    /*Update methods*/

    /*USER*/
    updateUser: {
        function: {
            section: sections.user,
        },
        update: false,
        type: 'action',
        close_popup: true,
        style: 'message',
        form: {
            name: 'update-user',
            data: {
                file: {
                    file: true,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez sélectionner une image de profil'
                }
            }
        }
    },

    /*RELATIONS*/
    addFriend: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },
    removeFriend: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: 'message'
    },
    sendMessage: {
        function: {
            section: sections.relations,
        },
        update: false,
        type: 'action',
        close_popup: false,
        style: null,
        form: {
            name: 'send-message',
            data: {
                msg: {
                    can_empty: false,
                    error_message: 'Vous devez saisir un message.',
                },
            }
        }
    },

    /*PROJECTS*/
    createProject: {
        function: {
            section: sections.projects,
        },
        update: false,
        type: 'action',
        close_popup: true,
        style: 'message',
        form: {
            name: 'create-project',
            data: {
                title: {
                    file: false,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez saisir un Nom de projet.'
                },
                description: {
                    file: false,
                    can_empty: true,
                    reset: false
                },
                file: {
                    file: true,
                    can_empty: false,
                    reset: false,
                    error_message: 'Vous devez sélectionner une image pour votre projet'
                }
            }
        }
    },
}

setUpdate();

/************** FRIEND LIST SCROLL *************/

$('#relations-img-list').bind('mousewheel DOMMouseScroll', e => {
    if(e.originalEvent.wheelDelta /120 > 0) e.target.scrollLeft += 40;
    else e.target.scrollLeft -= 40;
    return false
})

$('.relations-img').bind('mousewheel DOMMouseScroll', e => {
    let element = $('#relations-img-list')[0]
    if(e.originalEvent.wheelDelta /120 > 0) element.scrollLeft += 40;
    else element.scrollLeft -= 40;
    return false
})

/************** ADVANCED PROPERTIES *************/

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

/************** USER UPDATE FORM *************/

let account_type_fields = {
    visitor: 0,
    professional: 1
}

let account_professional_content = $('#user-popup-advanced-professional-content');
account_professional_content.hide();

body.on('change', 'input[name="account-type"]', e => {
    let account_type = $('input[name="account-type"]:checked').val();
    account_professional_content = $('#user-popup-advanced-professional-content');
    parseInt(account_type) === 1 ? account_professional_content.show() : account_professional_content.hide();
});

/*SKILLS*/

//ADD
body.on('click', '.professional-content-skill-list', e => {
    let element = $(e.target);
    toggleSkill(element, true)
});

//REMOVE
body.on('click', '.professional-content-skill-owned', e => {
    let element = $(e.target);
    if(!element.attr('class').includes('fas fa-times')) return;
    toggleSkill(element.parent())
});

let owned_skills = [];

function toggleSkill(e, add = false) {
    let skill = e.text();
    let skills_list = $('#professional-content-skills-list');
    let skills_owned = $('#professional-content-skills-owned');
    switch (add) {
        case true:
            owned_skills.push(skill);
            skills_owned.html(skills_owned.html() +
                `<li class="professional-content-skill-owned">${skill} <i class="fas fa-times"></i></li>`)
            break;
        case false:
            skill = skill.substring(0, skill.length - 1);
            owned_skills.splice(owned_skills.indexOf(skill), 1);
            skills_list.html(skills_list.html() +
                `<li class="professional-content-skill-list">${skill}</li>`)
            break;
    }
    e.remove();
}