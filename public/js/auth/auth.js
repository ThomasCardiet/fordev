//FORGET PASSWORD
let forget_btn = $('#forget-pass');

forget_btn.click(function () {
    let content = document.getElementById("forget-content");
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + 1 + "px";
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