<?php

namespace App\Models;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'value'
    ];
    public function Restaurant()
    {
        $this->belongsTo(Restaurant::class);
    }
}