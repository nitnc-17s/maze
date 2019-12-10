/*jshint esversion:6 */
app = new Vue({
    el: '#app',
    data: {
      x: 9,
      y: 9,
      maze: [],
      match: [],
      maze2: []
    },
    methods: {
      generateMaze() {
        const x = this.x
        const y = this.y
        const maze = [...Array(x)].map(() => Array(y).fill(1))
  
        function recursion(r, c) {
          const randDirs = generateRandomDirections();
          for (let i = 0; i < randDirs.length; i++) {
            switch(randDirs[i]) {
              case 1://ue
                if (r - 2 <= 0) continue
                if (maze[r - 2][c] != 0) {
                  maze[r - 2][c] = 0
                  maze[r - 1][c] = 0
                  recursion(r - 2, c)
                }
                break;
              case 2://migi
                if (c + 2 >= y - 1) continue
                if (maze[r][c + 2] != 0) {
                  maze[r][c + 2] = 0
                  maze[r][c + 1] = 0
                  recursion(r, c + 2)
                }
                break;
              case 3://sita
                if (r + 2 >= x - 1) continue
                if (maze[r + 2][c] != 0) {
                  maze[r + 2][c] = 0
                  maze[r + 1][c] = 0
                  recursion(r + 2, c)
                }
                break;
              case 4://hidari
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
  
        function generateRandomDirections() {//shahhuru
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
        return maze
      },
      match(){
          for(let i=0;i<this.y;i++){
              for(let l=0;l<this.x;l++){
                this.match[i][l]=4;
                this.maze2[i][l]=this.maze[i][l];
              }
          }
      },
      solve() {
        //0 miti
        //1 kabe
        let m = this.maze2;
        let player_x=1;
        let player_y=1;
        loop(player_x,player_y);//start
        let total_flg=false;//goal
        function loop(x,y){
            m[x][y]=2;
            let flg = [0,0,0,0];
            flg[0] = (m[x-1][y]==0)?1:2;//ue
            flg[1] = (m[x][y+1]==0)?1:2;//migi
            flg[2] = (m[x+1][y]==0)?1:2;//sita
            flg[3] = (m[x][y-1]==0)?1:2;//hidari
            let r = Math.floor(Math.random()*3)+1;//1~4
            const reducer = (accumulator, currentValue);
            let sum = flg.reduce(reducer);//goukei
            if(sum==8){
                if(x==this.x-1&&y==this.y-1){
                    total_flg=true;
                }
                player_x=x;
                player_y=y;
                return;
            }else {
                if(x==this.x-1&&y==this.y-1){
                    total_flg=true;
                    player_x=x;
                    player_y=y;
                    return;
                }
                if(flg[0]==1&&match[x-1][y]>=r){loop(x-1,y);}
                else if(flg[1]==1&&match[x][y+1]>=r){loop(x,y+1);}
                else if(flg[2]==1&&match[x+1][y]>=r){loop(x+1,y);}
                else if(flg[3]==1&&match[x][y-1]>=r){loop(x,y-1);}
            }
        }
        let add=0;
        add = (total_flg)?1:-1;
        x=player_x;
        y=player_y;
        while(true){
            if(x==1&&y==1)break;
            if(m[x-1][y]==2){x-=1;match[x-1][y]+=add;}
            else if(m[x][y+1]==2){y+=1;match[x][y+1]+=add;}
            else if(m[x+1][y]==2){x+=1;match[x+1][y]+=add;}
            else if(m[x][y-1]==2){y-=1;match[x][y-1]+=add;}
        }
      }
    },
    computed: {
      mazeCSS() {
        return this.maze.map(line => line.map(cell => cell ? "cell-black" : "cell-white"))
      },
      xy() {
        return this.x * this.y
      }
    },
    mounted() {
      this.maze = this.generateMaze()
    },
    watch: {
      xy() {
        this.maze = this.generateMaze()
      }
    }
})
