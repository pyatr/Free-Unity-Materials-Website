<?php

namespace server;

use src\mysqli;
use const src\link;

class DatabaseController
{
    private $DBConnection;

    function connect()
    {
        $this->DBConnection = new mysqli("FUM-database-service:", "root", "root");
        if (link . connection_status() != 0)
            echo "Could not connect\n";

    }
}