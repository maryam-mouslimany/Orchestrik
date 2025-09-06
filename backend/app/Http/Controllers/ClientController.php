<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ClientService;

class ClientController extends Controller
{
    function getClients()
    {
        try {
            $clients = ClientService::getClients();
            if (!$clients)
                return $this->error('Clients Not Found');
            return $this->success($clients);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
