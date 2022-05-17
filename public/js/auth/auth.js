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

//CONFIRM CGU POPUP
const cgu_popup = $('#register-cgu-popup');
function toggleCguForm(active = true) {

    //VERIF PASSWORD SECURITY
    let password = document.querySelector('#auth-input-new-pass').value;
    let confirm_password = document.querySelector('#auth-input-confirm-pass').value;
    if(checkPass(password).length > 0 && password.length > 0) {
        return sendNotification({
            type: "error",
            value: "Le mot de passe n'est pas assez sécurisé."
        })
    } //VERIF PASSWORDS CORRESPONDANCE
    else if(!checkConfirmPass(confirm_password) && confirm_password.length > 0) {
        return sendNotification({
            type: "error",
            value: "Les mot de passe ne correspondent pas."
        })
    }

    if(active) {
        overlay.show();
        cgu_popup.css('animation', 'open-popup 0.3s')
        cgu_popup.show();
    }else {
        overlay.hide();
        cgu_popup.css('animation', 'close-popup 0.3s')
        setTimeout(function () {
            cgu_popup.hide();
        }, 280)
    }
}

body.on('click', '#register-cgu-popup-btn-open', e => {
    e.preventDefault();
    toggleCguForm()
})

body.on('click', '#register-cgu-popup-btn-close', e => {
    e.preventDefault();
    toggleCguForm(false)
})

//HIDE/SHOW PASSWORD VALUE
feather.replace();

const eye = $('.feather-eye');
const eye_off = $('.feather-eye-off');
const passwordFields = $('input[type=password]');

eye.click(function() {
    eye.hide();
    eye_off.show();
    passwordFields.attr('type', 'password');
})

eye_off.click(function() {
    eye_off.hide();
    eye.show();
    passwordFields.attr('type', 'text');
})

//VERIFY PASSWORD SECURITY
function checkPass(value) {

    const wrongs = [];

    const expressions = [
        {
            name: 'lowerCase',
            expression: /[a-z]/,
            wrong_message: 'Doit contenir au moins 1 Minuscule'
        },
        {
            name: 'upperCase',
            expression: /[A-Z]/,
            wrong_message: 'Doit contenir au moins 1 Majuscule'
        },
        {
            name: 'number',
            expression: /[0-9]/,
            wrong_message: 'Doit contenir au moins 1 Chiffre'
        },
        {
            name: 'specialChar',
            expression: /[$@!%*#&\[\]\\\/()\-+:,?;§^.}{]/,
            wrong_message: 'Doit contenir au moins 1 Caractère Spécial ($@!%*#&][}{\/()-+:,?;§^.)'
        }
    ]

    expressions.forEach(e => {
        if(!e.expression.test(value)) wrongs.push(e.wrong_message);
    })

    const min_length = 6;

    if(value.length < min_length) wrongs.push(`Doit contenir au minimum ${min_length} Caractères`)

    return wrongs;
}

body.on('input', '#auth-input-new-pass', e => {
    const icons = $(`[data-target="${e.target.id}"]`)

    icons.hide();
    let wrongs = checkPass(e.target.value);
    if(wrongs.length <= 0) {
        $(`[data-target="${e.target.id}"].success`).show();
        e.target.style.color = 'var(--success)';
    }else {
        $(`[data-target="${e.target.id}"].wrong`).show();
        e.target.style.color = 'var(--error)';
    }

    const wrongs_list = document.querySelector('#password-security-popup-list');
    wrongs_list.innerHTML = '';
    wrongs.forEach(w => {
        wrongs_list.innerHTML += `<li>${w}</li>`;
    })
})

const password_security_popup = $('#password-security-popup');
const password_secutiry_popup_btn = $(`[data-target="auth-input-new-pass"].wrong`);
password_secutiry_popup_btn.mousemove(function () {
    password_security_popup.show();
})

password_secutiry_popup_btn.mouseleave(function () {
    password_security_popup.hide();
})

//VERIFY CONFIRM PASSWORD
function checkConfirmPass(value) {
    let new_pass = document.querySelector('#auth-input-new-pass').value;
    let confirm_pass = document.querySelector('#auth-input-confirm-pass').value;

    return new_pass === confirm_pass;
}

body.on('input', '#auth-input-confirm-pass', e => {
    const icons = $(`[data-target="${e.target.id}"]`)

    icons.hide();
    let check = checkConfirmPass(e.target.value);
    if(check) {
        $(`[data-target="${e.target.id}"].success`).show();
        e.target.style.color = 'var(--success)';
    }else {
        $(`[data-target="${e.target.id}"].wrong`).show();
        e.target.style.color = 'var(--error)';
    }
})

const password_confirm_popup = $('#password-confirm-popup');
const password_confirm_popup_btn = $(`[data-target="auth-input-confirm-pass"].wrong`);
password_confirm_popup_btn.mousemove(function () {
    password_confirm_popup.show();
})

password_confirm_popup_btn.mouseleave(function () {
    password_confirm_popup.hide();
})