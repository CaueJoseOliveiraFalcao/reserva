<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id(); // Criação da chave primária
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade'); // Chave estrangeira para restaurantes
            $table->foreignId('table_id')->constrained()->onDelete('cascade'); // Chave estrangeira para mesas
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Chave estrangeira para usuários
            $table->date('date_reservation'); // Data da reserva
            $table->time('init_time'); // Hora de início da reserva
            $table->time('end_time'); // Hora de término da reserva
            $table->string('status'); // Status da reserva (ex: 'confirmada', 'cancelada', etc.)
            $table->timestamps(); // Campos created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
