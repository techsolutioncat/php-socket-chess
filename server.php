<?php
require_once('vendor/autoload.php');

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class ChessServer implements MessageComponentInterface{

    /*
     * @var SplObjectStorage
     */
    protected $clients;

    public function __construct(){
        $this->clients = new SplObjectStorage();
    }

    public function onClose(ConnectionInterface $oConn){
        $this->clients->detach($oConn);
    }

    public function onError(ConnectionInterface $oConn, Exception $oEx){
        $oConn->close();
    }

    public function onMessage(ConnectionInterface $oFrom, $xMessage){
        /* @var $oClient ConnectionInterface */
        foreach($this->clients as $oClient){
            if($oFrom != $oClient){
                $oClient->send($xMessage);
            }
        }
    }

    public function onOpen(ConnectionInterface $oConn){
        $this->clients->attach($oConn);
    }
}

$oAppSocket = new Ratchet\App('127.0.0.1', 9734);
$oAppSocket->route('/chess', new ChessServer(),               Array('*'));
$oAppSocket->route('/echo',  new Ratchet\Server\EchoServer(), Array('*'));
$oAppSocket->run();
?>