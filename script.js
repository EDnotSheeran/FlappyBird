// -------------------------- Variaveis ----------------------------------
// modo de depuracao do jogo
var deubug = false;
// ocjeto para conjelar os estados
var estado = Object.freeze({
    TelaInicial: 0,
    TelaJogo: 1,
    TelaRecorde: 2
});
// variaveis de logica
var pontuacaoObtida; //armazena o score obtido
var gravidade = 0.25;
var velocidade = 0;
var posicao = 180;
var rotacao = 0;
var pulo = -4.6;
// variaveis de pontucao min e max
var pontuacao = 0;
var melhorPontuacao = 0;
// variaveis do cano
var canoAltura = 90;
var canoLargura = 52;
var canos = new Array();
// variavel de replay
var replayClicavel = false;
// looping do jogo
var loopJogoloop;
var loopCanoloop;

// -------------------------- FUNCOES ----------------------------------
// assim que o documento carregar comeca a rodar o jogo
$(document).ready(function(){
    if(window.location.search == "?debug"){
        deubug = true;
    }
    if(window.location.search == "?eazy"){
        canoAltura = 200;
    }

// captura o Recorde pelo coockie
    var pontuacaoSalva = getCookie("recorde");
    if(pontuacaoSalva != ""){
        melhorPontuacao = parseInt(pontuacaoSalva);
    }
// comecar com a tela inical
    mostraTelaInicial();
});

// funcao para capturar o cookie e mostrar o score posteriormente
function getCookie(cnome){
    var nome = cnome + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i<ca.length;i++){
        var c = ca[i].trim();
        if(c.indexOf(nome)==0) return c.substring(nome.length,c.length);
    }
    return "";
}
// setar o cookie por nome valor e tempo para espirar
function setCookie(cnome,cvalor,tempo){
    var d = new Date();
    d.setTime(d.getTime()+(tempo*24*60*60*100));
    var expira = "expira"+d.toGMTString();
    document.cookie = cnome + "=" + cvalor + ";" + expira;
}
// funcao que mostra a tela inicial
function mostraTelaInicial(){
 // amazena o estado do jogo 
    estadoAtual = estado.TelaInicial;
// setar valores iniciais
    velocidade = 0;
    posicao = 180;
    rotacao = 0;
    pontuacao = 0;
// reseta a posicao do frangp para um novo jogo 
    $(frango).css({ y:0, x:0});
    atualizaFrango($("#frango"));

// limpar os canos para iniciar o jogo
    $(".canos").remove();
    canos = new Array();//inicia outra array
// comeca a animacao das sprites novamente
    $(".animado").css('animation-play-state',"running");
    $(".animado").css('animation-play-state',"running");
// fade para a tela inicial aparecer
    // $("#tela").transition({opacity:1},2000,'ease');-----------------------------------
}
// funcao para comecar o jogo
function jogar(){
    // armazena o estado do jogo
    estadoAtual = estado.TelaJogo;
    // fade para a tela sumir
    $("#tela").stop();
    // $("#tela").transition({opacity:0}, 500, 'ease');-----------------------------------
    // mostra o score no top do jogo
    setPontuacao();
    // debug para considerar as bordas ao redor
    if(deubug){
        $(".contorno").show();
    }
    // comecar os loops do jogo - aumentar tempo e intervalo
    var upauVaiComer = 1000.0 / 60.0;// 60fps
    loopJogoloop = setInterval(loopJogo, upauVaiComer);
    loopCanoloop = setInterval(lopCano,1400);
    // acao de pulo para comecar o jogo
    pulaFrango();
}
// funcao para upar a velocidade a a rotacao do Frango
function atualizaFrango(frango){
    rotacao = Math.min((velocidade/10)*90,90);
    // aplicando a rotacao no CSS (x,y)
    $(frango).css({rotate: rotacao, top: posicao});
}
function jogoLoop(){
    var frango = $("#frango");
    // upar a posicao e velocidade do pranfo
    velocidade += gravidade;
    posicao += velocidade;
    // aplicar novos valores do frango
    atualizaFrango(frango);
    // cria o contorno para o player
    var box = document.getElementById("player").getBoundingClientRect();
    var origLargura = 34.0;
    var origAltura = 24.0;
    var boxLargura = origLargura - (Math.sin(Math.abs(rotation)/90*8))
    var boxAltura = (origAltura + box.height)/2;
    var boxLeft = ((box.width - boxLargura)/2) + box.left;
    var boxTop = ((box.height - boxAltura)/2) + box.top;
    var boxRight = boxLeft + boxLargura;
    var boxBottom = boxTop + boxAltura;
    // se acertar o rodape, o frango morre
    if(box.bottom >=$("#rodape".offset().top)){
        mataFrango();
        return;
    } 
    // se tentar passar pelo topo zera a posicao
    var parede = $("#parede");
    if(boxTop <= (parede.offset().top + parede.height())){
        posicao = 0;
    }
    // se nao tiver nenhum cano
    if(canos[0] == null){
        return;
    }
    // determinar area para os procximos canos
    var proxCano = canos[0];
    var proxCanoTopo = proxCano.children('.cano_topo');
    var canoTop = proxCanoTop.offset().top + proxCanoTop.height;
    var canoLeft = proxCanoTop.offset().left - 2;
    var canoRight = canoLeft + canoLargura;
    var canoBottom = canoTop + canoAltura;
    // se  cair dentro do cano
    if(boxRight > canoLeft){
        // estamos dentro dos tubos?
        if(boxTop > canoTop && boxBottom < canoBottom){
            
        }else{
            mataFrango();
            return
        }
    }
    // ja passou o cano?
    if(boxLeft > canoRight){
        // remove um cano e aparece outro
        canos.slice(0,1);
        //pontua assim que passa o cano 
        maisUmPonto();
    }
}
// permitindo pulos pela barra de espaco
    // usando a barra de espaco
    if(e.keyCode== 32){
        if(pontuacao == estado.TelaRecorde){
            $("#play").click();
        }else{
            screenClick();
        }
    }