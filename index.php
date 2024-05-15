<?php
@session_start();
if(isset($_POST['login']) && isset($_POST['username'])){
    $_SESSION['username'] = $_POST['username'];
    echo true;
    die;
}
?>
<html>
    <head>
        <title>..:: Socket Chess ::..</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="css/chessboard.css"/>
        <link rel="stylesheet" type="text/css" href="css/styles.css"/>
        <script type="text/javascript" src="js/json3.js"></script>
        <script type="text/javascript" src="js/jquery-1.10.1.js"></script>
        <script type="text/javascript" src="js/chess.js"></script>
        <script type="text/javascript" src="js/chessboard.js"></script>
        <script type="text/javascript" src="js/functions.js"></script>
    </head>
    <body>
    <?
        if(!isset($_SESSION['username'])){
        ?>
            <div id="master">
            <div id="parent">
                <div id="board">
                    <img alt="" src="img/logo.jpg"/>
                    <label for="txtUser">Informe um apelido para iniciar:</label>
                    <br/>
                    <input type="text" name="txtUser" id="txtUser" maxlength="256" size="50"/>
                    <br/><br/>
                    <button name="btnEnviar" id="btnEnviar">Entrar</button>
                    <button name="btnLimpar" id="btnLimpar">Limpar</button>
                </div>
            </div>
        </div>
        <?
        }
        else{
        ?>
        <div id="master">
            <div id="parent">
                <div id="user">
                    <h2 id="username"><?=$_SESSION['username']?><h2>
                </div>
                <div id="board"></div>
                <div id="console">
                    <h4>Iniciou o jogo...<h4>
                </div>
            </div>
        </div>
        <script type="text/javascript">$(document).ready(init);</script>
        <?
        }
    ?>
    </body>
</html>