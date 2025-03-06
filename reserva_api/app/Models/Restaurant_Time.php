<?php

namespace App\Models;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Model;

class Restaurant_Time extends Model
{
    protected $fillable = [
        'week_day',
        'open_time',
        'end_time',
    ];
    public function Restaurant()
    {
        $this->belongsTo(Restaurant::class);
    }
}
