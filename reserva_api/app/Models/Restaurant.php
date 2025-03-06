<?php

namespace App\Models;
use App\Models\Restaurant_Time;
use App\Models\Product;
use App\Models\tables;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'cnpj',
        'adress',
        'cnpj',
        'phone',
    ];
    public function Reservation()
    {
        return $this->hasMany(Reservation::class);
    }
    public function Restaurant_Time()
    {
        return $this->hasMany(Restaurant_Time::class);
    }
    public function tables()
    {
        return $this->hasMany(tables::class);
    }
    public function Product()
    {
        return $this->hasMany(tables::class);
    }
}
