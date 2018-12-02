
var characterPortraitHTML = $(
    '<div class="character-portrait">' +
    '<div class="photo"><img /></div>' +
    '<div class="status">Healthy</div>' +
    '<div class="ability"></div>' +
    '</div>'
);

var Character = function(role) {
    this.role = role;
    this.portrait = $("#game").append(characterPortraitHTML.clone());
    this.injury = null;
    this.display = function() {

    }
};
