<?php

namespace App\Providers;

use App\Events\ProjectCreated;
use App\Listeners\SendProjectToN8n;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $listen = [
            ProjectCreated::class => [
                SendProjectToN8n::class,
            ],
        ];
    }

    public function boot(): void
    {
        //
    }
}
