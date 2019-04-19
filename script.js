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
        defeatedMonsters: [],
        level: 0,
        randomMonster: 0,
        show: true,
        a: 0,
        b: 0,
        timesTables: [
            [ 10 ],
            [ 2 , 5 ],
            [ 3 , 4 ],
            [ 6 , 8 ],
            [ 6 , 7 , 9]
        ],
        userAnswer: 0,
        gameover: false,
        gameOverText: [
            {
                lineOne: "Game",
                lineTwo: "Over"
            },
            {
                lineOne: "Victory!",
                lineTwo: "Play Again?"
            }
        ],
        winLose: 0,
        wounded: "",
        playerwounded: "",
        playerImages: ["monsters/pipo-enemy018.png", "monsters/pipo-enemy018a.png", "monsters/pipo-enemy018b.png"]
    },
    created: function() {
        document.onkeydown = this.onkeydown;
    },
    mounted: function() {
        console.log(this.show);
        this.getMonsters();
        this.getNewNumbers();
    },
    updated: function() {
        if (!this.show) {
            setTimeout(() => {
                this.$refs.usernumber.focus();
            }, 1300);
        } else {
            setTimeout(() => {
                this.$refs.playername.focus();
            }, 1300);
        }
    },
    methods: {
        getMonsters: function() {
            var app = this;
            axios.get("monsters.json")
                .then(function({data}) {
                    app.monsters = data;
                    app.getRandomMonster(0);
                });
        },
        restartGame: function() {
            this.getMonsters();
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
            this.defeatedMonsters = [];
        },
        getNewNumbers: function() {
            this.userAnswer = null;
            var newNum = Math.floor(Math.random() * 9 + 1 + this.level);
            newNum > 9 ? this.a = 9 : this.a = newNum;
            this.b = this.timesTables[this.level][Math.floor(Math.random() * this.timesTables[this.level].length)];
        },
        startGameEnterKey: function() {
            this.playerName ? this.show = false : this.show = true;
        },
        getRandomMonster: function(n) {
            this.randomMonster = Math.floor(Math.random() * this.monsters[this.level + n].length);
        },
        increaseLevel: function() {
            this.monsters[this.level][this.randomMonster].attack += Math.floor(Math.random() * 3);
            this.monsters[this.level][this.randomMonster].defense += Math.floor(Math.random() * 3);
            this.level ++;
            this.getNewNumbers();
        },
        attackMonster: function() {
            this.wounded = "wounded";
            setTimeout(() => {
                this.wounded = "";
                var monsterHearts = this.monsters[this.level][this.randomMonster].hearts;
                monsterHearts.shift();
                monsterHearts.push("🖤");
                if (monsterHearts.indexOf("🖤") === 0 && this.level === 4) {
                    this.defeatedMonsters.push(this.monsters[this.level][this.randomMonster]);
                    this.winLose = 1;
                    this.gameover = true;
                } else if (monsterHearts.indexOf("🖤") === 0) {
                    this.defeatedMonsters.push(this.monsters[this.level][this.randomMonster]);
                    this.getRandomMonster(1);
                    this.increaseLevel();
                }
            },100);

        },
        attackPlayer: function() {
            this.playerwounded = "wounded";
            setTimeout(() => {
                this.playerwounded = "";
                var playerHealth = this.playerStats.health;
                playerHealth.shift();
                playerHealth.push("🖤");
                if (playerHealth.indexOf("🖤") === 0) {
                    this.winLose = 0;
                    this.gameover = true;
                }
            }, 100);
        },
        playerAnswerOutcome: function() {
            this.a * this.b == this.userAnswer ? this.attackMonster() : this.attackPlayer();
            this.getNewNumbers();
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
