function main(){
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Bar{

        constructor(x, y, width, height, color, index){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;

        }
        update(micInput){
            const sound = micInput*1000;
            if(sound>this.height){
                this.height=sound;
            }else{
                this.height -= this.height * 0.09;
            }            
        }
        draw(context,volume){
            context.strokeStyle = this.color;
            context.fillStyle = this.color;
            context.save();

            context.translate(0,0);
            context.rotate(this.index*0.025);
            context.scale(1,1);
            
            context.strokeRect(this.x, 75, this.height/2, this.height/3);
            
            context.restore();
        }

        preDraw(context,volume){
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.save();
            context.scale(1,1+volume*0.4);
            context.fillRect(this.y/10.5, 0, this.width, this.height/50);
            context.rotate(this.index*0.025);            
            
            context.strokeRect(0, 45, this.width/5, -5);
            context.stroke();
            
            context.restore();
        }
    }

    const fftSize = 512;
    const microphone = new Microphone(fftSize);
    let bars = [];
    let barWidth = canvas.width/(fftSize/2);
    function createBars(){
        for(let i=0;i<(fftSize/2);i++){
            let color = 'hsl('+ i*2 +', 100%, 50%)';
            bars.push(new Bar(0, i * 1.5, 5, 50, color, i));
        }
    }
    createBars();
    let angle=0;
    function animate(){
        if(microphone.initialized){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            const samples = microphone.getSamples();
            const volume = microphone.getVolume();
            angle -= 0.002;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(angle);
            bars.forEach(function(bar,i){
                bar.update(samples[i]);
                bar.draw(ctx,volume);
                bar.preDraw(ctx,volume);
            });

            ctx.restore();
        }
        requestAnimationFrame(animate);
    }
    animate();
    this.window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
