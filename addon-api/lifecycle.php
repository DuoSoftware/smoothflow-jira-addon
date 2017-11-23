<?php

/**
 * Created by PhpStorm.
 * User: Kalana
 * Date: 9/6/2017
 * Time: 11:33 AM
 */



class clientData{

    public $jirakey;
    public $clientKey;
    public $sharedSecret;
    public $serverVersion;
    public $pluginsVersion;
    public $baseUrl;
    public $productType;
    public $description;
    public $serviceEntitlementNumber;
    public $eventType;

}


class client
{

    public static function mapToObject($data, $class) {
        foreach ($data as $key => $value) {
            if($key != "key"){
                $class->{$key} = $value;
            }
            else{
                $class->{"jirakey"} = $value;
            }

        }

        return $class;
    }

    private function saveClient(){

        $clientData=new clientData();
        $post=json_decode(Flight::request()->getBody());
        client::mapToObject($post,$clientData);

        $namespace = $clientData->baseUrl;
        $namespace = str_replace("https://",'', $namespace);
        $namespace = str_replace("http://", '' , $namespace);
        $namespace = str_replace("atlassian.net", '' , $namespace);
        $namespace = $namespace.'JIRA'.MAIN_DOMAIN;
        $clientConn = ObjectStoreClient::WithNamespace($namespace,'jira',"123");
        $respond=$clientConn->store()->byKeyField("baseUrl")->andStore($clientData);
        $respond = json_decode(json_encode($respond), true);
        //$respond=json_encode($respond);
        if($respond['IsSuccess']==true){
            echo json_encode(["IsSuccess"=> true]);
        }
        else{
            echo json_encode(["IsSuccess"=> false]);
        }


    }

    private function enable(){

        $post=json_decode(Flight::request()->getBody());

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, SVC_NGINXPROXYMAKER_HOST.'/startdocker/'.$post->teanatId.'/all');
        curl_setopt($ch, CURLOPT_PORT, SVC_NGINXPROXYMAKER_PORT);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch);
        curl_close ($ch);


        $ch2 = curl_init();

        curl_setopt($ch2, CURLOPT_URL, SVC_NGINXPROXYMAKER_HOST.'/createKeyFile/'.$post->teanatId.'/none');
        curl_setopt($ch2, CURLOPT_PORT, SVC_NGINXPROXYMAKER_PORT);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch2);
        curl_close ($ch2);


        echo json_encode(["IsSuccess"=> true, "message" => $server_output]);




    }

    private function disable(){

        $post=json_decode(Flight::request()->getBody());

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, SVC_NGINXPROXYMAKER_HOST.'/suspenddocker/'.$post->teanatId.'/all');
        curl_setopt($ch, CURLOPT_PORT, SVC_NGINXPROXYMAKER_PORT);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch);
        curl_close ($ch);
        echo json_encode(["IsSuccess"=> true, "message" => $server_output]);


    }

    private function uninstall(){

        $post=json_decode(Flight::request()->getBody());

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, SVC_NGINXPROXYMAKER_HOST.'/suspenddocker/'.$post->teanatId.'/all');
        curl_setopt($ch, CURLOPT_PORT, SVC_NGINXPROXYMAKER_PORT);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch);
        curl_close ($ch);
        echo json_encode(["IsSuccess"=> true, "message" => $server_output]);

    }

    /*
    private function getClient($jiradomain, $requesturl){



        $clientConn = ObjectStoreClient::WithNamespace($jiradomain,'jira',"123");
        $respond=$clientConn->get()->byKey($jiradomain);


        $payload = new stdClass();
        $payload->iss = new stdClass();
        //$payload->body->rules = ;
        $payload->iat = "rule";
        $payload->exp = "rule";
        $payload->qsh = "rule";

        $jwthelper = new JWT();
        $token = $jwthelper->generateJWT($requesturl,'com.duoworld.smoothflow.jira','','');


        echo json_encode($respond);

    }*/

    private function test(){

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,"http://localhost:3500/command/notification");
        curl_setopt($ch, CURLOPT_POST, 1);
        //curl_setopt($ch, CURLOPT_POSTFIELDS,"postvar1=value1&postvar2=value2&postvar3=value3");
        // in real life you should use something like:
        // curl_setopt($ch, CURLOPT_POSTFIELDS,
        // http_build_query(array('postvar1' => 'value1')));
        // receive server response ...
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = curl_exec ($ch);

        curl_close ($ch);



        echo '{"message" : "Hello from the WF configuration service "}';
    }

    function processWebHook(){

        $post=json_decode(Flight::request()->getBody());
        $headers = getallheaders();

        foreach (getallheaders() as $name => $value) {
            echo "$name: $value\n";
        }

        echo $_SERVER['HTTP_AUTHORIZATION'];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'https://nginxproxymaker.plus.smoothflow.io/test?'.$_SERVER['QUERY_STRING']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json', 'Authorization :'.$_SERVER['HTTP_AUTHORIZATION']));

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch);
        curl_close ($ch);
        echo json_encode(["IsSuccess"=> true, "message" => $server_output]);



    }



    function __construct(){
        Flight::route("POST /webhookForward",function(){$this->processWebHook();});
        Flight::route("POST /client",function(){$this->saveClient();});
        Flight::route("POST /enable",function(){$this->enable();});
        Flight::route("POST /disable",function(){$this->disable();});
        Flight::route("POST /uninstall",function(){$this->uninstall();});
        Flight::route("POST /test",function(){$this->test();});
    }

}