var init = function(){

    var oBoard,oSocket;
    var oGame = new Chess();

    var doSocketConn = function(){
        oSocket = new WebSocket('ws://127.0.0.1:9734/chess');
        oSocket.onclose = function(oEvent){
            console.log('CLOSE', oEvent);
        };
        oSocket.onerror = function(oEvent){
            console.log('ERROR', oEvent);
        };
        oSocket.onmessage = function(oEvent){
            console.log('MESSAGE', oEvent);
            var oData = null;
            try{
                oData = JSON.parse(oEvent.data);
                oGame.move({
                     from      : oData.from
                    ,to        : oData.to
                    ,promotion : 'q'
                });
                oBoard.position(oGame.fen());
                if($('h4','div#console').size() > 5){
                    $('h4','div#console').last().remove();
                }
                $('div#console').prepend('<h4>' + oData.user + ' acabou de jogar...</h4>');
                updateStatus();
            }
            catch(oEx){
                alert('Problemas de comunicação com o servidor...');
            }
        };
        oSocket.onopen = function(oEvent){
            console.log('OPEN', oEvent);
        };
    };

    var onDragStart = function(sSource, sPiece, oPosition, sOrientation){
        if
        (
            oGame.game_over() === true || (oGame.turn() === 'w' && sPiece.search(/^b/) !== -1)
            ||
            (oGame.turn() === 'b' && sPiece.search(/^w/) !== -1)
        ){
            return false;
        }
    };

    var onDrop = function(sSource, sTarget){
        var sReturn = 'snapback';
        if(oSocket.readyState != oSocket.OPEN){
            doSocketConn();
            alert('Não conectado ao servidor. Tentando novamente...');
            setTimeout(function(){
                var move = oGame.move({
                     from      : sSource
                    ,to        : sTarget
                    ,promotion : 'q'
                });
                if(move === null){
                    return false;
                }
                oSocket.send(JSON.stringify({
                     from : sSource
                    ,to   : sTarget
                    ,user : $('h2#username').text()
                }));
                updateStatus();
                oBoard.position(oGame.fen());
            },300);
            return sReturn;
        }
        var move = oGame.move({
             from      : sSource
            ,to        : sTarget
            ,promotion : 'q'
        });
        if(move === null){
            return sReturn;
        }
        oSocket.send(JSON.stringify({
             from : sSource
            ,to   : sTarget
            ,user : $('h2#username').text()
        }));
        updateStatus();
    };

    var onSnapEnd = function(){
        oBoard.position(oGame.fen());
    };

    var updateStatus = function(){
        var sColor = 'Branco';
        if(oGame.turn() === 'b'){
            sColor = 'Preto';
        }
        if(oGame.in_checkmate() === true){
            alert(sColor + ' em check mate!');
        }
        else if(oGame.in_draw() === true){
            alert('Game over!');
        }
        else {
            if(oGame.in_check() === true){
                alert(sColor + ' em check!');
            }
        }
    };

    doSocketConn();

    setTimeout(function(){
        if(oSocket.readyState != oSocket.OPEN){
            alert('Não foi possível conectar-se ao servidor...');
            return false;
        }
        var cfg = {
             draggable     : true
            ,showNotation  : false
            ,position      : 'start'
            ,moveSpeed     : 'slow'
            ,snapbackSpeed : 500
            ,snapSpeed     : 100
            ,onDragStart   : onDragStart
            ,onDrop        : onDrop
            ,onSnapEnd     : onSnapEnd
        };
        oBoard = new ChessBoard('board', cfg);
        updateStatus();
    },300);
};

$(document).ready(function(){
    var oBtnEnviar = $('button#btnEnviar');
    var oBtnLimpar = $('button#btnLimpar');
    var oUserName  = $('input#txtUser');
    if(oUserName.size() > 0 && oBtnEnviar.size() > 0 && oBtnLimpar.size() > 0){
        oUserName.focus();
        oBtnEnviar.click(function(){
            if(oUserName.val() == ''){
                oUserName.focus();
                return false;
            }
            $.ajax({
                 url      : 'index.php'
                ,method   : 'POST'
                ,dataType : 'script'
                ,async    : true
                ,data : {
                     login    : true
                    ,username : oUserName.val()
                }
                ,complete : function(){
                    document.location.reload();
                }
            });
        });
        oBtnLimpar.click(function(){
            oUserName.val('');
        });
    }
});