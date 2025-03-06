<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pay extends Model
{
        // Definindo os campos que podem ser preenchidos em massa
        protected $fillable = [
            'id_reservation',       // Chave estrangeira para a reserva
            'value',            // Valor do pagamento
            'status_pay', // Status do pagamento (pendente, pago, reembolsado)
            'date_pay',   // Data do pagamento
        ];
        // Relação com a reserva (um pagamento pertence a uma reserva)
        public function Reservation()
        {
            return $this->belongsTo(Reserva::class, 'id_reservation');
        }
}
