<?php

namespace App\Services;
use App\Models\Client;

class ClientService
{
   static function getClients(){
            return Client::all();
        }
}
