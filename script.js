console.log("sanity check");

new Vue({
    el: '#main',
    data: {
        current:1,
        playerName: "",
        playerStats: {
            health: ["❤️","❤️","❤️","❤️","❤️","❤️","❤️"],
            attack: (Math.floor(Math.random() * 6) + 5),
            defense: (Math.floor(Math.random() * 6) + 5)
        },
        monsters: [],
        level: 0,
        randomMonster: 0,
        show: true,
        playerImages: ["monsters/pipo-enemy018.png", "monsters/pipo-enemy018a.png", "monsters/pipo-enemy018b.png"]
    },
    created: function() {
        document.onkeydown = this.onkeydown;
    },
    mounted: function() {
        console.log("mounted");
        var app = this;
        axios.get("monsters.json")
            .then(function({data}) {
                app.monsters = data;
                console.log("monsters", app.monsters);
                app.getRandomMonster();
            });
    },
    updated: function() {
        this.getRandomMonster();
    },
    methods: {
        getRandomMonster: function() {
            this.randomMonster = Math.floor(Math.random() * this.monsters[this.level].length);
        },
        increaseLevel: function() {
            this.level ++;
        },
        onkeydown: function(event) {
            if (event.keyCode == 39 && this.current <= 1 && this.show) {
                this.current++;
            }
            if (event.keyCode == 37 && this.current >= 1 && this.show) {
                this.current--;
            }
        }

    }
});
