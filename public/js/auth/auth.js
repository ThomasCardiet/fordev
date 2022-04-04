//GET PARAMS
params = {};
window.location.href.split('/').pop().split('?').pop().split('&').forEach(f => {
    f = f.split('=');
    params[f[0]] = f[1];
})

//FORGET PASSWORD
let forget_btn = $('#forget-pass');
let forget_content = $("#forget-content");

forget_btn.click(function () {
    if (forget_content[0].style.maxHeight) {
        forget_content[0].style.maxHeight = null;
        forget_content.find(">:last-child").remove();
        forget_content.hide();
    } else {
        forget_content.show();
        forget_content[0].innerHTML += '<button type="submit" name="forget_submit">Envoyer</button>';
        forget_content[0].style.maxHeight = forget_content[0].scrollHeight + 1 + "px";
    }
})

//CHANGE AUTH TYPE
let change_btn = $('.auth-toggle');
let auth_blocks = $('.auth-block');
let animation_duration = 0.8

auth_blocks.css("animationDuration", `${animation_duration}s`);

let auth_types = {
    login: 0,
    register: 1
}

//FIRST AUTH MENU
first_auth = $('#sign-in').find('.error_msg').length > 0 ? auth_types.register : auth_types.login;

changeAuthType(params['type'] !== undefined && auth_types[params['type']] !== undefined ? auth_types[params['type']] : first_auth, false);

function changeAuthType(type = auth_types.login, animation = true) {

    let auth_type = Object.keys(auth_types).find(key => auth_types[key] === parseInt(type));

    auth_blocks.each(i => {
        if(i !== parseInt(type)) {
            if(animation) auth_blocks[i].style.animationName = `glissement-left-right-${auth_type}`;
            setTimeout(function () {
                $(auth_blocks[i]).hide();
            }, (animation-0.3)*1000)
        }
    })
    setTimeout(function () {
        $(auth_blocks[type]).show();
        if(animation) auth_blocks[type].style.animationName = `glissement-right-left-${auth_type}`;
    }, (animation-0.3)*1000)
}

change_btn.click(function () {
    changeAuthType(this.dataset.change);
})