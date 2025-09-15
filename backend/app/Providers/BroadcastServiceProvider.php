<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \Illuminate\Notifications\Events\NotificationSent::class => [
            \App\Listeners\BroadcastUnreadCount::class,
        ],
    ];
}
