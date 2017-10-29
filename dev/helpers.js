function makeid () {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
    return _.shuffle(possible).slice(0,5).join('');
};

function condition () {
    // randomly chooses between intuitive and explicit
    return ['intuitive','explicit'][_.random(0,1)];
};


function condition_instructions () {
    if (condition_string == 'explicit') {
        return "<p>You will then be asked to type in your descriptions, one for each side.</p>";
    } else {
        return "";
    }
};

function strokeCircle (x, y) {
    ctx.beginPath();
    ctx.arc(x,y,15,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

// For parsing url params
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return decodeURI(results[1]) || 0;
    }
}

