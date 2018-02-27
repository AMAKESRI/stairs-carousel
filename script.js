
var N = 0 , $front = 0 , $nbToShow = 0 , $delay = 0;

$.fn.extend({
  reloadCarousel : function(nbToShow,front,val){
    if(N==0) return;
    var carousel = $(this);
    var items = carousel.children("div.item");
    if(front>=N || front<0) front = 0;
    if(nbToShow>N || nbToShow<=0) nbToShow = N;
    var M = Math.floor(nbToShow/2) - (1-nbToShow%2);
    
    var CW = carousel.width();
    carousel.css("padding-left",0.025*CW);
    CW = 0.95*CW;
    var CH = carousel.height();
    const W = 0.5*CW;
    const H = 0.8*CH;
    
    var Widths = [] , Heights = [] ;
    var Tops = [] , Margins = [];

    
    var a = (CW-W)/2;
    var diff = 2*a/(M*M+M);
    var Ri ;
    
    Widths[0] = W;
    Heights[0] = H;
    
    for(var i=1; i<=M; i++){
      //Widths[i] = (1-i/(M+1))*W; another possible calcul
      Ri = (M-i+1)*diff;
      Widths[i] = Widths[i-1]/2 + Ri;
      Margins[i] = Widths[i] - Ri;
      Heights[i] = (1-i/(M+1))*H;
      Tops[i] = (CH - Heights[i])/2;
    }
    
  
    var csss = [];
    
    
    var ind;
    for(var i=0; i<N; i++){
      ind = $.fn.getNext(front, M,i);
      
      if(i<M){
        csss[ind] = {
          "width" : Widths[M-i]+"px",
          "height" : Heights[M-i]+"px",
          "top" : Tops[M-i]+"px",
          "margin-right": -Margins[M-i]+"px",
          "z-index" : i,
          "opacity": 1 - (M-i)/(M+1),
          "display":"block",
          "-webkit-order":i+1,
          "order":i+1,
          "text-align":i==M?"center":"float"
        };
      }else if(i==M){
        csss[ind] = {
          "width" : W+"px",
          "height" : H+"px",
          "top" : "10%",
          "z-index" : M,
          "opacity": "0.95",
          "display":"block",
          "-webkit-order":i+1,
          "order":i+1,
          "text-align":"center"
        };
      }else if(i<2*M+1){
        csss[ind] = {
          "width" : Widths[i-M]+"px",
          "height" : Heights[i-M]+"px",
          "top" : Tops[i-M]+"px",
          "margin-left": -Margins[i-M]+"px",
          "z-index" : 2*M-i,
          "opacity": 1 + (M-i)/(M+1),
          "display":"block",
          "-webkit-order":i+1,
          "order": i+1,
          "text-align":"right"
        };
      }else{
        csss[ind] = {
          "display":"none",
          "-webkit-order":i+1,
          "order": i+1
        };
      }
    }
    var j = 0; // just to avoid any future loop even it's not neccessay
    ind =  $.fn.getNext(front, M,val==-1?2*M+1:-1);
    var end = $.fn.getNext(front, M,val==-1?0:2*M);
    //items.eq(ind).fadeOut($delay,"linear");
    items.eq(ind).animate(csss[ind],$delay,"linear");
    while(ind!=end && j<2*M+1){
      ind = (ind+val)%N;
      if(ind<0) ind+=N;
      console.log(ind);
      items.eq(ind).animate(csss[ind],$delay,"linear");
      j++;
    }
    //items.eq(end).fadeIn($delay,"linear");
    items.eq(ind).animate(csss[ind],$delay,"linear");
    
    
    for(var i=0; i<N; i++){
      ind =  $.fn.getNext(front, M,i);
      items.eq(ind).removeAttr("style");
      items.eq(ind).css(csss[ind]);
    }
    if(M==0){
      items.eq(front).css({
        "left":"25%"
      });
    }
  },

});

$.fn.getNext = function(front , M , i){
  var res = (front - M + i)%N;
  if(res<0) res += N;
  return res;
};


$(document).ready(function(){
  var carousel = $("#carousel");
  N = carousel.children().length;
  console.log("N : "+N);
  $nbToShow =5;
  $front = 6;
  $delay = 800;
  
  var clickEnabled = true;
  function onClick(val){
    console.log("\n");
    if(!clickEnabled) return ;
    clickEnabled = false;
    $front = ($front+val)%N;
    if($front<0) $front = $front + N;
    carousel.reloadCarousel($nbToShow,$front,val);
    setTimeout(function(){clickEnabled=true} , $delay);
  };
  
  carousel.reloadCarousel($nbToShow,$front,+1);
  
  $(".left-control").on("click",function(){
    onClick(-1);
  });
  
  $(".right-control").on("click",function(){
    onClick(+1);
  });
  
});


