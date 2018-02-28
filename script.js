
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
    
    var Widths = [] ;
    var Heights = [] ;
    var Tops = [] ;
    var Margins = [];
    var Opacities = [];
    var Zindices = [];

    
    var a = (CW-W)/2;
    var diff = 2*a/(M*M+M);
    var Ri ;
    
    Widths[M+1] = W;
    Heights[M+1] = H;
    Margins[M+1] = W/2;
    Tops[M+1]=(CH-H)/2;
    Opacities[M+1] = "0.95";
    Zindices[M+1] = M;
    
    for(var i=M; i>=1; i--){
      //Widths[i] = (1-i/(M+1))*W; another possible calcul
      Ri = i*diff;
      Widths[i] = Widths[i+1]/2 + Ri;
      Margins[i] =Widths[i+1]/2; //Widths[i] - Ri;
      Heights[i] = (1-(M-i+1)/(M+1))*H;
      Tops[i] = (CH - Heights[i])/2;
      Opacities[i] = 1 - (M-i+1)/(M+1);
      Zindices[i] = i-1;
    }
    
    for(var i=M+2; i<=2*M+1; i++){
      Widths[i] = Widths[2*M+2-i];
      Margins[i] =Widths[i]/2; //Widths[i] - Ri;
      Heights[i] = Heights[2*M+2-i];
      Tops[i] = Tops[2*M+2-i];
      Opacities[i] = Opacities[2*M+2-i];
      Zindices[i] = Zindices[2*M+2-i];
    }
    
    var csss = [];
    var ind;
    
    for(var i=0; i<N; i++){
      ind = $.fn.getNext(front, M,i);
      if(i<2*M+1){
        csss[ind] = {
          "display":"block",
          "width" : Widths[i+1]+"px",
          "height" : Heights[i+1]+"px",
          "top" : Tops[i+1]+"px",
          "margin-right": -Margins[i+1]+"px",
          "z-index" : Zindices[i+1],
          "opacity": Opacities[i+1],
          "-webkit-order":i+1,
          "order":i+1,
          "text-align":(i<M?"left":(i==M?"center":"right")),
        };
      }else{
        csss[ind] = {
          "display":"none",
          "width" : "0px",
          "height" : "0px",
          "-webkit-order":i+1,
          "order": i+1
        };
      }
    }
    
    
      for(var i=0; i<N; i++){
        ind =  $.fn.getNext(front, M,i);
        items.eq(ind).removeAttr("style");
        items.eq(ind).css(csss[ind]);
      }
      if(M==0){
        //items.eq(front).animate({"display":"block"},"linear");
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
  var val = +1;
  N = carousel.children().length;
  $nbToShow =9;
  $front = 6;
  $delay = 700;
  
  var clickEnabled = true , autoActive = true;
  
  function onClick(){
    if(!clickEnabled) return ;
    clickEnabled = false;
    $front = $.fn.getNext($front,0,val);
    carousel.reloadCarousel($nbToShow,$front,val);
    setTimeout(function(){
      clickEnabled = true;
      autoActive = true;
    },$delay+100);
  };
  
  carousel.reloadCarousel($nbToShow,$front,+1);
  
  $(".left-control").on("click",function(){
    autoActive = false;
    val = -1;
    onClick();
  });
  
  $(".right-control").on("click",function(){
    autoActive = false;
    val = +1;
    onClick();
  });
  
  function autoCarousel(){
    if(autoActive){
      $front = $.fn.getNext($front,0,val);
      carousel.reloadCarousel($nbToShow,$front,val);
    }
    setTimeout(function(){
      autoCarousel();
    },10000);
  }
  
  autoCarousel();
  
});


