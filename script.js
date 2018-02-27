
var N = 0 , $front = 0 , $nbToShow = 0 , $delay = 0;

$.fn.extend({
  reloadCarousel : function(nbToShow,front,val){
    var carousel = $(this);
    var items = carousel.children("div.item");
    if(front>=N || front<0) front = 0;
    if(nbToShow>N || nbToShow<=0) nbToShow = Math.min(17,N);
    var M = Math.floor(nbToShow/2) - (1-nbToShow%2);
    
    var CW = carousel.width();
    carousel.css("padding-left",0.025*CW);
    CW = 0.95*CW;
    var CH = carousel.height();
    const W = 0.5*CW;
    const H = 0.8*CH;
    
    var Widths = [] , Heights = [] ;
    var Tops = [] , Margins = [];
    var sumW = 0.0;
  
    for(var i=1; i<=M; i++){
      Widths[i] = (1-i/10)*W;
      Heights[i] = (1-i/10)*H;
      Tops[i] = (CH - Heights[i])/2;
      sumW = sumW+Widths[i];
    }
    var a ;
    if(sumW>0.0){
      a= (CW - W) / (2*sumW) ;
    }
   
    for(var j = 1; j<=M; j++){
      Margins[j] = (1-a)*Widths[j];
    }
  
    var csss = [];
    
    
    
    for(var i=0; i<N; i++){
      var ind = (front-M+i)%N;
      if(ind<0) ind+=N;
      
      if(i<M){
        csss[ind] = {
          "width" : Widths[M-i]+"px",
          "height" : Heights[M-i]+"px",
          "top" : Tops[M-i]+"px",
          "margin-right": -Margins[M-i],
          "z-index" : i,
          "opacity": 1 - (M-i)/10,
          "display":"block",
          "-webkit-order":i+1,
          "order":i+1,
          "text-align":"float"
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
          "order": i+1,
          "text-align":"center"
        };
      }else if(i<2*M+1){
        csss[ind] = {
          "width" : Widths[i-M]+"px",
          "height" : Heights[i-M]+"px",
          "top" : Tops[i-M]+"px",
          "margin-left": -Margins[i-M],
          "z-index" : 2*M-i,
          "opacity": 1 + (M-i)/10,
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
    
    for(var i=0; i<N; i++){
      var ind = (front-M+i)%N;
      if(ind<0) ind += N;
      if((i==0 || i==2*M+1) && val == -1){
        if(i==0) items.eq(ind).fadeIn($delay,"linear");
        if(i==2*M+1) items.eq(ind).fadeOut($delay,"linear");
      }else if((i==2*M || i==N-1) && val == +1){
        if(i==2*M)  items.eq(ind).fadeIn($delay,"linear");
        if(i==N-1) items.eq(ind).fadeOut($delay,"linear");
      }else{
        items.eq(ind).animate(csss[ind],$delay,"linear");
      }
    }
    for(var i=0; i<N; i++){
      var ind = (front-M+i)%N;
      if(ind<0) ind += N;
      
      items.eq(ind).removeAttr("style");
      items.eq(ind).css(csss[ind]);
    }
  },

});


$(document).ready(function(){
  var carousel = $("#carousel");
  N = carousel.children().length;
  $nbToShow = 1;
  $front = 6;
  $delay = 800;
  
  var clickEnabled = true;
  function onClick(val){
    if(!clickEnabled) return ;
    clickEnabled = false;
    $front = ($front+val)%N;
    if($front<0) $front = $front + N;
    carousel.reloadCarousel($nbToShow,$front,val);
    setTimeout(function(){clickEnabled=true} , $delay);
  };
  
  carousel.reloadCarousel($nbToShow,$front,0);
  
  $(".left-control").on("click",function(){
    onClick(-1);
  });
  
  $(".right-control").on("click",function(){
    onClick(+1);
  });
  
});
