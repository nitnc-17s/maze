/*jshint esversion:6*/
app = new Vue({
  el: '#app',
  data: {
    min: 5,
    step: 2,
    x: 9,
    y: 9,
    maze: [],
    match: [],
    maze2: [],
    goalnum: 0,
    notgoalnum: 0
  },
  methods: {
    generateMaze() {
      const x = this.x;
      const y = this.y;
      const maze = [...Array(x)].map(() => Array(y).fill(1));

      function recursion(r, c) {
        const randDirs = generateRandomDirections();
        for (let i = 0; i < randDirs.length; i++) {
          switch (randDirs[i]) {
            case 1:
              if (r - 2 <= 0) continue;
              if (maze[r - 2][c] != 0) {
                maze[r - 2][c] = 0;
                maze[r - 1][c] = 0;
                recursion(r - 2, c);
              }
              break;
            case 2:
              if (c + 2 >= y - 1) continue;
              if (maze[r][c + 2] != 0) {
                maze[r][c + 2] = 0;
                maze[r][c + 1] = 0;
                recursion(r, c + 2);
              }
              break;
            case 3:
              if (r + 2 >= x - 1) continue;
              if (maze[r + 2][c] != 0) {
                maze[r + 2][c] = 0;
                maze[r + 1][c] = 0;
                recursion(r + 2, c);
              }
              break;
            case 4:
              if (c - 2 <= 0) continue;
              if (maze[r][c - 2] != 0) {
                maze[r][c - 2] = 0;
                maze[r][c - 1] = 0;
                recursion(r, c - 2);
              }
              break;
          }
        }
      }

      function generateRandomDirections() {
        const randoms = [1, 2, 3, 4];
        for (let i = randoms.length - 1; i >= 0; i--) {
          const r = Math.floor(Math.random() * (i + 1));
          const tmp = randoms[i];
          randoms[i] = randoms[r];
          randoms[r] = tmp;
        }
        return randoms;
      }

      maze[1][1] = 0;
      recursion(1, 1);
      return maze;
    },
    initMatch() {
      for (let i = 0; i < this.x; i++) {
        this.match[i] = [];
        this.maze2[i] = [];
        for (let l = 0; l < this.y; l++) {
          this.match[i][l] = 4;
          this.maze2[i][l] = this.maze[i][l];
        }
      }
    },
    solve100() {
      for (let i = 0; i < 100; i++) {
        this.solve();
      }
    },
    solve() {
      //0 miti
      //1 kabe
      let m = [];
      for (let i in this.maze2) {
        m[i] = [];
        for (let l in this.maze2[i]) {
          m[i][l] = this.maze2[i][l];
        }
      }
      let match = this.match;
      let player_x = 1;
      let player_y = 1;
      let total_flg = false; //goal
      let x = player_x;
      let y = player_y;
      while (true) {
        m[x][y] = 2;
        let flg = [0, 0, 0, 0];
        flg[0] = m[x - 1][y] == 0 ? 1 : 2; //ue
        flg[1] = m[x][y + 1] == 0 ? 1 : 2; //migi
        flg[2] = m[x + 1][y] == 0 ? 1 : 2; //sita
        flg[3] = m[x][y - 1] == 0 ? 1 : 2; //hidari
        let r = Math.floor(Math.random() * 6) + 1; //1~6
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        let sum = flg.reduce(reducer); //goukei
        if (sum == 8) {
          if (x === this.x - 2 && y === this.y - 2) {
            total_flg = true;
          }
          player_x = x;
          player_y = y;
          break;
        } else if (sum == 7) {
          if (x === this.x - 2 && y === this.y - 2) {
            total_flg = true;
            player_x = x;
            player_y = y;
            break;
          }
          if (flg[0] == 1) {
            x -= 1;
            continue;
          } else if (flg[1] == 1) {
            y += 1;
            continue;
          } else if (flg[2] == 1) {
            x += 1;
            continue;
          } else if (flg[3] == 1) {
            y -= 1;
            continue;
          }
        } else {
          if (x === this.x - 2 && y === this.y - 2) {
            total_flg = true;
            player_x = x;
            player_y = y;
            break;
          }
          hoge: while (true) {
            let r = Math.floor(Math.random() * 6) + 1; //1~6
            if (flg[0] == 1 && match[x - 1][y] >= r) {
              x -= 1;
              break hoge;
            } else if (flg[1] == 1 && match[x][y + 1] >= r) {
              y += 1;
              break hoge;
            } else if (flg[2] == 1 && match[x + 1][y] >= r) {
              x += 1;
              break hoge;
            } else if (flg[3] == 1 && match[x][y - 1] >= r) {
              y -= 1;
              break hoge;
            }
          }
          continue;
        }
      }

      //goal
      if (total_flg) {
        this.goalnum += 1;
      } else {
        this.notgoalnum += 1;
      }
      m.map((line, x) => {
        line.map((cell, y) => {
          this.$set(this.maze[x], y, cell);
        });
      });

      let add = 0;
      add = total_flg ? 1 : -1;
      x = player_x;
      y = player_y;
      m[x][y] = 0;
      while (true) {
        if (x == 1 && y == 1) break;
        if (m[x - 1][y] == 2) {
          m[x - 1][y] = 0;
          match[x - 1][y] += add;
          x -= 1;
        } else if (m[x][y + 1] == 2) {
          m[x][y + 1] = 0;
          match[x][y + 1] += add;
          y += 1;
        } else if (m[x + 1][y] == 2) {
          m[x + 1][y] = 0;
          match[x + 1][y] += add;
          x += 1;
        } else if (m[x][y - 1] == 2) {
          m[x][y - 1] = 0;
          match[x][y - 1] += add;
          y -= 1;
        }
      }
    }
  },
  computed: {
    mazeHTML() {
      const mazeHTML = this.maze.map((line, x) =>
        line.map((cell, y) => {
          if (x === 1 && y === 1) {
            return { css: 'cell-start', text: `${x}:${y}` };
          }
          if (x === this.x - 2 && y === this.y - 2) {
            return { css: 'cell-goal', text: `${x}:${y}` };
          }
          if (cell === 2) {
            return { css: 'cell-trail', text: `${x}:${y}` };
          }

          switch (cell) {
            case 0:
              return { css: 'cell-white', text: `${x}:${y}` };
            case 1:
              return { css: 'cell-black', text: `${x}:${y}` };
            default:
              return { css: '', text: `${x}:${y}` };
          }
        })
      );

      return mazeHTML;
    },
    xy() {
      return this.x * this.y;
    }
  },
  mounted() {
    this.maze = this.generateMaze();
    this.initMatch();
  },
  watch: {
    x(val) {
      if (val < this.min) {
        this.x = min;
      }

      if (val % 2 === 0) {
        this.x = val - 1;
      } else {
        this.x = val;
      }
    },
    y(val) {
      if (val < this.min) {
        this.y = min;
      }

      if (val % 2 === 0) {
        this.y = val - 1;
      } else {
        this.y = val;
      }
    },
    xy() {
      this.maze = this.generateMaze();
      this.initMatch();
    }
  }
});
