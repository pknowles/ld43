
$(function(){
    var game = new GameWorld();
    for (var i = 0; i < 5; ++i) {
        game.characters.push(new Character("somerole", "someability"));
    }
    game.display();
});
