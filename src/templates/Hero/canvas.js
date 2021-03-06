import {CanvasSpace, Line, Pt, Group, Create} from 'pts';

const galaxyStyle = {
  brightWhite: 'rgba(255,255,255,',
  brightBlue: 'rgba(0,50,204,',
  brightStars:'rgba(255,255,255,',
}

export function App (ID) {

  function createApp() {

    let space = new CanvasSpace('#' + ID).setup({bgcolor: 'transparent', resize: true, retina: true});
    let form = space.getForm();

    let pts = new Group();

    //// Demo code ---

    let pairs = [];
    let cursorNotFound = true;
    let brightness = 0;

    space.add({

      start:() => {
        pts = Create.distributeRandom( space.innerBound, 200 );
        let r = space.size.minValue().value;
        pts.forEach( (p, i) => {
          let ln = new Group( Pt.make(2, r, true), new Pt(0,0));
          ln.moveBy( space.center ).rotate2D( i*Math.PI/100, space.center );
          pairs.push(ln);
        });
      },
      animate: (time, ftime) => {
        pts.forEach( (p, i) => {
          let ln = pairs[i];
          ln.rotate2D( 5*i/1000000, space.center );
          let collinear = Line.collinear( ln[0], ln[1], space.pointer, 10);
          if (collinear) {
            if(!cursorNotFound) {
              if (brightness < 0.1) brightness += 0.00001;
              form.stroke(galaxyStyle.brightWhite + brightness +')').line(ln);
            }
            else form.stroke(galaxyStyle.brightWhite + 0 +')').line(ln);
          } else {
            cursorNotFound = false;
            let side = Line.sideOfPt2D( ln, space.center );

            if (brightness < 0.1) brightness += 0.00001;
            form.stroke( (side > 0) ? galaxyStyle.brightWhite + brightness +')' : galaxyStyle.brightBlue + brightness +')').line( ln );
          }
          form.fillOnly(galaxyStyle.brightStars + 0.8 + ')').points( ln, 0.5);
        });
      }
    });
    space.bindMouse().bindTouch().play();
  }

  createApp();

  return true;
}

export default App;