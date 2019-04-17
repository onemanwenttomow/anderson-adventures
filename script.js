console.log("sanity check");

new Vue({
    el: '#main',
    data: {
        current: 1,
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
        gameover: false,
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
                app.getRandomMonster(0);
            });
    },
    updated: function() {
        // this.getRandomMonster();
    },
    methods: {
        restartGame: function() {
            this.show = true;
            this.current = 1;
            this.playerName = "";
            this.gameover = false;
            this.playerStats = {
                health: ["❤️","❤️","❤️","❤️","❤️","❤️","❤️"],
                attack: (Math.floor(Math.random() * 6) + 5),
                defense: (Math.floor(Math.random() * 6) + 5)
            };
            this.level = 0;
        },
        startGameEnterKey: function() {
            if (this.playerName) {
                this.show = false;
            }
        },
        getRandomMonster: function(n) {
            this.randomMonster = Math.floor(Math.random() * this.monsters[this.level + n].length);
        },
        increaseLevel: function() {
            this.monsters[this.level][this.randomMonster].attack += Math.floor(Math.random() * 3);
            this.monsters[this.level][this.randomMonster].defense += Math.floor(Math.random() * 3);
            this.level ++;
        },
        attackMonster: function() {
            console.log("attack monster");
            console.log("level: ", this.level);
            console.log("randomMonster: ", this.randomMonster);
            var monsterHearts = this.monsters[this.level][this.randomMonster].hearts;
            monsterHearts.shift();
            monsterHearts.push("🖤");
            if (monsterHearts.indexOf("🖤") === 0) {
                this.getRandomMonster(1);
                this.increaseLevel();
            }
        },
        attackPlayer: function() {
            var playerHealth = this.playerStats.health;
            playerHealth.shift();
            playerHealth.push("🖤");
            if (playerHealth.indexOf("🖤") === 0) {
                this.gameover = true;
            }
        },
        onkeydown: function(event) {
            if (event.keyCode == 39 && this.current <= 1 && this.show) {
                this.current++;
            }
            if (event.keyCode == 37 && this.current >= 1 && this.show) {
                this.current--;
            }
            if (event.keyCode === 13 && this.gameover) {
                this.restartGame();
            }
        }

    }
});
