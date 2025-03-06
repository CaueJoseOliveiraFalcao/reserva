<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    // Definindo os campos que podem ser preenchidos em massa
    protected $fillable = [
        'restaurant_id',    // Chave estrangeira para restaurantes
        'table_id',         // Chave estrangeira para mesas
        'user_id',          // Chave estrangeira para usuários
        'date_reservation', // Data da reserva
        'init_time',        // Hora de início
        'end_time',         // Hora de término
        'status',           // Status da reserva
    ];

    // Relação com o restaurante
    public function Restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
    public function Pay()
    {
        return $this->hasMany(Pay::class);
    }
    // Relação com a mesa
    public function tables()
    {
        return $this->belongsTo(Table::class);
    }

    // Relação com o usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}