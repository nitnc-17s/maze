/*jshint esversion:6*/
app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    x: 9,
    y: 9,
    maze: [],
    match: [],
    maze2: [],
    numberOfSuccesses: 0,
    numberOfFailures: 0
  },
  methods: {
    regenMaze() {
      this.generateMaze();
      this.init();
    },
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
      this.maze = maze;
    },
    init() {
      this.match = [...Array(this.x)].map(() => Array(this.y).fill(4));
      this.maze.map((line, x) => {
        this.$set(this.maze2, x, []);
        line.map((cell, y) => {
          this.$set(this.maze2[x], y, cell);
        });
      });
      this.numberOfSuccesses = 0;
      this.numberOfFailures = 0;
    },
    solveXTimes(x) {
      [...Array(x)].map(() => this.solve());
    },
    solve() {
      //0 miti
      //1 kabe
      let m = [];
      this.maze2.map((line, x) => {
        m[x] = []
        line.map((cell, y) => {
          m[x][y] = cell;
        });
      });
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
        if (x === this.x - 2 && y === this.y - 2) {
          total_flg = true;
          player_x = x;
          player_y = y;
          break;
        }
        if (sum == 8) {
          player_x = x;
          player_y = y;
          break;
        } else if (sum == 7) {
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
        this.numberOfSuccesses += 1;
      } else {
        this.numberOfFailures += 1;
      }
      m.map((line, x) => {
        this.$set(this.maze, x, []);
        line.map((cell, y) => {
          this.$set(this.maze[x], y, cell);
        });
      });
      let add = 0;
      add = total_flg ? 1 : -1;
      x = player_x;
      y = player_y;
      let memX = 0;
      let memY = 0;
      m[x][y] = 3;
      let mem_flg = true;
      //for(let i in m){for(let l in m[i]){console.log(m[i][l])}}
      while (true) {
        if (x == 1 && y == 1) break;
        mem_flg = true;
        if (m[x - 1][y] == 2) {
          if(m[x][y + 1] == 0) { match[x][y + 1] -= add; mem_flg = false; }
          if(m[x + 1][y] == 0) { match[x + 1][y] -= add; mem_flg = false; }
          if(m[x][y - 1] == 0) { match[x][y - 1] -= add; mem_flg = false; }
          if(!mem_flg)match[memX][memY] += add;
          m[x - 1][y]=3;
          memX = x;
          memY = y;
          x -= 1;
        } else if (m[x][y + 1] == 2) {
          if(m[x - 1][y] == 0) { match[x - 1][y] -= add; mem_flg = false; }
          if(m[x + 1][y] == 0) { match[x + 1][y] -= add; mem_flg = false; }
          if(m[x][y - 1] == 0) { match[x][y - 1] -= add; mem_flg = false; }
          if(!mem_flg)match[memX][memY] += add;
          m[x][y + 1] = 3;
          memX = x;
          memY = y;
          y += 1;
        } else if (m[x + 1][y] == 2) {
          if(m[x - 1][y] == 0) { match[x - 1][y] -= add; mem_flg = false; }
          if(m[x][y + 1] == 0) { match[x][y + 1] -= add; mem_flg = false; }
          if(m[x][y - 1] == 0) { match[x][y - 1] -= add; mem_flg = false; }
          if(!mem_flg)match[memX][memY] += add;
          m[x + 1][y] = 3;
          memX = x;
          memY = y;
          x += 1;
        } else if (m[x][y - 1] == 2) {
          if(m[x - 1][y] == 0) { match[x - 1][y] -= add; mem_flg = false; }
          if(m[x + 1][y] == 0) { match[x + 1][y] -= add; mem_flg = false; }
          if(m[x][y + 1] == 0) { match[x][y + 1] -= add; mem_flg = false; }
          if(!mem_flg)match[memX][memY] += add;
          m[x][y - 1] = 3;
          memX = x;
          memY = y;
          y -= 1;
        }
      }
      for(let i in m){
        for(let l in m[i]){
          if(m[i][l] == 3) m[i][l]=0;
        }
      }
    },
    cellCSS(cell, x, y) {
      if (x === 1 && y === 1) {
        return 'cell-start';
      }
      if (x === this.x - 2 && y === this.y - 2) {
        return 'cell-goal';
      }
      if (cell === 2) {
        return 'cell-trail';
      }

      switch (cell) {
        case 0:
          return 'cell-white';
        case 1:
          return 'cell-black';
        default:
          return '';
      }
    },
    cellStyle(x, y) {
      if (x != null || y != null) return 'line-height: 4em;';
      return 'line-height: ' + this.$refs[`cell-${x}-${y}`].width +';';
    }
  },
  computed: {
    xy() {
      return this.x * this.y;
    }
  },
  mounted() {
    this.regenMaze();
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
      this.regenMaze();
    }
  }
});
