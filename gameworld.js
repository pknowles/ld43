
var GameWorld = function(){
    this.characters = [];
    this.sledDistance = 10.0;

    this.getCharacter = function(role) {
        for (var i in this.characters) {
            if (this.characters[i].role == role) {
                return this.characters[i];
            }
        }
        return null;
    }

    this.display = function() {
        for (var i in this.characters) {
            this.characters[i].display();
        }

        var statsText = "";
        if (this.getCharacter("navigator")) {
            statsText += "Estimated days left"
        }
        if (statsText.length == 0) {
            statsText = "Nobody knows anything useful."
        }
        $("#stats").text(statsText);
    };
}
