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
    loopCanoloop = setInterval(loopCano,1400);
    // acao de pulo para comecar o jogo
    pulaFrango();
}
// funcao para upar a velocidade a a rotacao do Frango
function atualizaFrango(frango){
    rotacao = Math.min((velocidade/10)*90,90);
    // aplicando a rotacao no CSS (x,y)
    $(frango).css({rotate: rotacao, top: posicao});
}
function loopJogo(){
    var frango = $("#frango");
    // upar a posicao e velocidade do pranfo
    velocidade += gravidade;
    posicao += velocidade;
    // aplicar novos valores do frango
    atualizaFrango(frango);
    // cria o contorno para o player
    var box = document.getElementById("frango").getBoundingClientRect();
    var origLargura = 34.0;
    var origAltura = 24.0;
    var boxLargura = origLargura - (Math.sin(Math.abs(rotacao)/90*8))
    var boxAltura = (origAltura + box.height)/2;
    var boxLeft = ((box.width - boxLargura)/2) + box.left;
    var boxTop = ((box.height - boxAltura)/2) + box.top;
    var boxRight = boxLeft + boxLargura;
    var boxBottom = boxTop + boxAltura;
    // se acertar o rodape, o frango morre
    if(box.bottom >=$("#rodape").offset().top){
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

$(document).keydown(function(e){
// permitindo pulos pela barra de espaco
    // usando a barra de espaco
    if(e.keyCode == 32){
        if(pontuacao == estado.TelaRecorde){
            $("#play").click();
        }else{
            screenClick();
        }
    }
})
//usar o mouse ou o teclado para comecar
if('ontouchstart' in window)
    $(document).on('touchstart', screenClick);
else
    $(document).on('mousedown', screenClick);

function screenClick(){
    if(estadoAtual== estado.TelaJogo)
    {
        pulaFrango();
    }else if(estadoAtual == estado.TelaInicial){
        jogar()
    }
}

//funcao para passar o pulo e o som
function pulaFrango(){
    velocidade = pulo;
    
}
function setPontuacao(erase){
    var elemscore = $('#main-score')
    elemscore.empty()

    if(erase)
        return
    var digits = pontuacao.toString().split('')

    for(var i = 0; i<digits.length;i++){
        elemscore.append(`<img src='sprites/${digits[i]}.png`)
    }

}
//pontuacao obtida
function setPontuacaoObtida(){
    var elemscore = $('#pontuacao')
    elemscore.empty()

    var digits = pontuacao.toString().split('')

    for(var i = 0; i<digits.length;i++){
        elemscore.append(`<img src='sprites/${digits[i]}.png`)
    }

}
// set maior pontuacao
function setMelhorPontuacao(){
    var elemscore = $('#maior-pontuacao')
    elemscore.empty()

    var digits = pontuacao.toString().split('')

    for(var i = 0; i<digits.length;i++){
        elemscore.append(`<img src='sprites/${digits[i]}.png`)
    }

}

function mataFrango(){
    //pausando animacoes
    $('.animado').css('animation-play-state', 'paused')
    $('.animado').css('-webkit-animation-play-state', 'paused')

    //dropar o passainho do  footer
    var playerbottom = $('#frango').position().top + $('#frango').width()
    var floor = $('#limite-voo').height()
    var movey = Math.max(0, floor - playerbottom);
    $('#frango').transition({y: movey+'px',rotate:90},1000, 'easeInOutCubic') 
    
    estadoAtual = estado.TelaRecorde

    //destroi todos os games loops
    clearInterval(loopJogoloop)
    clearInterval(loopCanoloop)
    loopJogoloop = null
    loopCanoloop = null

    mostraPontuacao()
}
//mostra tela pontuacao
function mostraPontuacao(){
    $('#placar').css('display','block')
    setPontuacao(true)

    if(pontuacao > melhorPontuacao)
        //salva o score
        melhorPontuacao = pontuacao
        setCookie('melhor-pontuacao',melhorPontuacao,999)

    //muda o quadro de score
    setPontuacaoObtida();
    setMelhorPontuacao();

    $('#placar').css({y:'40px', opacity: 0})
    $('#play').css({y:'40px', opacity: 0})
    $('#placar').transition({y:'40px', opacity: 0},600,'ease',()=>{
        // quando a animacao terminar
        $('#play').transition({y:'0px', opacity:1},600,'ease')
    })
    //deixa o botao de replay com clique
    replayClicavel = true

}
$('#replay').click(()=>{
    if(!replayClicavel)
        return
    else
        replayClicavel = false
    
    $('#placar').transition({y:'-40px', opacity: 0},600,'ease',()=>{
        $('#placar').css('display', 'none')
        mostraTelaInicial()
    })
}) 
function maisUmPonto(){
    pontuacao +=1
    setMelhorPontuacao()
}
function atualizaCanos(){
    $('.cano').filter(()=>{
        return $(this).position().left <= -100
    }).remove()
    //add novo cano
    var padding = 80
    var constraint = 420 - canoAltura - (padding*2)
    var topheight = Math.floor((Math.random()*constraint)+padding)
    var bootomheight = (420 - pipeheight)-topheight
    var newpipe = $('<div class="cano animated"><div class"cano_topo" style="height:'+topheight+'px;"></div><div class="cano_debaixo" style="height:'+bootomheight+'px"></div></div>')
    $('#limite-voo').append(newpipe)
    canos.push(newpipe)
}