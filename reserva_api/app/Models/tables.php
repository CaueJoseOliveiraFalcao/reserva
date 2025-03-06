<?php

namespace App\Models;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Model;

class tables extends Model
{
    protected $fillable = [
        'table_number',
        'table_capacity',
    ];
    public function Restaurant()
    {
        $this->belongsTo(Restaurant::class);
    }
    public function Reservation()
    {
        return $this->hasMany(Reservation::class);
    }
}
