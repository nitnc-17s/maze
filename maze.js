app = new Vue({
  el: '#app',
  data: {
    x: 9,
    y: 9,
    maze: []
  },
  computed: {
    mazeCSS() {
      return this.maze.map(line => line.map(cell => cell ? "cell-black" : "cell-white"))
    },
    xy() {
      return this.x * this.y
    }
  },
  watch {
    xy() {
      const x = this.x
      const y = this.y
      const maze = [...Array(x)].map(() => Array(y).fill(1))

      function recursion(r, c) {
        const randDirs = generateRandomDirections();
        for (let i = 0; i < randDirs.length; i++) {
          switch(randDirs[i]) {
            case 1:
              if (r - 2 <= 0) continue
              if (maze[r - 2][c] != 0) {
                maze[r - 2][c] = 0
                maze[r - 1][c] = 0
                recursion(r - 2, c)
              }
              break;
            case 2:
              if (c + 2 >= y - 1) continue
              if (maze[r][c + 2] != 0) {
                maze[r][c + 2] = 0
                maze[r][c + 1] = 0
                recursion(r, c + 2)
              }
              break;
            case 3:
              if (r + 2 >= x - 1) continue
              if (maze[r + 2][c] != 0) {
                maze[r + 2][c] = 0
                maze[r + 1][c] = 0
                recursion(r + 2, c)
              }
              break;
            case 4:
              if (c - 2 <= 0) continue
              if (maze[r][c - 2] != 0) {
                maze[r][c - 2] = 0
                maze[r][c - 1] = 0
                recursion(r, c - 2)
              }
              break;
          }
        }
      }

      function generateRandomDirections() {
        const randoms = [1, 2, 3, 4]
        for (let i = randoms.length - 1; i >= 0; i--) {
          const r = Math.floor(Math.random() * (i + 1))
          const tmp = randoms[i]
          randoms[i] = randoms[r]
          randoms[r] = tmp
        }
        return randoms
      }

      maze[1][1] = 0
      recursion(1, 1)
      this.maze = maze
    }
  }
})
