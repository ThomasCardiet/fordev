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

changeAuthType(0, false);

function changeAuthType(type = 0, animation = true) {
    auth_blocks.each(i => {
        if(i !== parseInt(type)) {
            if(animation) auth_blocks[i].style.animationName = "glissement-left-right";
            setTimeout(function () {
                $(auth_blocks[i]).hide();
            }, (animation-0.3)*1000)
        }
    })
    setTimeout(function () {
        $(auth_blocks[type]).show();
        if(animation) auth_blocks[type].style.animationName = "glissement-right-left";
    }, (animation-0.3)*1000)
}

change_btn.click(function () {
    changeAuthType(this.dataset.change);
})